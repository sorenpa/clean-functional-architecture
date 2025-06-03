import { Observable, Subscription } from "rxjs";

export function createSyncObservable<T>(
  observable$: Observable<T>,
  initial: T
) {
  let current = initial;

  const subscribe = (callback: () => void): Subscription => {
    const sub: Subscription = observable$.subscribe((value) => {
      current = value;
      callback();
    });

    return sub;
  };

  const getSnapshot = () => current;

  return {
    subscribe,
    getSnapshot,
  };
}
