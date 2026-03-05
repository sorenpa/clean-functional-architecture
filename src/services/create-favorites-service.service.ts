import { createReactiveStore } from "@framework/factories";
import { FavoritesService } from "@next-app/contracts";

export function createFavoritesService(): FavoritesService {
  const store = createReactiveStore<Record<string, true>>({});

  return {
    ...store,
    toggle: (id: string) => {
      const current = store.getSnapshot();
      const next = { ...current };
      if (next[id]) delete next[id];
      else next[id] = true;
      store.set(next);
    },
    isFavorite: (id: string) => !!store.getSnapshot()[id],
  };
}
