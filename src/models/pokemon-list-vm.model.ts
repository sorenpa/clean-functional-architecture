import { Pokemon } from "./pokemon.model";

export interface PokemonListViewModel {
  data: Pokemon[];
  paging: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    next: string | null;
    previous: string | null;
  };
}
