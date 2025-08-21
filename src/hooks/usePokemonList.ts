import { useQuery, QueryFunctionContext } from '@tanstack/react-query';
import { useSearchParamsState } from './useSearchParams';
import { fetchPokemonList, fetchAllPokemonNames, fetchPokemonByType, BasicPokemonInfo } from '../api/pokemon';
import { useFavorites } from '../stores/favorites';

export const usePokemonList = (debouncedSearch: string = '') => {
  const { page, typeFilter, sort, favoritesOnly } = useSearchParamsState();
  const { favorites } = useFavorites();

  // Fetch all Pokémon names for client-side operations
  const allPokemonQuery = useQuery({
    queryKey: ['allPokemonNames'],
    queryFn: fetchAllPokemonNames,
    staleTime: 1000 * 60 * 60,
  });

  // Fetch Pokémon by type if type filter is applied
  const typeFilterQuery = useQuery({
    queryKey: ['pokemonByType', typeFilter],
    queryFn: () => fetchPokemonByType(typeFilter),
    enabled: !!typeFilter && !debouncedSearch,
    staleTime: 1000 * 60 * 5, // 5 minute cache for type data
  });

  // Determine if we need client-side sorting/filtering
  const needsClientSideProcessing = debouncedSearch || favoritesOnly || sort.startsWith('name-') || !!typeFilter;
  
  // Fetch paginated list only when not doing client-side processing
  const listQuery = useQuery({
    queryKey: ['pokemonList', { page }],
    queryFn: (context: QueryFunctionContext) => fetchPokemonList(context),
    enabled: !needsClientSideProcessing,
  });

  let pokemonList: Array<{
    id: number;
    name: string;
    sprite: string;
    types: string[];
  }> = [];
  let totalPages = 1;

  // Handle client-side operations (search, favorites, name sorting, type filtering)
  if (needsClientSideProcessing) {
    let processedData: BasicPokemonInfo[] = [];
    
    // Get the base data source
    if (typeFilter && typeFilterQuery.data) {
      processedData = typeFilterQuery.data;
    } else if (allPokemonQuery.data) {
      processedData = [...allPokemonQuery.data];
    } else {
      processedData = [];
    }
    
    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase().trim();
      processedData = processedData.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply favorites filter
    if (favoritesOnly) {
      processedData = processedData.filter(pokemon => favorites[pokemon.id]);
    }
    
    // Apply sorting
    if (sort === 'name-asc') {
      processedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      processedData.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'id-desc') {
      processedData.sort((a, b) => b.id - a.id);
    } else {
      processedData.sort((a, b) => a.id - b.id);
    }
    
    // Paginate results
    const startIndex = (page - 1) * 20;
    const paginatedData = processedData.slice(startIndex, startIndex + 20);
    
    pokemonList = paginatedData.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
      types: [], // We don't have type info here, but it's displayed in the list item
    }));
    
    totalPages = Math.ceil(processedData.length / 20);
  } 
  // Handle server-side pagination (ID sorting)
  else if (listQuery.data) {
    pokemonList = listQuery.data.results.map((pokemon) => {
      const id = parseInt(pokemon.url.split('/').slice(-2, -1)[0]);
      return {
        id,
        name: pokemon.name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        types: [],
      };
    });
    
    if (sort === 'id-desc') {
      pokemonList.sort((a, b) => b.id - a.id);
    }
    
    totalPages = Math.ceil((listQuery.data?.count || 0) / 20);
  }

  return {
    pokemonList,
    isLoading: allPokemonQuery.isLoading || listQuery.isLoading || typeFilterQuery.isLoading,
    error: allPokemonQuery.error || listQuery.error || typeFilterQuery.error,
    totalPages,
  };
};