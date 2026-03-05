import { asyncValue } from "@framework/helpers";
import { Async } from "@framework/models";
import { PokemonDetails, PokemonListViewModel } from "@next-app/models";
import { AxiosInstance } from "axios";
import { catchError, from, map, Observable, of, shareReplay, startWith } from "rxjs";

interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

const DEFAULT_LIMIT = 10;

function getOffsetFromUrl(url: string | null): number {
  if (!url) return 0;
  const u = new URL(url);
  return parseInt(u.searchParams.get("offset") || "0", 10);
}

function getPokemonDetails(client: AxiosInstance, url: string): Observable<Async<PokemonDetails>> {
  return from(client.get(url)).pipe(
    map((res) =>
      asyncValue.data({
        image: res.data.sprites.front_default,
        types: res.data.types,
        stats: res.data.stats,
      })
    ),
    catchError((err) => of(asyncValue.error(err))),
    startWith(asyncValue.loading()),
    shareReplay(1)
  );
}

export function getPokemonPage(client: AxiosInstance) {
  return (url: string): Observable<PokemonListViewModel> =>
    from(client.get<PokemonApiResponse>(url)).pipe(
      map((res) => {
        const { results, count, next, previous } = res.data;
        const offset = getOffsetFromUrl(url);
        const totalPages = Math.ceil(count / DEFAULT_LIMIT);
        const currentPage = Math.floor(offset / DEFAULT_LIMIT) + 1;

        return {
          data: results.map((p) => ({
            name: p.name,
            rowData$: getPokemonDetails(client, p.url),
          })),
          paging: { currentPage, totalPages, hasNext: !!next, hasPrev: !!previous, next, previous },
        };
      })
    );
}
