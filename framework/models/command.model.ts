import { Observable, OperatorFunction } from "rxjs";
import { ReactiveStore } from "../contracts";
import { Async } from "./async.model";

export type ConcurrencyOperator<TInput, TResult> = (
  project: (input: TInput) => Observable<TResult>
) => OperatorFunction<TInput, TResult>;

export type CommandParams<TInput, TResult> = {
  store: ReactiveStore<Async<TResult>>;
  request: (input: TInput) => Observable<TResult>;
  strategy?: OperatorFunction<TInput, TInput>;
  concurrency?: ConcurrencyOperator<TInput, TResult>;
  lifecycle?: OperatorFunction<TResult, Async<TResult>>;
};

export type CommandPreset<TInput, TResult> = Partial<CommandParams<TInput, TResult>>;
