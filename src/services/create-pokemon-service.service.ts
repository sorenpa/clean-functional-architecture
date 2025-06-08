import { asyncValue } from "@framework/helpers";
import { Async } from "@framework/models";
import { createAsyncStore } from "@framework/services";
import { PokemonService } from "@next-app/contracts";
import { PokemonDetails, PokemonListViewModel } from "@next-app/models";
import { AxiosInstance } from "axios";
import {
  catchError,
  from,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
} from "rxjs";

interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

const DEFAULT_LIMIT = 20;

export function createPokemonService(client: AxiosInstance): PokemonService {
  const store = createAsyncStore<PokemonListViewModel>();

  function loadPage(url: string): void {
    store.run(async () => {
      const res = await client.get<PokemonApiResponse>(url);
      const { results, count, next, previous } = res.data;

      const offset = getOffsetFromUrl(url);
      const totalPages = Math.ceil(count / DEFAULT_LIMIT);
      const currentPage = Math.floor(offset / DEFAULT_LIMIT) + 1;

      // Instead of loading full pokemon here, build per-pokemon observables
      const rows = results.map((p) => ({
        name: p.name,
        rowData$: createPokemonDetailStream(p.url),
      }));

      return {
        data: rows,
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

  function createPokemonDetailStream(
    url: string
  ): Observable<Async<PokemonDetails>> {
    return from(client.get(url)).pipe(
      map((res) => res.data),
      map((pokemon) =>
        asyncValue.data({
          image: pokemon.sprites.front_default,
          types: pokemon.types,
          stats: pokemon.stats,
        })
      ),
      catchError((err) => of(asyncValue.error(err))),
      startWith(asyncValue.loading()),
      shareReplay(1)
    );
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
