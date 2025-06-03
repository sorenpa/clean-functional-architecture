import { asyncValue } from "@framework/helpers";
import { createAsyncStore } from "@framework/services";
import { PokemonService } from "@next-app/contracts";
import { Pokemon, PokemonListViewModel } from "@next-app/models";
import { AxiosInstance } from "axios";

interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

const DEFAULT_LIMIT = 20;

export function createPokemonService(client: AxiosInstance): PokemonService {
  const store = createAsyncStore<PokemonListViewModel>();

  async function loadPage(url: string) {
    await store.run(async () => {
      const res = await client.get<PokemonApiResponse>(url);
      const { results, count, next, previous } = res.data;

      const offset = getOffsetFromUrl(url);
      const totalPages = Math.ceil(count / DEFAULT_LIMIT);
      const currentPage = Math.floor(offset / DEFAULT_LIMIT) + 1;

      return {
        data: results,
        paging: {
          currentPage,
          totalPages,
          hasNext: !!next,
          hasPrev: !!previous,
          next,
          previous,
        },
      };
    });
  }

  function getOffsetFromUrl(url: string | null): number {
    if (!url) return 0;
    const u = new URL(url);
    return parseInt(u.searchParams.get("offset") || "0", 10);
  }

  function loadInitial() {
    loadPage(
      `https://pokeapi.co/api/v2/pokemon?limit=${DEFAULT_LIMIT}&offset=0`
    );
  }

  function next() {
    const snapshot = store.getSnapshot();
    const nextUrl = asyncValue.getMaybe(snapshot)?.paging.next;
    if (nextUrl) loadPage(nextUrl);
  }

  function prev() {
    const snapshot = store.getSnapshot();
    const prevUrl = asyncValue.getMaybe(snapshot)?.paging.previous;
    if (prevUrl) loadPage(prevUrl);
  }

  return {
    serviceId: store.serviceId,
    state$: store.state$,
    getSnapshot: store.getSnapshot,
    loadInitial,
    next,
    prev,
  };
}
