"use client";

import React, {
    useState,
    useEffect,
    useCallback,
    createContext,
    useContext,
} from "react";
import { Pokemon, getPokemonDetails, getPokemonList } from "./pokemon";

// Create a context for Pokemon data
interface PokemonContextType {
    selectedType: string;
    setSelectedType: (type: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    pokemons: Pokemon[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
    searchPokemon: (query: string) => void;
}

const PokemonContext = createContext<PokemonContextType | null>(null);

// Provider component
export function PokemonProvider({ children }: { children: React.ReactNode }) {
    const pokemonData = usePokemonFilterInternal("all");

    return (
        <PokemonContext.Provider value={pokemonData}>
            {children}
        </PokemonContext.Provider>
    );
}

// Hook to use the context
export function usePokemonFilter(initialType: string = "all") {
    const context = useContext(PokemonContext);

    if (!context) {
        throw new Error("usePokemonFilter must be used within a PokemonProvider");
    }

    // If initialType is different from context's selectedType, update it
    useEffect(() => {
        if (initialType !== "all" && initialType !== context.selectedType) {
            context.setSelectedType(initialType);
        }
    }, [initialType, context.selectedType]);

    return context;
}

// Internal hook implementation
function usePokemonFilterInternal(initialType: string = "all") {
    const [selectedType, setSelectedType] = useState(initialType);
    const [searchTerm, setSearchTerm] = useState("");
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);

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

                // Apply search term filtering if one exists
                if (searchTerm) {
                    filterPokemonBySearchTerm(searchTerm, isInitialLoad ? pokemonData : [...pokemons, ...pokemonData]);
                }
            } catch (err) {
                setError("Failed to fetch Pokémon data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [selectedType, offset, searchTerm, pokemons]
    );

    // Function to filter Pokemon by search term
    const filterPokemonBySearchTerm = useCallback((term: string, pokemonList: Pokemon[]) => {
        if (!term) {
            setFilteredPokemons(pokemonList);
            return;
        }

        const filtered = pokemonList.filter(pokemon =>
            pokemon.name.toLowerCase().includes(term.toLowerCase())
        );

        setFilteredPokemons(filtered);
    }, []);

    // Function to handle search
    const searchPokemon = useCallback((query: string) => {
        setSearchTerm(query);
        filterPokemonBySearchTerm(query, pokemons);
    }, [pokemons, filterPokemonBySearchTerm]);

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

    return {
        selectedType,
        setSelectedType,
        searchTerm,
        setSearchTerm,
        pokemons: searchTerm ? filteredPokemons : pokemons,
        loading,
        error,
        hasMore: searchTerm ? false : hasMore, // Disable infinite scroll when searching
        loadMore,
        searchPokemon,
    };
} 