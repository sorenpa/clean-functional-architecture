import { FC } from "react";
import { PokemonDetails } from "@next-app/models";
import { Observable } from "rxjs";
import { useObservable } from "@framework/hooks";
import { Async } from "@framework/models";
import { asyncValue, renderAsyncValue } from "@framework/helpers";
import Image from "next/image";
import { LoadingSpinner } from "./loading-spinner";

interface Props {
  rowData$: Observable<Async<PokemonDetails>>;
}

export const PokemonRow: FC<Props> = ({ rowData$ }) => {
  const data = useObservable(rowData$, asyncValue.empty());

  console.log(data);
  return (
    <>
      {renderAsyncValue(data, {
        empty: () => <div>No data</div>,
        loading: () => <LoadingSpinner />,
        error: (error) => <div>Error: {String(error)}</div>,
        success: (data) => (
          <>
            {/* Image */}
            <Image
              src={data.image}
              alt="Pokemon"
              width={64}
              height={64}
              priority
              className="block"
            />

            {/* Types */}
            <div className="flex flex-wrap gap-1 mb-1">
              {data.types.map((t) => (
                <span
                  key={t.type.name}
                  className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs capitalize"
                >
                  {t.type.name}
                </span>
              ))}
            </div>

            {/* Stats (one row, aligned) */}
            <div className="flex gap-3">
              {[
                "hp",
                "attack",
                "defense",
                "special-attack",
                "special-defense",
                "speed",
              ].map((key) => {
                const stat = data.stats.find((s) => s.stat.name === key);
                return (
                  <div key={key} className="flex items-center space-x-1">
                    <span className="text-[10px] text-gray-500 capitalize whitespace-nowrap">
                      {key.replace("-", " ")}
                    </span>
                    <span className="text-sm font-medium">
                      {stat?.base_stat ?? "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ),
      })}
    </>
  );
};
