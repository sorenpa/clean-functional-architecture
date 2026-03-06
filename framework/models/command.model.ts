import { Observable, OperatorFunction } from "rxjs";
import { Cell } from "../contracts";
import { Async } from "./async.model";

export type ConcurrencyOperator<TInput, TResult> = (
  project: (input: TInput) => Observable<TResult>
) => OperatorFunction<TInput, TResult>;

export type CommandParams<TInput, TResult> = {
  cell: Cell<Async<TResult>>;
  effect: (input: TInput) => Observable<TResult>;
  tempo?: OperatorFunction<TInput, TInput>;
  concurrency?: ConcurrencyOperator<TInput, TResult>;
  projection?: OperatorFunction<TResult, Async<TResult>>;
};

export type CommandPreset<TInput, TResult> = Partial<CommandParams<TInput, TResult>>;
