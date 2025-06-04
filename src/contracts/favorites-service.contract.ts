import { SyncStore } from "@framework/contracts";

export type FavoritesService = SyncStore<Record<string, true>> & {
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
};
