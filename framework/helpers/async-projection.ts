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

export function asyncEffect<TInput, T>(
  fn: (input: TInput) => Observable<T>
): (input: TInput) => Observable<Async<T>> {
  return (input) => fn(input).pipe(asyncProjection());
}
