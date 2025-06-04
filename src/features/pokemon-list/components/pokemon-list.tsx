"use client";

import { useEffect } from "react";
import { useStore } from "@framework/hooks";
import { renderAsyncValue } from "@framework/helpers";
import { FavoritesService, PokemonService } from "@next-app/contracts";

type Props = {
  pokemonService: PokemonService;
  favoritesService: FavoritesService;
};

export function PokemonList({ pokemonService, favoritesService }: Props) {
  const { data } = useStore(pokemonService);
  const favorites = useStore(favoritesService);

  useEffect(() => {
    pokemonService.loadInitial();
  }, [pokemonService]);

  return (
    <div className="p-4">
      {renderAsyncValue(data, {
        empty: () => <div>No Pokémon found.</div>,
        loading: () => <div>Loading…</div>,
        error: (error) => <div>Error: {String(error)}</div>,
        success: (data) => (
          <>
            <ul className="mb-4">
              {data.data.map((p) => {
                const isFav = !!favorites.data[p.name];
                return (
                  <li
                    key={p.name}
                    className="border-b py-2 flex justify-between items-center"
                  >
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {p.name}
                    </a>
                    <button
                      onClick={() => favoritesService.toggle(p.name)}
                      className={`ml-2 text-sm px-2 py-1 rounded ${
                        isFav
                          ? "bg-yellow-300 hover:bg-yellow-400"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {isFav ? "★ Unfavorite" : "☆ Favorite"}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-between">
              <button
                disabled={!data.paging.hasPrev}
                onClick={pokemonService.prev}
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={!data.paging.hasNext}
                onClick={pokemonService.next}
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="text-sm text-center mb-2">
              Page {data.paging.currentPage} / {data.paging.totalPages}
            </div>
          </>
        ),
      })}
    </div>
  );
}
