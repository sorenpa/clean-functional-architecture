"use client";

import { useEffect } from "react";
import { useStore } from "@framework/hooks";
import { renderAsyncValue } from "@framework/helpers";
import { PokemonService } from "@next-app/contracts";

type Props = {
  service: PokemonService;
};

export function PokemonList({ service }: Props) {
  const { data } = useStore(service);

  useEffect(() => {
    service.loadInitial();
  }, [service]);

  return (
    <div className="p-4">
      {renderAsyncValue(data, {
        empty: () => <div>No Pokémon found.</div>,
        loading: () => <div>Loading…</div>,
        error: (error) => <div>Error: {String(error)}</div>,
        success: (data) => (
          <>
            <ul className="mb-4">
              {data.data.map((p) => (
                <li key={p.name} className="border-b py-2">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex justify-between">
              <button
                disabled={!data.paging.hasPrev}
                onClick={service.prev}
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={!data.paging.hasNext}
                onClick={service.next}
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
