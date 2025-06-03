import { useMemo, useSyncExternalStore } from "react";
import { Observable } from "rxjs";
import { createSyncObservable } from "@framework/helpers";

export function useObservable<T>(observable$: Observable<T>, initial: T): T {
  const syncObservable$ = useMemo(
    () => createSyncObservable(observable$, initial),
    [observable$, initial]
  );

  return useSyncExternalStore(
    (cb) => {
      const sub = syncObservable$.subscribe(() => cb());
      return () => sub.unsubscribe();
    },
    () => syncObservable$.getSnapshot(),
    () => syncObservable$.getSnapshot()
  );
}
