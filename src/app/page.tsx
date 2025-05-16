import PokemonList from '../components/PokemonList';
import SearchForm from '../components/SearchForm';
import { getPokemonTypes } from '../lib/pokemon';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const types = await getPokemonTypes();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Pokemon Search</h1>
      <SearchForm types={types} />
      <PokemonList />
    </main>
  );
}
