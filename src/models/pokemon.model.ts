import { Async } from "@framework/models";
import { Observable } from "rxjs";

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}
export interface PokemonDetails {
  image: string;
  types: PokemonType[];
  stats: PokemonStat[];
}
export interface Pokemon {
  name: string;
  rowData$: Observable<Async<PokemonDetails>>;
}
