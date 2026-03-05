import { asyncValue } from "@framework/helpers";
import { Async } from "@framework/models";
import { createCommand, createReactiveStore } from "@framework/factories";
import { PokemonService } from "@next-app/contracts";
import { PokemonListViewModel } from "@next-app/models";
import { AxiosInstance } from "axios";
import { getPokemonPage } from "./create-pokemon-requests";

export function createPokemonService(client: AxiosInstance): PokemonService {
  const store = createReactiveStore<Async<PokemonListViewModel>>(asyncValue.empty());
  const loadPageCommand = createCommand({ store, request: getPokemonPage(client) });

  const INITIAL_URL = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`;

  return {
    ...store,
    loadInitial: () => loadPageCommand.execute(INITIAL_URL),
    next: () => {
      const url = asyncValue.getMaybe(store.getSnapshot())?.paging.next;
      if (url) loadPageCommand.execute(url);
    },
    prev: () => {
      const url = asyncValue.getMaybe(store.getSnapshot())?.paging.previous;
      if (url) loadPageCommand.execute(url);
    },
  };
}
