import { createCell } from "@framework";
import { FavoritesService } from "@next-app/contracts";

export function createFavoritesService(): FavoritesService {
  const favorites$ = createCell<Record<string, true>>({});

  return {
    favorites$,
    toggle: (id: string) => {
      const current = favorites$.getSnapshot();
      const next = { ...current };
      if (next[id]) delete next[id];
      else next[id] = true;
      favorites$.set(next);
    },
    isFavorite: (id: string) => !!favorites$.getSnapshot()[id],
  };
}
