import { Cell } from "@framework";
import { useObservable } from "./use-observable.hook";

export function useCell<T>(cell: Cell<T>): T {
  return useObservable(cell.state$, cell.getSnapshot());
}
