# Demo App

The `src/` folder contains a Next.js + React demo that shows the temporal state modelling framework in use. This document describes the architecture of that demo — the patterns for layering, dependency injection, and IoC that shape how the framework primitives (`Cell`, `Command`, `Async<T>`) are wired together in a real application.

These patterns are not part of the framework itself. They are one opinionated way to structure a React/Next.js app that uses the framework.

## Table of Contents

- [Aims](#aims)
  - [Eliminate React Context](#eliminate-react-context)
  - [Limit Side Effects to Business Logic and Async State](#limit-side-effects-to-business-logic-and-async-state)
  - [Enable Composability of Business Logic Without Hook Co-dependencies](#enable-composability-of-business-logic-without-hook-co-dependencies)
  - [Encapsulate useMemo, useCallback, and Related Boilerplate](#encapsulate-usememo-usecallback-and-related-boilerplate)
- [Architectural Principles](#architectural-principles)
  - [Functional Paradigm](#functional-paradigm)
  - [Clean/Hex-Inspired Layers](#cleanhex-inspired-layers)
  - [Dependencies as Services](#dependencies-as-services)
  - [Inversion of Control (IoC)](#inversion-of-control-ioc)

## Aims

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

🧱 Note: While this architecture leans functional, it remains fully compatible with OOP and class-based designs. You can replace closures with classes for services or state containers as long as they adhere to the same contracts and injection principles.

### Clean/Hex-Inspired Layers

This architecture is inspired by Clean Architecture and Hexagonal Architecture principles. In fact at its core its simply a lean functional version of these principles. The project structure reflects a clear separation of concerns between layers, aligned around business rules, infrastructure, and presentation.

Layer Breakdown:

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

Inversion of Control (IoC), often called Dependency Injection (DI), is a design principle aimed at **decoupling logic from its dependencies**. In this case, it's used to **decouple presentation logic from business logic** and infrastructure. This separation ensures UI components remain focused on rendering, while service modules encapsulate data access and domain behavior.

In this architecture, IoC is implemented via **functional closures** and **explicit dependency passing**, aligning with the functional programming paradigm.

- Service contracts are defined in `src/contracts`
- The wiring logic (DI container) lives in `src/system`

This approach promotes modularity, testability, and clean separation of concerns.

#### 🧩 Service Object (Composition Root)

The app's service object (`src/system/app-services.ts`) is a manual DI container — a single function that builds and caches all services:

```ts
let cachedServices: AppServices | null = null;

function buildServices(): AppServices {
  const pokeApiClient = createPokeApiClient();
  const pokemonService = createPokemonService(pokeApiClient);
  const favoritesService = createFavoritesService();

  return { pokemonService, favoritesService };
}

export function getServices(): AppServices {
  if (!cachedServices) {
    cachedServices = buildServices();
  }
  return cachedServices;
}
```

`buildServices` is the only place where services are wired together — dependencies flow in as plain arguments, with no DI framework or magic.

The composition root supports three common creation strategies, each expressed as a simple call-site pattern:

**1. Eager singleton** — created once, shared for the lifetime of the app:

```ts
const pokemonService = createPokemonService(pokeApiClient);
```

**2. Lazy singleton** — created on first access, then cached. No framework needed — just a closure:

```ts
function lazy<T>(factory: () => T): () => T {
  let instance: T | null = null;
  return () => (instance ??= factory());
}

const lazyService = lazy(() => createMyService());
```

**3. Transient** — a new instance on every call, expressed as a plain factory reference:

```ts
const transientService = () => createTransientService();
```

All three are just functions. No decorators, no container configuration, no lifecycle annotations — the semantics are entirely in the call-site shape.

#### 📦 Prop Injection (IoC in Practice)

Dependencies are passed via props, not through global imports, hooks or React Context. This is a lightweight, idiomatic way to apply IoC in functional React.

✅ Why Prop Injection?

**Testability** — Components are easily testable in isolation using mock services.

**Composability** — Features don't depend on a shared global state; they can be composed with different service instances.

**Predictability** — Dependencies are passed explicitly at component boundaries, making data flow clear and easy to debug.

**Decoupling** — UI doesn't know how services are implemented or wired — just what contract they satisfy.

```tsx
interface Props {
  pokemonService: PokemonService;
}

const PokemonList: React.FC<Props> = ({ pokemonService }) => {
  const data = useCell(pokemonService.pokemon$);
  return renderAsyncValue(data, { ... });
};
```

`PokemonList` is completely agnostic about how `pokemonService` is implemented — it simply uses the injected contract.
