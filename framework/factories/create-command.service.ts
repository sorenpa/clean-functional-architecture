import { exhaustMap, Subject } from "rxjs";
import { Command } from "../contracts";
import { asyncLifecycle, identityStrategy } from "../helpers";
import { CommandParams } from "../models";

export function createCommand<TInput, TResult>(
  params: CommandParams<TInput, TResult>
): Command<TInput> {

  const { store, request, strategy, lifecycle, concurrency } = params;

  const trigger$ = new Subject<TInput>();

  const strategyBehaviour = strategy ?? identityStrategy();
  const concurrentBehaviour = concurrency ? concurrency(request) : exhaustMap(request);
  const lifecycleBehaviour = lifecycle ?? asyncLifecycle();

  trigger$
    .pipe(
      strategyBehaviour,
      concurrentBehaviour,
      lifecycleBehaviour
    )
    .subscribe(store.set);

  return {
    execute(input: TInput) {
      trigger$.next(input);
    },
  };
}
