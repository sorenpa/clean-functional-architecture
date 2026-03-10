import {
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  Subject,
  catchError,
  exhaustMap,
  map,
  of,
  startWith,
} from 'rxjs';
import { Cell, Command } from '../contracts';
import { asyncValue } from '../helpers';
import { Async } from '../models';

type Tempo<TInput> = MonoTypeOperatorFunction<TInput>;

type ConcurrencyPolicy<TInput, T> = (
  projection: (input: TInput) => Observable<Async<T>>,
) => OperatorFunction<TInput, Async<T>>;

export type CommandParams<TInput, T> = {
  cell: Cell<Async<T>>;
  effect: (input: TInput) => Observable<T>;
  tempo?: Tempo<TInput>;
  concurrency?: ConcurrencyPolicy<TInput, T>;
  reduce?: (prev: T, next: T) => T;
};

// Projects the effect result of type T into Async<T>, handling loading and error states
function asyncProjection<TInput, T>(
  effect: (input: TInput) => Observable<T>,
): (input: TInput) => Observable<Async<T>> {
  return (input) =>
    effect(input).pipe(
      map((data) => asyncValue.data(data)),
      catchError((error) => of(asyncValue.error(error))),
      startWith(asyncValue.loading()),
    );
}

// Updates the cell with the result of the effect, applying the reduce function if provided
function commitResult<T>(
  cell: Cell<Async<T>>,
  reduce?: (prev: T, next: T) => T,
): (result: Async<T>) => void {
  return (result) => {
    if (!asyncValue.hasData(result)) {
      cell.set(result);
      return;
    }
    if (reduce) {
      cell.update((prev) => {
        const prevData = asyncValue.getMaybe(prev);
        return asyncValue.data(
          prevData !== undefined ? reduce(prevData, result.data) : result.data,
        );
      });
    } else {
      cell.set(asyncValue.data(result.data));
    }
  };
}

// Factory function to create a command
export function createCommand<T>(params: CommandParams<void, T>): Command<void>;
export function createCommand<TInput, T>(params: CommandParams<TInput, T>): Command<TInput>;
export function createCommand<TInput, T>(params: CommandParams<TInput, T>): Command<TInput> {
  const { cell, effect, tempo, concurrency, reduce } = params;

  const trigger$ = new Subject<TInput>();

  const tempoControl: Tempo<TInput> = tempo ?? ((source$) => source$);
  const projection = asyncProjection(effect);
  const concurrencyPolicy = concurrency ? concurrency(projection) : exhaustMap(projection);
  const commit = commitResult(cell, reduce);

  // execute() → trigger$ → [tempo] → [concurrency → projection → effect] → commit → cell
  trigger$.pipe(tempoControl, concurrencyPolicy).subscribe(commit);

  return { execute: (input: TInput) => trigger$.next(input) };
}
