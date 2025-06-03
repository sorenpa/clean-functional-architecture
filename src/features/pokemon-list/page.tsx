"use client";

import { PokemonList } from "./components/pokemon-list";
import { getServices } from "@next-app/system";

const services = getServices();

export const PokemonListPage: React.FC = () => {
  return (
    <main>
      <h1 className="text-xl font-bold p-4">Pokémon</h1>
      <PokemonList service={services.pokemon} />
    </main>
  );
};
