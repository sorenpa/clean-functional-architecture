import { ReactiveStore } from "@framework/contracts";

export type FavoritesService = ReactiveStore<Record<string, true>> & {
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
};
