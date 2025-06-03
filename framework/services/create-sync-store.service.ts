import { SyncStore } from "../contracts";
import { BehaviorSubject } from "rxjs";

export function createSyncStore<T>(initialState: T): SyncStore<T> {
  const serviceId = crypto.randomUUID();
  const subject = new BehaviorSubject<T>(initialState);

  return {
    serviceId,
    state$: subject.asObservable(), // TODO .pipe(distinctUntilChanged((a, b) => deepEqual(a, b)))
    getSnapshot: () => subject.getValue(),
    update: (fn: (state: T) => T) => subject.next(fn(subject.getValue())),
    reset: () => subject.next(initialState),
  };
}
