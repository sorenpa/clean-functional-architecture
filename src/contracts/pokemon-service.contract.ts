import { ReactiveStore } from "@framework/contracts";
import { Async } from "@framework/models";
import { PokemonListViewModel } from "@next-app/models";

export interface PokemonService extends ReactiveStore<Async<PokemonListViewModel>> {
  loadInitial: () => void;
  next: () => void;
  prev: () => void;
}
