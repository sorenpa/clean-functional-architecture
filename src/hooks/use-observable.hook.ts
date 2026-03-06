import { useMemo, useRef, useSyncExternalStore } from "react";
import { Observable } from "rxjs";

function createSyncObservable<T>(observable$: Observable<T>, initial: T) {
  let current = initial;
  return {
    subscribe: (callback: () => void) =>
      observable$.subscribe((value) => {
        current = value;
        callback();
      }),
    getSnapshot: () => current,
  };
}

export function useObservable<T>(observable$: Observable<T>, initial: T): T {
  const initialRef = useRef(initial);

  const sync$ = useMemo(
    () => createSyncObservable(observable$, initialRef.current),
    [observable$]
  );

  return useSyncExternalStore(
    (cb) => {
      const sub = sync$.subscribe(cb);
      return () => sub.unsubscribe();
    },
    () => sync$.getSnapshot(),
    () => sync$.getSnapshot()
  );
}
