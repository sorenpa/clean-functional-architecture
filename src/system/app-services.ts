import { AppServices } from "@next-app/models";
import {
  createFavoritesService,
  createPokeApiClient,
  createPokemonService,
} from "@next-app/services";

let cachedServices: AppServices | null = null;

function buildServices(): AppServices {
  const pokeApiClient = createPokeApiClient();

  const pokemonService = createPokemonService(pokeApiClient);
  const favoritesService = createFavoritesService();

  return {
    favoritesService,
    pokemonService,
  };
}

export function getServices(): AppServices {
  if (!cachedServices) {
    cachedServices = buildServices();
  }

  return cachedServices;
}
