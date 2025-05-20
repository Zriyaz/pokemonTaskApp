'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { PokemonType } from '@/lib/pokemon';
import { usePokemonFilter } from '@/lib/hooks';

export default function SearchForm({ types }: { types: PokemonType[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialType = searchParams.get('type') || 'all';
    const initialSearch = searchParams.get('search') || '';

    const [selectedType, setSelectedType] = useState(initialType);
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    // Use the hook to fetch Pokemon and manage state
    const { setSelectedType: setFilterType, searchPokemon } = usePokemonFilter(initialType);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Call the API search function
        searchPokemon(searchTerm);

        const params = new URLSearchParams();
        if (selectedType && selectedType !== 'all') params.set('type', selectedType);
        if (searchTerm) params.set('search', searchTerm);

        const queryString = params.toString();
        const url = queryString ? `/?${queryString}` : '/';

        router.push(url);
    };

    // Update hook's selectedType when the form's selectedType changes
    useEffect(() => {
        setFilterType(selectedType);
    }, [selectedType, setFilterType]);

    // Update form when URL params change
    useEffect(() => {
        const typeParam = searchParams.get('type') || 'all';
        const searchParam = searchParams.get('search') || '';

        setSelectedType(typeParam);
        setSearchTerm(searchParam);

        // Update the filter hook with the new type from URL
        setFilterType(typeParam);

    }, [searchParams, setFilterType]);

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-2">
                        Pokemon Type
                    </label>
                    <select
                        id="type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Types</option>
                        {types.map((type) => (
                            <option key={type.name} value={type.name}>
                                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="search" className="block text-sm font-medium mb-2">
                        Search
                    </label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search Pokemon..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Search
                    </button>
                </div>
            </div>
        </form>
    );
} 