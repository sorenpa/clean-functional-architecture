import { AsyncStore } from "../contracts";
import { Async, AsyncStatus } from "../models";
import {
  BehaviorSubject,
  of,
  Subject,
  switchMap,
  takeUntil,
  timer,
} from "rxjs";

interface IInternalAsyncStore<T> extends AsyncStore<T> {
  run(
    fn: () => Promise<T>,
    configOverrides?: Partial<AsyncStoreConfig>
  ): Promise<void>;
}

interface AsyncStoreConfig {
  staleTime: number;
  debounceTime: number;
  deduplicate: boolean;
}

export function createAsyncStore<T>(params?: {
  initialState?: Async<T>;
  options?: Partial<AsyncStoreConfig>;
}): IInternalAsyncStore<T> {
  const baseConfig = {
    staleTime: 0,
    debounceTime: 300,
    deduplicate: true,
    ...params?.options,
  };

  const serviceId = crypto.randomUUID();
  const subject = new BehaviorSubject<Async<T>>(
    params?.initialState ?? { status: AsyncStatus.EMPTY }
  );

  let lastSuccessTime = 0;

  const inflightSubject = new BehaviorSubject<boolean>(false);
  const trigger$ = new Subject<{
    fn: () => Promise<T>;
    config: AsyncStoreConfig;
  }>();

  // Core run logic
  trigger$
    .pipe(
      switchMap(({ fn, config }) => {
        const now = Date.now();

        // Respect staleTime
        const current = subject.getValue();
        if (
          current.status === AsyncStatus.DATA &&
          config.staleTime > 0 &&
          now - lastSuccessTime < config.staleTime
        ) {
          return of(null); // Skip, still fresh
        }

        // Respect deduplication
        if (config.deduplicate && inflightSubject.getValue()) {
          return of(null); // Skip duplicate
        }

        inflightSubject.next(true);
        subject.next({ status: AsyncStatus.LOADING });

        return timer(config.debounceTime).pipe(
          switchMap(() => fn()),
          takeUntil(trigger$) // Cancel on new request
        );
      })
    )
    .subscribe({
      next: (result) => {
        if (result !== null) {
          lastSuccessTime = Date.now();
          subject.next({ status: AsyncStatus.DATA, data: result });
        }
        inflightSubject.next(false);
      },
      error: (error) => {
        subject.next({ status: AsyncStatus.ERROR, error });
        inflightSubject.next(false);
      },
    });

  return {
    serviceId,
    state$: subject.asObservable(), // TODO .pipe(distinctUntilChanged((a, b) => deepEqual(a, b)))
    getSnapshot: () => subject.getValue(),
    async run(fn, configOverrides) {
      trigger$.next({
        fn,
        config: {
          ...baseConfig,
          ...configOverrides,
        },
      });
    },
  };
}
