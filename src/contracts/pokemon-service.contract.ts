import { Cell } from "@framework/contracts";
import { Async } from "@framework/models";
import { PokemonListViewModel } from "@next-app/models";

export interface PokemonService {
  pokemon$: Cell<Async<PokemonListViewModel>>;
  loadInitial: () => void;
  next: () => void;
  prev: () => void;
}
