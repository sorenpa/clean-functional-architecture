import { Observable, OperatorFunction, catchError, map, of, startWith } from "rxjs";
import { Async } from "../models";
import { asyncValue } from "./async-value";

export function asyncProjection<T>(): OperatorFunction<T, Async<T>> {
  return (source$: Observable<T>) =>
    source$.pipe(
      map((data) => asyncValue.data(data)),
      catchError((error) => of(asyncValue.error(error))),
      startWith(asyncValue.loading())
    );
}
