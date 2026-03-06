import { Cell, Async } from "@framework";
import { PokemonListViewModel } from "@next-app/models";

export interface PokemonService {
  pokemon$: Cell<Async<PokemonListViewModel>>;
  loadInitial: () => void;
  next: () => void;
  prev: () => void;
}
