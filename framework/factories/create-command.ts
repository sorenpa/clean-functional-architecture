import { exhaustMap, Subject } from "rxjs";
import { Command } from "../contracts";
import { asyncProjection, identityTempo } from "../helpers";
import { CommandParams } from "../models";

export function createCommand<TInput, TResult>(
  params: CommandParams<TInput, TResult>
): Command<TInput> {

  const { cell, effect, tempo, projection, concurrency } = params;

  const trigger$ = new Subject<TInput>();

  const tempoBehaviour = tempo ?? identityTempo();
  const concurrentBehaviour = concurrency ? concurrency(effect) : exhaustMap(effect);
  const projectionBehaviour = projection ?? asyncProjection();

  trigger$
    .pipe(
      tempoBehaviour,
      concurrentBehaviour,
      projectionBehaviour
    )
    .subscribe(cell.set);

  return {
    execute(input: TInput) {
      trigger$.next(input);
    },
  };
}
