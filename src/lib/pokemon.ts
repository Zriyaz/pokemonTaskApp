export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
}

export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonListItem[];
  next: string | null;
  count: number;
}

export interface PokemonDetails extends Pokemon {
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  moves: {
    move: {
      name: string;
    };
  }[];
}

// Fetch all Pokémon types
export async function getPokemonTypes(): Promise<PokemonType[]> {
  const response = await fetch("https://pokeapi.co/api/v2/type");
  const data = await response.json();
  return data.results;
}

// Fetch Pokémon list (can be filtered by type)
export async function getPokemonList(
  type?: string,
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  if (type && type !== "all") {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    const pokemonList = data.pokemon.map((p: any) => p.pokemon);
    const paginatedResults = pokemonList.slice(offset, offset + limit);

    return {
      results: paginatedResults,
      next: offset + limit < pokemonList.length ? "has-more" : null,
      count: pokemonList.length,
    };
  } else {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    return {
      results: data.results,
      next: data.next,
      count: data.count,
    };
  }
}

// Fetch details of a single Pokémon by name
export async function getPokemonByName(name: string): Promise<PokemonDetails> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon");
  }
  return response.json();
}

// Fetch details for multiple Pokémon
export async function getPokemonDetails(
  pokemons: PokemonListItem[]
): Promise<Pokemon[]> {
  const pokemonPromises = pokemons.map((pokemon) =>
    fetch(pokemon.url).then((res) => res.json())
  );
  return Promise.all(pokemonPromises);
}
