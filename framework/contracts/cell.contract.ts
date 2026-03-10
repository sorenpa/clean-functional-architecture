import { Observable } from "rxjs";

export interface Cell<T> {
  state$: Observable<T>;
  getSnapshot(): T;
  set(state: T): void;
  update(fn: (prev: T) => T): void;
  reset(): void;
}
