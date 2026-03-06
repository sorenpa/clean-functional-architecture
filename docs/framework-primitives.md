# Framework Primitives

## Table of Contents

- [Cell](#cell)
- [Command](#command)
- [Command Presets](#command-presets)
- [Async Type](#async-type)
- [Maybe Type](#maybe-type)

## Cell

`Cell<T>` is the atomic unit of state. It holds a single value of type `T` — which can be anything from a primitive to a complex model or view model — in a reactive container:

```ts
export interface Cell<T> {
  state$: Observable<T>;   // RxJS stream of the current value
  getSnapshot(): T;        // synchronous read
  set(state: T): void;     // update value
  reset(): void;           // revert to initial value
}
```

Created via the factory:

```ts
import { createCell } from "@framework/factories";
import { asyncValue } from "@framework/helpers";

// synchronous state
const favorites$ = createCell<Record<string, true>>({});

// async state — initial value is Async.empty
const pokemon$ = createCell<Async<PokemonListViewModel>>(asyncValue.empty());
```

> **Note:** An initial value is required by design. The absence of a value is modelled explicitly
> via `asyncValue.empty()` (for async data) or `maybeValue.none()` (for optional values).

The type parameter determines the semantics:

| Usage | Cell type |
|---|---|
| Plain synchronous state | `Cell<T>` |
| Async data with lifecycle | `Cell<Async<T>>` |
| Optional synchronous value | `Cell<Maybe<T>>` |

Cells are typically not used directly by UI components. Instead, they are owned by **state containers** that expose them as named properties alongside action functions:

```ts
export function createTodoService() {
  const todos$ = createCell<Async<Todo[]>>(asyncValue.empty());

  return {
    todos$,       // exposed cell — UI reads from here
    load,         // action — UI calls this
  };
}
```

Components consume a cell via `useCell`:

```tsx
const Component: React.FC<{ service: TodoService }> = ({ service }) => {
  const todos = useCell(service.todos$);

  return renderAsyncValue(todos, {
    empty:   () => null,
    loading: () => <Spinner />,
    error:   (err) => <ErrorMessage error={err} />,
    success: (items) => <TodoList items={items} />,
  });
};
```

## Command

`Command<TInput>` connects a user action to an async effect and pushes the result into a Cell. The full pipeline is:

```
trigger → tempo → concurrency(effect) → projection → cell.set
```

```ts
export interface Command<TInput> {
  execute(input: TInput): void;
}
```

Created via `createCommand`:

```ts
import { createCommand, createCell } from "@framework/factories";
import { asyncValue } from "@framework/helpers";

const todos$ = createCell<Async<Todo[]>>(asyncValue.empty());

const loadTodos = createCommand({
  cell: todos$,
  effect: fetchTodos,              // (input) => Observable<TResult>
  tempo: debounceTime(300),        // optional: control input rate
  concurrency: switchMap,          // optional: default is exhaustMap
  projection: asyncProjection(),   // optional: wraps result in Async<T>
});

loadTodos.execute(pageUrl);
```

**Pipeline params:**

| Param | Type | Default | Purpose |
|---|---|---|---|
| `cell` | `Cell<Async<TResult>>` | required | receives projected output |
| `effect` | `(input: TInput) => Observable<TResult>` | required | the async operation |
| `tempo` | `OperatorFunction<TInput, TInput>` | passthrough | control input flow rate |
| `concurrency` | `ConcurrencyOperator` | `exhaustMap` | policy for overlapping executions |
| `projection` | `OperatorFunction<TResult, Async<TResult>>` | `asyncProjection()` | shape the result |

Because `Command` owns the lifecycle, state containers stay thin:

```ts
export function createTodoService(): TodoService {
  const todos$ = createCell<Async<Todo[]>>(asyncValue.empty());
  const loadCommand = createCommand({ cell: todos$, effect: fetchTodos });

  return {
    todos$,
    load: () => loadCommand.execute(undefined),
  };
}
```

## Command Presets

`CommandPreset<TInput, TResult>` is a `Partial<CommandParams>` — a reusable fragment of command configuration that can be spread into `createCommand`:

```ts
export type CommandPreset<TInput, TResult> = Partial<CommandParams<TInput, TResult>>;
```

Three combination presets are available in `@framework/helpers`:

| Preset | Tempo | Concurrency | Use case |
|---|---|---|---|
| `debounceSwitch(ms)` | `debounceTime` | `switchMap` | search / autocomplete |
| `debounceExhaust(ms)` | `debounceTime` | `exhaustMap` | debounced submit |
| `throttleExhaust(ms)` | `throttleTime` | `exhaustMap` | rate-limited actions |

Usage:

```ts
import { debounceSwitch, throttleExhaust } from "@framework/helpers";

// cancel in-flight on new keystroke
const searchCommand = createCommand({ cell, effect: fetchResults, ...debounceSwitch(300) });

// ignore rapid clicks while a request is in-flight
const pageCommand = createCommand({ cell, effect: fetchPage, ...throttleExhaust(200) });
```

The individual building blocks (`identityTempo`, `asyncProjection`) are also exported for use in custom presets.

## Async Type

`Async<T>` models the complete lifecycle of an asynchronous value:

```ts
export type Async<T> = AsyncEmpty | AsyncLoading | AsyncError | AsyncData<T>;
```

| Status | Meaning |
|---|---|
| `EMPTY` | No request has been made yet |
| `LOADING` | A request is in-flight |
| `ERROR` | The request failed |
| `DATA` | The request succeeded and data is available |

The `asyncValue` helper provides factories and accessors:

| Function | Purpose |
|---|---|
| `asyncValue.empty()` | Create an EMPTY value |
| `asyncValue.loading()` | Create a LOADING value |
| `asyncValue.error(err)` | Create an ERROR value |
| `asyncValue.data(value)` | Create a DATA value |

Render helper for declarative UI:

```ts
renderAsyncValue(todos, {
  empty:   () => null,
  loading: () => <Spinner />,
  error:   (err) => <ErrorMessage error={err} />,
  success: (items) => <TodoList items={items} />,
});
```

> **Note:** `asyncProjection()` — used inside `Command` — automatically drives these transitions:
> it emits `loading` when the effect starts, `data` on success, and `error` on failure.

## Maybe Type

`Maybe<T>` models an explicitly optional value. It replaces `T | undefined` with a type-safe discriminated union:

```ts
export type Maybe<T> = MaybeNone | MaybeSome<T>;
```

| Status | Meaning |
|---|---|
| `NONE` | Value is absent |
| `SOME` | Value is present |

The `maybeValue` helper provides factories and safe accessors:

| Function | Purpose |
|---|---|
| `maybeValue.none()` | Create an absent value |
| `maybeValue.some(x)` | Wrap a present value |
| `maybeValue.isSome(m)` | Type-safe presence check |
| `maybeValue.isNone(m)` | Type-safe absence check |
| `maybeValue.getMaybe(m)` | Extract value or `undefined` |
| `maybeValue.get(m)` | Extract value or throw |
| `maybeValue.getOr(m, fallback)` | Extract value or call fallback |

Render helper for declarative UI:

```ts
renderMaybeValue(selectedItem, {
  none: () => <Placeholder />,
  some: (item) => <ItemDetail item={item} />,
});
```

> **Note:** `Maybe<T>` is for synchronous optional values. For async data that may not have
> loaded yet, use `Async<T>` — its `EMPTY` status serves the same "not yet present" role.
