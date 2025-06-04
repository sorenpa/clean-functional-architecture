import { FavoritesService, PokemonService } from "@next-app/contracts";

export type AppServices = {
  pokemonService: PokemonService;
  favoritesService: FavoritesService;
};
