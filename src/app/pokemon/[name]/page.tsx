import Image from 'next/image';
import Link from 'next/link';
import { getPokemonByName } from '@/lib/pokemon';
import Breadcrumb from '@/components/Breadcrumb';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { name: string } }) {
    const pokemonName = params.name.charAt(0).toUpperCase() + params.name.slice(1);
    return {
        title: `${pokemonName} | Pokemon Search`,
        description: `View details about ${pokemonName}`,
    };
}

export default async function PokemonDetail({ params }: { params: { name: string } }) {
    const name = params.name;

    try {
        const pokemon = await getPokemonByName(name);

        const stats = {
            hp: pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
            attack: pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
            defense: pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0,
            'special-attack': pokemon.stats.find(stat => stat.stat.name === 'special-attack')?.base_stat || 0,
            'special-defense': pokemon.stats.find(stat => stat.stat.name === 'special-defense')?.base_stat || 0,
            speed: pokemon.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0,
        };

        const abilities = pokemon.abilities.map(item => item.ability.name);
        const moves = pokemon.moves.slice(0, 5).map(item => item.move.name);

        return (
            <main className="container mx-auto px-4 py-8">
                <Breadcrumb />

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2 bg-gray-100 p-6 flex items-center justify-center">
                            <Image
                                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                                alt={pokemon.name}
                                width={300}
                                height={300}
                                priority
                                className="object-contain"
                            />
                        </div>

                        <div className="md:w-1/2 p-6">
                            <h1 className="text-3xl font-bold capitalize mb-4">{pokemon.name}</h1>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">Types:</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {pokemon.types.map(typeInfo => (
                                            <span
                                                key={typeInfo.type.name}
                                                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 capitalize"
                                            >
                                                {typeInfo.type.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold mb-2">Abilities:</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {abilities.map(ability => (
                                            <span
                                                key={ability}
                                                className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 capitalize"
                                            >
                                                {ability.replace('-', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-3">Stats:</h2>
                                <div className="space-y-2">
                                    {Object.entries(stats).map(([statName, value]) => (
                                        <div key={statName} className="flex items-center">
                                            <span className="w-1/3 font-medium capitalize">{statName.replace('-', ' ')}:</span>
                                            <div className="w-2/3 bg-gray-200 rounded-full h-4 overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-4"
                                                    style={{ width: `${Math.min(100, (value / 150) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="ml-2 text-sm">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-2">Some Moves:</h2>
                                <div className="flex flex-wrap gap-2">
                                    {moves.map(move => (
                                        <span
                                            key={move}
                                            className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 capitalize"
                                        >
                                            {move.replace('-', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Back to All Pokemon
                    </Link>
                </div>
            </main>
        );
    } catch (error) {
        notFound();
    }
} 