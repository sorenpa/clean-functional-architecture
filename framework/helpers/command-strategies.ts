import { debounceTime, exhaustMap, OperatorFunction, switchMap, throttleTime } from "rxjs";
import { CommandPreset } from "../models";

export function identityStrategy<T>(): OperatorFunction<T, T> {
  return (source$) => source$;
}

// --- Combination presets ---
export function debounceExhaust<TInput, TResult>(ms: number): CommandPreset<TInput, TResult> {
  return {
    strategy: debounceTime<TInput>(ms),
    concurrency: (project) => exhaustMap(project),
  };
}

export function debounceSwitch<TInput, TResult>(ms: number): CommandPreset<TInput, TResult> {
  return {
    strategy: debounceTime<TInput>(ms),
    concurrency: (project) => switchMap(project),
  };
}

export function throttleExhaust<TInput, TResult>(ms: number): CommandPreset<TInput, TResult> {
  return {
    strategy: throttleTime<TInput>(ms),
    concurrency: (project) => exhaustMap(project),
  };
}