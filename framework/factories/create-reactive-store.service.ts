import { BehaviorSubject } from "rxjs";
import { ReactiveStore } from "../contracts";

export function createReactiveStore<T>(initial: T): ReactiveStore<T> {
  const serviceId = crypto.randomUUID();
  const subject = new BehaviorSubject<T>(initial);

  return {
    serviceId,
    state$: subject.asObservable(),
    getSnapshot: () => subject.getValue(),
    set: (state: T) => subject.next(state),
    reset: () => subject.next(initial),
  };
}
