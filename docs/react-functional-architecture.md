# Clean Functional Architecture in React (CSR)

A minimal, testable, and composable architecture for client-side React apps — built on closures, RxJS, and prop-based injection.

## 🧠 Core Concepts

- Inversion of Control via Closures
- Services are just function closures that encapsulate logic and state.
- No classes, no decorators, no DI framework — pure JavaScript.
- Prop Injection
- Components receive services or state slices as props.
- No React Context. No magic. Total control and testability.
- State-as-a-Service (RxJS Stores)
- Encapsulated, observable state slices (SyncStore, AsyncStore, etc.).
- less hooks and side effects, no useContext, no global state bloat.

## 💡 Why Avoid Context & hooks?

- Feature Traditional (Context/Redux) Clean FP Architecture
- Global State Setup Complex boilerplate Simple RxJS store closures
- Dependency Graph Hidden via hooks/context Explicit via props
- Reusability Context-bound Fully portable
- Testing Requires providers/mocking trees Plain mocks with zero React setup
- Composition Tied to tree structure Any order, any scope

## 🧩 Architecture Example

```ts
// userStore.ts
export const createUserStore = () => {
  const subject = new BehaviorSubject<User | null>(null);
  return {
    user$: subject.asObservable(),
    setUser: (u: User) => subject.next(u),
  };
};
```

```ts
// services.ts
let cachedServices: AppServices | null = null;

function buildServices(): AppServices {
  const userStore = createUserStore();

  return {
    userStore,
  };
}

export function getServices(): AppServices {
  if (!cachedServices) {
    cachedServices = buildServices();
  }

  return cachedServices;
}
```

```ts
// Page.tsx
const services = getServices();

function Page() {
  return <ComponentA userStore={services.userStore} />;
}
```

```ts
// ComponentA.tsx
export function ComponentA({ userStore }: Props) {
  const { user } = useObservable(userStore.user$);

  return user ? <Dashboard user={user} /> : <Login />;
}
```

## ✅ Advantages

- ✅ Zero boilerplate DI
- ✅ No context hell or state pyramid
- ✅ Total control of service and state lifecycles
- ✅ Fully framework-agnostic
- ✅ Easy to test and reuse anywhere
- ✅ Compatible with all build tools and meta-frameworks

## 🧠 Summary

This architecture treats components as renderers, not app roots.
All logic lives in services: functional closures, composed once, and injected via props.

Works beautifully with:

- Vite + React
- Electron
- React Native
- Expo
- Micro frontends
- Custom renderers
