import { useQuery } from '@tanstack/react-query';
import { useSearchParamsState } from './useSearchParams';
import { fetchPokemonList, fetchPokemonByName } from '../api/pokemon';
import { useFavorites } from '../stores/favorites';

// Add debouncedSearch as a parameter
export const usePokemonList = (debouncedSearch: string = '') => {
  const { page, typeFilter, sort, favoritesOnly } = useSearchParamsState();
  const { favorites } = useFavorites();

  // Remove the internal debouncedSearch calculation
  const listQuery = useQuery({
    queryKey: ['pokemonList', { page }],
    queryFn: fetchPokemonList,
    enabled: !debouncedSearch, // Use the passed debouncedSearch
  });

  const searchQuery = useQuery({
    queryKey: ['pokemonSearch', debouncedSearch],
    queryFn: () => fetchPokemonByName(debouncedSearch),
    enabled: !!debouncedSearch, // Use the passed debouncedSearch
    retry: false,
  });

  const isLoading = debouncedSearch ? searchQuery.isLoading : listQuery.isLoading;
  const error = debouncedSearch ? searchQuery.error : listQuery.error;

  let pokemonList: Array<{
    id: number;
    name: string;
    sprite: string;
    types: string[];
  }> = [];

  if (debouncedSearch) {
    if (searchQuery.data) {
      pokemonList = [
        {
          id: searchQuery.data.id,
          name: searchQuery.data.name,
          sprite: searchQuery.data.sprites.front_default,
          types: searchQuery.data.types.map((t) => t.type.name),
        },
      ];
    }
  } else if (listQuery.data) {
    pokemonList = listQuery.data.results.map((pokemon) => {
      const id = parseInt(pokemon.url.split('/').slice(-2, -1)[0]);
      return {
        id,
        name: pokemon.name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        types: [], // Will be filled in the details query
      };
    });
  }

  // Apply filters and sorting
  let filteredList = pokemonList;
  
  if (favoritesOnly) {
    filteredList = filteredList.filter((pokemon) => favorites[pokemon.id]);
  }
  
  if (typeFilter) {
    // Note: For proper type filtering, we'd need to fetch each Pokémon's details
    // This is simplified for the example
    filteredList = filteredList; // Actual filtering would happen here
  }
  
  if (sort === 'name-asc') {
    filteredList = [...filteredList].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name-desc') {
    filteredList = [...filteredList].sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === 'id-desc') {
    filteredList = [...filteredList].sort((a, b) => b.id - a.id);
  } else {
    // Default is id-asc
    filteredList = [...filteredList].sort((a, b) => a.id - b.id);
  }

  const totalPages = debouncedSearch ? 1 : Math.ceil((listQuery.data?.count || 0) / 20);

  return {
    pokemonList: filteredList,
    isLoading,
    error: error instanceof Error ? error : undefined,
    totalPages,
  };
};