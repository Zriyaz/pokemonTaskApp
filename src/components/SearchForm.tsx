'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { PokemonType } from '@/lib/pokemon';

export default function SearchForm({ types }: { types: PokemonType[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();
        if (selectedType && selectedType !== 'all') params.set('type', selectedType);
        if (searchTerm) params.set('search', searchTerm);

        const queryString = params.toString();
        const url = queryString ? `/?${queryString}` : '/';

        router.push(url);
    };

    // Update form when URL params change
    useEffect(() => {
        setSelectedType(searchParams.get('type') || 'all');
        setSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <h1 className="text-2xl text-red-500 font-bold mb-4">Search Form</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-2">
                        Pokémon Type
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
                        placeholder="Search Pokémon..."
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