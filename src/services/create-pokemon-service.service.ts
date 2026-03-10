import { asyncValue, Async, createCommand, createCell } from "@framework";
import { PokemonService } from "@next-app/contracts";
import { PokemonListViewModel } from "@next-app/models";
import { AxiosInstance } from "axios";
import { getPokemonPage } from "./create-pokemon-requests";

export function createPokemonService(client: AxiosInstance): PokemonService {
  const pokemon$ = createCell<Async<PokemonListViewModel>>(asyncValue.empty());
  const loadPageCommand = createCommand({
    cell: pokemon$,
    effect: getPokemonPage(client),
  });

  const INITIAL_URL = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`;

  return {
    pokemon$,
    loadInitial: () => loadPageCommand.execute(INITIAL_URL),
    next: () => {
      const url = asyncValue.getMaybe(pokemon$.getSnapshot())?.paging.next;
      if (url) loadPageCommand.execute(url);
    },
    prev: () => {
      const url = asyncValue.getMaybe(pokemon$.getSnapshot())?.paging.previous;
      if (url) loadPageCommand.execute(url);
    },
  };
}
