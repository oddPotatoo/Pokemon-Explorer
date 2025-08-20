import { useState } from 'react';
import PokemonList from '../components/pokemon/PokemonList';
import SearchFilters from '../components/pokemon/SearchFilters';
import { useSearchParamsState } from '../hooks/useSearchParams';
import { useDebounce } from '../hooks/useDebounce';
import { usePokemonList } from '../hooks/usePokemonList';

const Home = () => {
  const { page, search, typeFilter, sort, favoritesOnly, updateParams } = useSearchParamsState();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);
  
  // Pass debouncedSearch to PokemonList
  const { totalPages, isLoading } = usePokemonList(debouncedSearch);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    updateParams({ q: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <SearchFilters
        search={searchInput}
        onSearchChange={handleSearchChange}
        typeFilter={typeFilter}
        onTypeFilterChange={(type) => updateParams({ type, page: 1 })}
        sort={sort}
        onSortChange={(sort) => updateParams({ sort })}
        favoritesOnly={favoritesOnly}
        onFavoritesOnlyChange={(value) => updateParams({ favorites: value, page: 1 })}
      />

      <PokemonList debouncedSearch={debouncedSearch} />

      {!isLoading && PokemonList.length > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;