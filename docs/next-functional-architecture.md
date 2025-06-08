# Clean Functional Architecture in Next.js

A minimal, composable approach to app architecture using closures, prop injection, and RxJS — adapted for Next.js (App Router + Server Components).

---

## 🚀 Next.js Context

- **Server Components (RSC)** allow `async` logic at the component level.
- Common practice is to instantiate services _inside_ server components.
- This improves over CSR-only React, but still **couples logic to the render tree**.

---

## 🧠 Clean FP Architecture: Outside the Component Tree

### Core Ideas

1. **Inversion of Control via Closures**

   - Services are function closures that encapsulate logic and state.
   - Composed _outside_ the component tree in a `createServices()` container.

2. **Prop Injection**

   - SSR components receive services via props.
   - Keeps service instantiation decoupled from React.

3. **State-as-a-Service (RxJS Stores)**
   - Each slice of state is its own injectable, observable service.
   - Fully composable, testable, and shareable between CSR and SSR.

---

## ✅ Why Inject Services via Props?

| Pattern                | Inside RSC Body                  | Prop Injection (FP Arch)                    |
| ---------------------- | -------------------------------- | ------------------------------------------- |
| Service Lifecycle      | Bound to render                  | Explicitly controlled by container          |
| Separation of Concerns | Mixed logic/presentation         | Clear split (IoC vs View)                   |
| Composability          | Harder to override or share      | Fully composable container (createServices) |
| Framework Coupling     | Tied to React RSC                | Framework-agnostic                          |
| Portability            | Locked in to Next.js render tree | Usable in Node/Angular/React Native etc.    |

---

## 🧩 Architecture Example

This architecture fits naturally within the Next.js ecosystem as a client-side IoC composition root for stateful, reactive services.

It is not intended to replace SSR functionality — server-side rendering and data fetching (via getServerSideProps, static props, or server components) remain valuable for initial data load, SEO, and static content.

Instead, this approach complements SSR by providing a structured, reusable, and reactive service layer on the client that manages dynamic state, user interactions, and side effects.

```ts
// services.ts
let cachedServices: AppServices | null = null;

function buildServices(): AppServices {
  const pokeApiClient = createPokeApiClient();

  const pokemonService = createPokemonService(pokeApiClient);
  const favoritesService = createFavoritesService();

  return {
    favoritesService,
    pokemonService,
  };
}

export function getServices(): AppServices {
  if (!cachedServices) {
    cachedServices = buildServices();
  }

  return cachedServices;
}
```

```tsx
"use client";

import { getServices } from "@next-app/system";

const { favoritesService, pokemonService } = getServices();

export const PokemonListPage: React.FC = () => {
  return (
    <main>
      <h1 className="text-xl font-bold p-4">Pokémon</h1>
      <PokemonList
        pokemonService={pokemonService}
        favoritesService={favoritesService}
      />
    </main>
  );
};
```

```ts
export function PokemonList({ pokemonService, favoritesService }: Props) {
  const { data } = useStore(pokemonService);
  const favorites = useStore(favoritesService);

  useEffect(() => {
    pokemonService.loadInitial();
  }, [pokemonService]);

  return <>...</>;
}
```

## 🔁 Advantages

- ✅ Clear ownership of service lifecycl
- ✅ No hidden instantiations or implicit effects
- ✅ Easier to reason about dependencies
- ✅ Works in both SSR and CSR contexts
- ✅ Simple to test with plain mocks
- ✅ Compatible with all rendering modes (static, dynamic, ISR)

## 🧠 Summary

You don’t treat components as application roots.
You treat them as renderers.

- All real logic lives in services — which are:
- Pure closures
- Composed once
- Injected via props
- Observable via RxJS if needed

This pattern works beautifully with:

- Next.js SSR/CSR split
- React Server Components
- Angular (manually bypassing DI)
- Future frameworks (e.g., Svelte, Solid)
