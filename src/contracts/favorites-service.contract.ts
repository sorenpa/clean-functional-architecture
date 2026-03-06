import { Cell } from "@framework/contracts";

export interface FavoritesService {
  favorites$: Cell<Record<string, true>>;
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
}
