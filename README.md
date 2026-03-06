# Temporal State Modelling

This repo contains two things:

- **`framework/`** — a small, framework-agnostic TypeScript library for modelling state that changes over time, built on RxJS. Leans functional — pure functions, composable primitives, no classes or decorators required. This is the portable artefact — designed to be copied into new projects.
- **`src/`** — a Next.js + React demo that puts the framework primitives to work, showing the state container pattern alongside clean architecture layering (contracts, services, composition root, prop injection). Follows FP principles throughout — closures over classes, explicit dependency passing over context or DI frameworks, and side effects isolated to service boundaries.

**This README documents the framework.** Demo app documentation is in [`docs/demo-app.md`](docs/demo-app.md).

> NOTE: Ideally these would be separate npm packages, but since this repo is for personal use rather than public distribution, they are kept together for convenience.

## Table of Contents

- [What This Is](#what-this-is)
- [Core Concepts](#core-concepts)
- [The State Container Pattern](#the-state-container-pattern)
- [Repo Folder Structure](#repo-folder-structure)
- [Documentation](#documentation)
- [Demo App](#demo-app)

## What This Is

Most frontend state management focuses on *where* state lives. This framework focuses on *when* it changes and *how* those changes are shaped.

At the heart is a simple idea: state is a value that evolves over time. That evolution is never raw — it has tempo, concurrency constraints, data projection, and explicit absence. Together these form **temporal state modelling**.

The framework is:

- **Framework-agnostic** — pure TypeScript + RxJS, no React, no Angular, no DOM
- **Composable** — small primitives that combine into larger state containers
- **Explicit** — no magic, no hidden subscriptions, no implicit lifecycle

## Core Concepts

| Primitive | Purpose |
|---|---|
| `Cell<T>` | A single reactive value — the atomic unit of state |
| `Command<TInput>` | Connects an action to an effect, with tempo, concurrency, and projection |
| `Async<T>` | Models the full lifecycle of an async value: empty → loading → data / error |
| `Maybe<T>` | Models an explicitly optional value — replaces `T | undefined` |

See [Framework Primitives](docs/framework-primitives.md) for the full reference.

## The State Container Pattern

Cells are not intended to be used in isolation. They are owned by **state containers** — functions or classes that encapsulate a logical state model and expose named cells alongside action functions.

```ts
// As a closure (React, Node, etc.)
export function createTodoService() {
  const todos$ = createCell<Async<Todo[]>>(asyncValue.empty());
  const loadCommand = createCommand({ cell: todos$, effect: fetchTodos });

  return {
    todos$,                                    // exposed cell — consumers subscribe to this
    load: () => loadCommand.execute(undefined), // action — triggers the command
  };
}

// As a class (Angular injectable, etc.)
@Injectable({ providedIn: 'root' })
export class TodoService {
  readonly todos$ = createCell<Async<Todo[]>>(asyncValue.empty());
  private readonly loadCommand = createCommand({ cell: this.todos$, effect: fetchTodos });

  load() { this.loadCommand.execute(undefined); }
}
```

The container is passed to consumers (components, other services) as a plain object or class instance. No specific DI framework is required — but the pattern is compatible with any of them.

State containers are also **composable** — one container can depend on another, reacting to its cells or triggering its actions:

```ts
export function createCartService(productService: ProductService) {
  const cart$ = createCell<CartItem[]>([]);

  // react to another container's cell via the observable stream
  productService.products$.state$.subscribe((products) => {
    // keep cart in sync when products change
  });

  return { cart$, addItem };
}
```

This makes it straightforward to build layered state models without any framework glue.

## Repo Folder Structure

```
.
├── framework/          # The framework — framework-agnostic temporal state primitives
│   ├── contracts/      # Cell<T> and Command<T> interfaces
│   ├── factories/      # createCell, createCommand
│   ├── models/         # Async<T>, Maybe<T>, CommandParams, CommandPreset
│   └── helpers/        # asyncValue, maybeValue, command presets, render helpers
│
├── src/                # Demo app (Next.js + React)
│   ├── app/            # Next.js routing, layout, and entrypoints
│   ├── contracts/      # App-specific service interfaces
│   ├── features/       # UI components and feature pages
│   ├── hooks/          # React bindings: useCell, useObservable
│   ├── models/         # App-specific domain models
│   ├── services/       # State containers for the demo domain
│   └── system/         # Service wiring (composition root)
└── docs/               # Reference documentation
```

## Documentation

| Document | Contents |
|---|---|
| [Framework Primitives](docs/framework-primitives.md) | `Cell`, `Command`, `Async<T>`, `Maybe<T>`, command presets |
| [Demo App](docs/demo-app.md) | How the framework is used in the Next.js / React demo |

## Demo App

The `src/` folder contains a Next.js + React demo that shows the framework in use. It is a demo, not part of the framework itself.

To run it:

```bash
git clone [this-repo]
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.
