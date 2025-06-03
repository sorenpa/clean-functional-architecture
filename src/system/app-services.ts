import { AppServices } from "@next-app/models";
import { createPokeApiClient, createPokemonService } from "@next-app/services";

let cachedServices: AppServices | null = null;

function buildServices(): AppServices {
  const pokeApiClient = createPokeApiClient();

  const pokemon = createPokemonService(pokeApiClient);

  return {
    pokemon,
  };
}

export function getServices(): AppServices {
  if (!cachedServices) {
    cachedServices = buildServices();
  }

  return cachedServices;
}
