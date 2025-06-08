import { useMemo, useRef, useSyncExternalStore } from "react";
import { Observable } from "rxjs";
import { createSyncObservable } from "@framework/helpers";

export function useObservable<T>(observable$: Observable<T>, initial: T): T {
  const initialRef = useRef(initial);

  const syncObservable$ = useMemo(
    () => createSyncObservable(observable$, initialRef.current),
    [observable$]
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
