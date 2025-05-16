"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Pokemon,
  PokemonListItem,
  getPokemonDetails,
  getPokemonList,
} from "./pokemon";

export function usePokemonFilter(initialType: string = "all") {
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemon = useCallback(
    async (isInitialLoad: boolean = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }

        setError(null);
        const currentOffset = isInitialLoad ? 0 : offset;

        // Fetch Pokemon list based on type
        const pokemonListResponse = await getPokemonList(
          selectedType,
          20,
          currentOffset
        );

        // Fetch details for each Pokemon
        const pokemonData = await getPokemonDetails(
          pokemonListResponse.results
        );

        // Update state based on whether this is an initial load or not
        if (isInitialLoad) {
          setPokemons(pokemonData);
          setOffset(20);
        } else {
          setPokemons((prev) => [...prev, ...pokemonData]);
          setOffset((prev) => prev + 20);
        }

        // Check if there are more Pokemon to load
        setHasMore(!!pokemonListResponse.next);
      } catch (err) {
        setError("Failed to fetch Pokémon data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [selectedType, offset]
  );

  // Initial load
  useEffect(() => {
    setOffset(0);
    fetchPokemon(true);
  }, [selectedType]);

  // Function to load more Pokemon
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPokemon();
    }
  }, [fetchPokemon, loading, hasMore]);

  // Filter Pokemon based on search term
  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm,
    pokemons: filteredPokemons,
    loading,
    error,
    hasMore,
    loadMore,
  };
}
