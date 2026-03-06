import { BehaviorSubject } from "rxjs";
import { Cell } from "../contracts";

export function createCell<T>(initial: T): Cell<T> {
  const subject = new BehaviorSubject<T>(initial);

  return {
    state$: subject.asObservable(),
    getSnapshot: () => subject.getValue(),
    set: (state: T) => subject.next(state),
    reset: () => subject.next(initial),
  };
}
