import { debounceTime, exhaustMap, OperatorFunction, switchMap, throttleTime } from "rxjs";
import { CommandPreset } from "../models";
import { asyncProjection } from "./async-projection";

export { asyncProjection } from "./async-projection";
export { asyncEffect } from "./async-projection";

// --- Tempo defaults ---
export function identityTempo<T>(): OperatorFunction<T, T> {
  return (source$) => source$;
}

// --- Combination presets ---
export function debounceExhaust<TCell, TInput>(ms: number): CommandPreset<TCell, TInput> {
  return {
    tempo: debounceTime<TInput>(ms),
    concurrency: (project) => exhaustMap(project),
  };
}

export function debounceSwitch<TCell, TInput>(ms: number): CommandPreset<TCell, TInput> {
  return {
    tempo: debounceTime<TInput>(ms),
    concurrency: (project) => switchMap(project),
  };
}

export function throttleExhaust<TCell, TInput>(ms: number): CommandPreset<TCell, TInput> {
  return {
    tempo: throttleTime<TInput>(ms),
    concurrency: (project) => exhaustMap(project),
  };
}
