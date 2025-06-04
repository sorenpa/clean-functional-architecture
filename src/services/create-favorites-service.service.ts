import { createSyncStore } from "@framework/services";
import { FavoritesService } from "@next-app/contracts";

export function createFavoritesService(): FavoritesService {
  const store = createSyncStore<Record<string, true>>({});

  return {
    ...store,
    toggle: (id: string) => {
      store.update((current) => {
        const next = { ...current };
        if (next[id]) delete next[id];
        else next[id] = true;
        return next;
      });
    },
    isFavorite: (id: string) => !!store.getSnapshot()[id],
  };
}
