import { Observable, OperatorFunction } from "rxjs";
import { Cell } from "../contracts";

export type ConcurrencyOperator<TInput, TCell> = (
  project: (input: TInput) => Observable<TCell>
) => OperatorFunction<TInput, TCell>;

export type CommandParams<TCell, TInput = void> = {
  cell: Cell<TCell>;
  effect: (input: TInput) => Observable<TCell>;
  tempo?: OperatorFunction<TInput, TInput>;
  concurrency?: ConcurrencyOperator<TInput, TCell>;
};

export type CommandPreset<TCell, TInput = void> = Partial<CommandParams<TCell, TInput>>;
