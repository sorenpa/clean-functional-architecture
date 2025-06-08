# Clean Functional Architecture

## Table of Contents

- [How to run](#how-to-run)
- [Who Is This For?](#who-is-this-for)
- [Framework-Agnostic Design](#framework-agnostic-design)
- [Repo Folder Structure](#repo-folder-structure)
- [Aim of the Architecture](#aim-of-the-architecture)
- [Architectural Principles](#architectural-principles)
  - [Functional Paradigm](#functional-paradigm)
  - [Clean/Hex-Inspired Layers](#cleanhex-inspired-layers)
  - [Dependencies as Services](#dependencies-as-services)
  - [Inversion of Control (IoC)](#inversion-of-control-ioc)
- [Optional Architectural Concepts](#optional-architectural-concepts)
  - [RxJS Powered State Services](#rxjs-powered-state-services)
  - [Async Type](#async-type)

## How to run

This is a standard Next.js app. Next.js was chosen to demonstrate that the architecture works seamlessly in hybrid SSR/CSR environments — but the same patterns apply just as well to classic CSR or SSR-only apps.

> git clone [this-repo]

> npm install

> npm run dev

Then open http://localhost:3000 in your browser.

## Who Is This For?

If you’re tired of wrestling with:

- tangled Context pyramids that are hard to test,
- fragile dependency arrays and memoization hacks,
- hook call order issues or "hook loop" workarounds,
- unclear separation between effects, state, and services...

Then this architecture might be for you.

It’s designed for:

- Functional thinkers who want clear data flow and testable units,
- Minimalists who value simplicity over boilerplate,
- Scalable projects that need structure without heavyweight frameworks,
- Teams who want explicit dependency injection and without magic.

## Framework-Agnostic Design

While this architecture originated from a React use case, it is entirely framework-agnostic. The core concepts—Inversion of Control via closures, RxJS-based state, and explicit prop-based injection—are not tied to React, JSX, or the DOM.

The same service patterns can be used and reused across environments:

- ✅ React (CSR or SSR) — Works without context, hooks, or global state.
- ✅ Angular — Can coexist with or replace Angular DI in feature modules.
- ✅ Next.js — Fits cleanly into server/client boundaries with full control.
- ✅ Node.js / CLI tools — Great for composable backends and scripts.
- ✅ React Native / Expo — No dependency on browser APIs or DOM.
- ✅ Electron / Micro frontends — Encapsulated, testable service boundaries.

Because logic lives in plain closures and observable streams, platform concerns are decoupled from business logic—enabling true multi-platform reuse without vendor lock-in or leaky abstractions.

## Repo Folder Structure

This project follows a minimalist, functional frontend architecture that cleanly separates concerns, enabling composability, testability, and maintainability — all without introducing unnecessary complexity or external dependencies. It is inspired by the principles of Clean Architecture and Inversion of Control (IoC), but implemented using closures, interfaces, and RxJS observables — making it fully compatible with React's functional paradigm.

```bash
.
├── src/
│   ├── app/            # Next.js routing, layout, and entrypoints
│   ├── features/       # Presentation layer: UI components and feature logic
│   ├── services/       # App-specific business logic: reactive service closures
│   ├── contracts/      # App-specific contracts
│   ├── models/         # App-specific domain models
│   └── system/         # App-specific service orchestration and wiring (IoC composition root)
│
├── framework/          # Reusable app-agnostic base architecture patterns (e.g., generic services, types)
│   ├── services/       # Reusable app-agnostic business logic: reactive service closures
│   ├── contracts/      # Reusable app-agnostic contracts
│   ├── models/         # Reusable app-agnostic domain models
│   ├── hooks/          # Reusable app-agnostic hooks
│   └── helpers/        # Reusable app-agnostic helpers
└── ...
```

### 📁 `src/app/`

Next.js-specific structure: routes, layouts, and bootstrap logic.

### 📁 `src/features/`

Contains all presentation layer code — components, UI logic, and styling. These are lightweight, reactive, and do not directly import global services — instead, they receive dependencies via props (dependency injection through composition).

### 📁 `src/services/`

Contains service closures — reactive logic tied to features or business use cases. These services often use RxJS to manage state and side effects and are passed down explicitly to features.

### 📁 `src/contracts/`

Holds the contracts for the application — defining what services expose. This represents the application layer from Clean/Hex architecture, but adapted to a simpler functional structure.

### 📁 `src/models/`

Holds the domain models for the application — defining what domain data looks like. This represents the domain layer from Clean/Hex architecture, but adapted to a simpler functional structure.

### 📁 `src/system/`

Service orchestration and wiring for the application

### 📁 `framework/`

Reusable framework-level building blocks that abstract architectural patterns (e.g., state stores, async helpers). These can be reused across apps and are agnostic of app-specific logic. Follows same folder principles as above, only difference is the contents in the framework folder are app-agnostic in nature and could be used in any react based application.

The framework folder also includes self-explanatory `hooks/` and `helpers/` folders.

## Aim of the Architecture

This architecture is designed to address common pitfalls in typical React frontend development through clear, focused principles:

### Eliminate React Context

React Context is often misused as a global service locator. It is tightly coupled to React lifecycle, making testing difficult, causing indirect backwards references in the component tree, and disrupting the natural DOM hierarchy. This leads to fragile, hard-to-maintain, and opaque component dependencies.

### Limit Side Effects to Business Logic and Async State

By restricting side effects (e.g., API calls, data fetching, state mutations) to isolated services that manage async values explicitly, the UI layers stay clean and declarative. React components focus on rendering and user interaction, not lifecycle or caching logic.

### Enable Composability of Business Logic Without Hook Co-dependencies

Business logic lives in self-contained service closures that expose streams and imperative APIs. This eliminates tangled hook dependency arrays and inter-hook coordination complexities that commonly lead to bugs and boilerplate.

### Encapsulate useMemo, useCallback, and Related Boilerplate

All tedious memoization, callback stabilization, and performance optimizations live inside reactive service primitives or utilities, freeing component code from clutter and improving readability.

## Architectural Principles

### Functional Paradigm

This architecture embraces the functional programming paradigm, drawing inspiration from modern React and FP-style patterns. Instead of relying on class hierarchies, stateful objects, or shared mutable state, it uses pure functions, closures, and explicit data flow to drive behavior.

Functional constructs naturally align with modern frontend frameworks like React and are often:

**Leaner** — fewer abstractions, less boilerplate

**Composable** — behavior can be built from small, testable units

**Predictable** — side effects are controlled and isolated

Where appropriate, closures are used to encapsulate state and dependencies, forming testable, isolated units of business logic — often called services in this architecture.

🧱 Note: While this architecture leans functional, it remains fully compatible with OOP and class-based designs. You can replace closures with classes for services or stores as long as they adhere to the same contracts and injection principles.

### Clean/Hex-Inspired Layers

This architecture is inspired by Clean Architecture and Hexagonal Architecture principles. In fact at its core its simply a lean functional version of these principles. The project structure reflects a clear separation of concerns between layers, aligned around business rules, infrastructure, and presentation.

Layer Breakdown:

Folder Layer Responsibility
| Folder | Layer | Responsibility |
|----------------------|-------------------|---------------------------------------------------------------------------------|
| `/app`, `/features` | Presentation | UI components and view logic. Relies on services via props. |
| `/services` | Infrastructure | Side-effecting logic like API clients or persistence. Built as injectable services. |
| `/contracts` | Application | Application-facing service contracts (interfaces/types). Defines the _what_, not the _how_. |
| `/models` | Domain | Domain models, business logic, and app state shapes. Independent of infrastructure and UI. |
| `/system` | Composition / IoC | Wires services together. Responsible for building and injecting dependencies (IoC container). |

This layering encourages:

**Testability** — Core logic can be tested without involving UI or real dependencies

**Flexibility** — Infrastructure and UI can evolve independently as long as contracts are upheld

**Composability** — Features can be composed or reused across different apps or platforms

💡 Presentation depends on Application and Domain, but not Infrastructure. Infrastructure depends on Application and Domain, but not Presentation. This keeps dependencies flowing inward — a core idea in Clean and Hexagonal architectures.

### Dependencies as Services

In this architecture, all external behavior — including API calls, state management, data transformation, and even some business logic — is moved into dedicated services. A service is simply a closure or object that performs a task and is passed into the system via the Inversion of Control (IoC) pattern.

This includes not just infrastructure like HTTP clients or storage, but also domain logic such as filtering, sorting, or validation. Instead of embedding logic directly in components or hooks, responsibilities are abstracted into composable, testable units.

By treating infrastructure and business logic as services, we achieve:

- Clear boundaries between rendering, logic, and side effects
- Swappable implementations for mocking, testing, or adapting to new environments
- Centralized composition of dependencies, making wiring and lifecycle management explicit
- Minimal UI components that focus purely on rendering props and delegating behavior

#### 🧾 Service Contracts

Services are defined by contracts — usually TypeScript interfaces or function signatures — and injected via props, hooks, or factory functions. They are never hardcoded or globally imported.

#### 🏭 Factory/Closure Implementations

Stateful services are implemented as functional closures using factory functions. This pattern encapsulates state and behavior in a testable, composable unit that conforms to a predefined contract:

```ts
import { SomeServiceContract } from "../contracts";

export function createSomeService(...params): SomeServiceContract {
  let value = 0;

  function increment() {
    value += 1;
  }

  function getValue() {
    return value;
  }

  return {
    increment,
    getValue,
  };
}
```

This approach avoids shared mutable state, aligns with functional principles, and keeps services self-contained and side-effect-aware. It also allows easy mocking and replacement via IoC.

### Inversion of Control (IoC)

Inversion of Control (IoC), often called Dependency Injection (DI), is a design principle aimed at **decoupling logic from its dependencies**. In this case, it’s used to **decouple presentation logic from business logic** and infrastructure. This separation ensures UI components remain focused on rendering, while service modules encapsulate data access and domain behavior.

In this architecture, IoC is implemented via **functional closures** and **explicit dependency passing**, aligning with the functional programming paradigm.

- Service contracts are defined in `src/models/app-services.model.ts`
- The wiring logic (DI container) lives in `src/system`

This approach promotes modularity, testability, and clean separation of concerns.

#### 🧩 Service Object (Composition Root)

The app’s service object acts as a manual DI container. It supports three creation strategies:

1. 🟢 Eager (Singleton) Services

- Created immediately when the app starts
- Same instance reused throughout lifecycle
- Great for stateless or long-lived services

```ts
const eagerService = createEagerService();
```

**2. Lazy Singleton Services**

- Created on first use via a lazy initializer.
- The factory is called only once, then the instance is cached.
- Useful for costly or optional services.

```ts
import { createLazy } from "@framework/helpers";

const lazyService = createLazy(() => createLazyService());
```

**3. Transient Services**

- A new instance is created every time the factory function is called.
- Useful for per-request or per-session scoped services.

```ts
const instance1 = services.transientService();
const instance2 = services.transientService(); // different instance
```

**Example buildServices function**

```ts
function buildServices(): AppServices {

    const eagerService: createEagerService();
    const lazyService: createLazy(() => createLazyService());
    const transientService: () => createTransientService()

    return {
        eagerService,
        lazyService,
        transientService,
    };
}
```

This pattern is simple, explicit, and flexible — letting you control creation semantics without heavy DI frameworks or magic.

#### 📦 Prop Injection (IoC in Practice)

Dependencies are passed via props, not through global imports, hooks or React Context. This is a lightweight, idiomatic way to apply IoC in functional React.

✅ Why Prop Injection?

**Testability** — Components are easily testable in isolation using mock services.

**Composability** — Features don’t depend on a shared global state; they can be composed with different service instances.

**Predictability** — Dependencies are passed explicitly at component boundaries, making data flow clear and easy to debug.

**Decoupling** — UI doesn’t know how services are implemented or wired — just what contract they satisfy.

```ts
interface Props {
  counterService: ISyncStore<CounterModel>;
}

const CounterView: React.FC<Props> = ({ counterService }) => {
  const state = useSyncStore(counterService);
  return <div>Count: {state.count}</div>;
};
```

➡️ CounterView is completely agnostic about how counterService is implemented — it simply uses the injected contract.

## Optional Architectural Concepts

This section describes optional architectural concepts that could be applied by other means. These concepts are encouraged but are of lesser importance than the afore mentioned features.

### RxJS Powered State Services

Web frontends are inherently reactive: user actions, network events, and timers constantly trigger asynchronous changes that must be reflected in the UI. To manage this event-driven complexity, this architecture proposes leveraging RxJS — a powerful library for composing and reacting to asynchronous streams of data.

Many application services encapsulate reactive state — state that evolves over time and triggers UI updates. Examples include:

Loading and syncing remote data

Responding to user input

Managing complex flows (e.g., pagination, filters, selections)

Using RxJS for these cases provides:

✅ **Predictable** flow of data and side effects

🧱 **Composable** pipelines for transforming and combining streams

🧪 **Testable** units of logic independent from React or timing

🔌 **Decoupled logic**, easily consumed in any framework via .subscribe() or custom hooks

These service stores are typically implemented as closures that expose observables and imperative setters, offering both declarative and controlled ways to update state.

In essence, RxJS transforms the browser’s implicit event and state flow into something explicit, composable, and testable. It's a perfect match for frontend apps that require precise control over async behavior — without the chaos of callback chains or excessive local state.

Superpower mode activated ✅

### Generic Stores

The architecture provides two reusable store primitives that abstract common reactive state patterns: SyncStore and AsyncStore. These are located under `framework/services` and can be composed into other app-level services or reused directly.

#### 🔄 `SyncStore<T>` — Reactive State Slice

The SyncStore primitive encapsulates a single value/oject that changes over time. It provides:

- A **state$** RxJS `Observable<T>` stream of the current state
- A **getSnapshot()** method for synchronous reads
- An **update()** method for partial updates
- A **reset()** method to overwrite the value

This acts like a self-contained, service-injected Redux slice, without the boilerplate. The store lives outside of React, so it can be shared, composed, and reused in any environment (React or not).

IoC builder:

```ts
interface CounterModel {
  count: number;
}

function buildServices(): AppServices {
  const counterStore = createSyncStore<CounterStore>({ count: 0 });

  return {
    counterStore,
  };
}
```

component usage:

```ts
interface Props {
  counterService: ISyncStore<CounterModel>;
}

const Component: React.FC<Props> = ({ counterService }) => {
  const { count } = useSyncStore(counterService);

  ...
};
```

#### 📡 `AsyncStore<T>` — Remote Data with Status & Errors

The AsyncStore primitive is more abstract in nature. It provides an extendable utility closure for handling asynchronous data along with its lifecycle: loading, success, and error. It holds:

- A **state$** RxJS `Observable<Async<T>>` stream of the current state
- A **getSnapshot()** method for synchronous reads

Note here that the Async<T> type is a type that represents an async value, including that lifecycle information.

This functions as a resource-scoped service alternative to tools like React Query, where all operations related to a resource (e.g., CRUD for todos) are colocated in a single, injected service.

Example service implementation:

```ts
interface TodoApiResponse {
  results: Todo[];
}

export interface TodoService extends IAsyncStore<Todo[]> {
  loadAll: () => Promise<void>;
  // Add more resource specific CRUD actions here
}

export function createTodoService(): TodoService {
  const store = createAsyncStore<Todo[]>();

  async function loadAll(): Promise<void> {
    await store.run(async () => {
      const res = await fetch("https://domain/api/v2/todos");
      const json: TodoApiResponse = await res.json();
      return json.results;
    });
  }

  return {
    ...store,
    loadAll,
    // Add more resource specific CRUD actions here
  };
}
```

IoC builder usage:

```ts
function buildServices(): AppServices {
  const todos = createTodoService();

  return {
    todos,
  };
}
```

component usage:

```ts
interface Props {
  todoService: TodoService;
}

const Component: React.FC<Props> = ({ todoService }) => {
  const { data } = useAsyncStore(todoService);

  useEffect(() => {
    todoService.loadAll();
  }, [todoService]);

  return renderAsyncValue(data, {
    empty: () => null,
    loading: () => <div>Loading…</div>,
    error: (error) => <div>Error: {String(error)}</div>,
    success: (data) => (
      <ul className="p-4">
        {data.map((p) => (
          <li key={p.name} className="border-b py-2">
            {p.name}
          </li>
        ))}
      </ul>
    ),
  });
};
```

Because the store is framework-agnostic, it's easy to layer advanced behavior: shared caching, debouncing, optimistic updates, retry logic, etc. — all without tight React coupling.

### 🧩 Hooks

- **`useObservable`** – Subscribes to any RxJS stream and triggers re-renders on value changes.

  - 🧠 _Built on top of `useSyncExternalStore` for React 18+ compatibility. This ensures correct behavior with concurrent rendering and avoids issues like stale closures or missed updates._

- **`useSyncStore`** – A convenience hook that subscribes to a `SyncStore` using `useObservable`.

- **`useAsyncStore`** – Similar to `useSyncStore`, but for `AsyncStore`.

These hooks let you cleanly bind imperative reactive state into React’s declarative rendering model, without relying on `useEffect` or `Context`.

### Async Type

`Async<T>` is a generic type that models the lifecycle of an asynchronous value. It tracks whether data is loading, has succeeded, or failed, along with the associated value or error.

This pattern decouples the loading/error UI from any specific framework like React Query, and works in any RxJS-powered context.

Shape of Async<T>:

```ts
export interface AsyncBase<T> {
  status: AsyncStatus;
  data?: T;
  error?: unknown;
}

export interface AsyncEmpty extends AsyncBase<unknown> {
  status: AsyncStatus.EMPTY;
}

export interface AsyncLoading extends AsyncBase<unknown> {
  status: AsyncStatus.LOADING;
}

export interface AsyncError extends AsyncBase<unknown> {
  status: AsyncStatus.ERROR;
  error: unknown;
}

export interface AsyncData<T> extends AsyncBase<T> {
  status: AsyncStatus.DATA;
  data: T;
}

export type Async<T> = AsyncEmpty | AsyncLoading | AsyncError | AsyncData<T>;
```

**Benefits**

Makes async state explicit and type-safe

Enables declarative rendering with patterns like renderAsyncValue(...)

Easily extended to include additional metadata like timestamps or retry counts

Framework-agnostic and usable in any environment with observables

Example Usage in UI:

```ts
renderAsyncValue(todoService.getSnapshot(), {
  loading: () => <Spinner />,
  error: (err) => <ErrorMessage error={err} />,
  success: (todos) => <TodoList items={todos} />,
});
```

This provides a clean, centralized way to handle async UI states without repetitive if checks or nested loading logic.
