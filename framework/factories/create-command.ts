import { exhaustMap, Subject } from "rxjs";
import { Command } from "../contracts";
import { identityTempo } from "../helpers";
import { CommandParams } from "../models";

export function createCommand<TCell, TInput = void>(
  params: CommandParams<TCell, TInput>
): Command<TInput> {

  const { cell, effect, tempo, concurrency } = params;

  const trigger$ = new Subject<TInput>();

  const tempoControl = tempo ?? identityTempo();
  const concurrencyPolicy = concurrency ? concurrency(effect) : exhaustMap(effect);

  trigger$
    .pipe(
      tempoControl,
      concurrencyPolicy,
    )
    .subscribe(cell.set);

  return {
    execute(input: TInput) {
      trigger$.next(input);
    },
  };
}
