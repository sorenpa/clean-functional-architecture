import { PokemonListViewModel } from "@next-app/models";
import { AsyncStore } from "../../framework/contracts";

export interface PokemonService extends AsyncStore<PokemonListViewModel> {
  loadInitial: () => void;
  next: () => void;
  prev: () => void;
}
