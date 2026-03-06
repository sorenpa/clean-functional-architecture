import { catchError, debounceTime, exhaustMap, map, Observable, of, OperatorFunction, startWith, switchMap, throttleTime } from "rxjs";
import { Async, CommandPreset } from "../models";
import { asyncValue } from "./async-value";

// --- Tempo defaults ---
export function identityTempo<T>(): OperatorFunction<T, T> {
  return (source$) => source$;
}

// --- Projection defaults ---
export function asyncProjection<T>(): OperatorFunction<T, Async<T>> {
  return (source$: Observable<T>) =>
    source$.pipe(
      map((data) => asyncValue.data(data)),
      catchError((error) => of(asyncValue.error(error))),
      startWith(asyncValue.loading())
    );
}

// --- Combination presets ---
export function debounceExhaust<TInput, TResult>(ms: number): CommandPreset<TInput, TResult> {
  return {
    tempo: debounceTime<TInput>(ms),
    concurrency: (project) => exhaustMap(project),
  };
}

export function debounceSwitch<TInput, TResult>(ms: number): CommandPreset<TInput, TResult> {
  return {
    tempo: debounceTime<TInput>(ms),
    concurrency: (project) => switchMap(project),
  };
}

export function throttleExhaust<TInput, TResult>(ms: number): CommandPreset<TInput, TResult> {
  return {
    tempo: throttleTime<TInput>(ms),
    concurrency: (project) => exhaustMap(project),
  };
}
