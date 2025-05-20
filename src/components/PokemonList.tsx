'use client';

import React, { useRef, useCallback, memo, useState } from 'react';
import { usePokemonFilter } from '@/lib/hooks';
import Link from 'next/link';
import Image from 'next/image';

const PokemonCard = memo(({
    pokemon,
    ref
}: {
    pokemon: any,
    ref?: React.Ref<HTMLAnchorElement>
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Use front_default as fallback if official artwork fails
    const imgSrc = imageError
        ? pokemon.sprites.front_default
        : pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

    return (
        <Link
            href={`/pokemon/${pokemon.name}`}
            key={pokemon.id}
            className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            ref={ref}
        >
            <div className="flex-1 p-4 flex items-center justify-center bg-gray-100 relative min-h-[180px]">
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                )}
                <Image
                    src={imgSrc}
                    alt={pokemon.name}
                    width={150}
                    height={150}
                    className={`object-contain transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                        setImageError(true);
                        setImageLoaded(true);
                    }}
                    priority={false}
                    loading="lazy"
                />
            </div>
            <div className="p-4">
                <h2 className="text-lg font-semibold capitalize">
                    {pokemon.name}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {pokemon.types.map((typeInfo: any) => (
                        <span
                            key={typeInfo.type.name}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize"
                        >
                            {typeInfo.type.name}
                        </span>
                    ))}
                </div>
                <div className="mt-4 text-right">
                    <span className="text-sm text-blue-600">Details →</span>
                </div>
            </div>
        </Link>
    );
});

PokemonCard.displayName = 'PokemonCard';

export default function PokemonList() {
    const { pokemons, loading, error, hasMore, loadMore, searchTerm } = usePokemonFilter();
    const observer = useRef<IntersectionObserver | null>(null);
    const lastPokemonElementRef = useCallback((node: Element | null) => {
        if (loading) return;

        // Disconnect the previous observer if it exists
        if (observer.current) observer.current.disconnect();

        // Create a new observer
        observer.current = new IntersectionObserver(entries => {
            // If the last element is visible and we have more items to load
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        }, {
            rootMargin: '200px' // Load more content before user reaches the end for smoother experience
        });

        // Observe the last element
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadMore]);

    // Component for showing the initial loading state
    const FullLoader = () => (
        <div className="flex flex-col justify-center items-center py-16 space-y-4">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                <div className="absolute top-2 left-2 w-12 h-12 border-4 border-red-500 rounded-full animate-spin border-t-transparent animate-[spin_1s_linear_infinite_reverse]"></div>
            </div>
            <p className="text-lg font-medium text-gray-700">Loading Pokemon...</p>
        </div>
    );

    if (pokemons.length === 0 && loading) {
        return <FullLoader />;
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                {error}
            </div>
        );
    }

    if (pokemons.length === 0) {
        return (
            <div className="text-center py-8">
                No Pokemon found matching your search criteria.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {searchTerm && (
                <div className="text-center text-gray-600 mb-4">
                    Found {pokemons.length} Pokemon matching "{searchTerm}"
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pokemons.map((pokemon, index) => (
                    <PokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        ref={index === pokemons.length - 1 ? lastPokemonElementRef : undefined}
                    />
                ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <div className="relative w-10 h-10">
                        <div className="animate-ping absolute h-10 w-10 rounded-full bg-blue-400 opacity-75"></div>
                        <div className="relative rounded-full h-10 w-10 bg-blue-500 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-white"></div>
                        </div>
                    </div>
                    <p className="text-gray-500 font-medium">Loading more Pokemon...</p>
                </div>
            )}
        </div>
    );
} 