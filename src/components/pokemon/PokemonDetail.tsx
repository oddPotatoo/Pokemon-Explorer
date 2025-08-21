import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetails } from '../../api/pokemon';
import { useFavorites } from '../../stores/favorites';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const PokemonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { favorites, toggleFavorite } = useFavorites();
  const location = useLocation();
  
  // Get all search params from the current URL to preserve state
  const searchParams = new URLSearchParams(location.search);
  
  // Preserve all existing search parameters
  const backToSearchParams = new URLSearchParams();
  
  // Copy all existing search parameters except the 'id' if it exists
  searchParams.forEach((value, key) => {
    if (key !== 'id') {
      backToSearchParams.set(key, value);
    }
  });

  const backToUrl = `/?${backToSearchParams.toString()}`;

  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemonDetails(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load Pokémon details'} />;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 p-6 flex flex-col items-center">
          <div className="relative w-full">
            <button
              onClick={() => toggleFavorite(pokemon!.id.toString())}
              className="absolute top-0 right-0 z-10 p-2 bg-white dark:bg-gray-700 rounded-full shadow"
              aria-label={favorites[pokemon!.id] ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favorites[pokemon!.id] ? (
                <StarIconSolid className="h-6 w-6 text-yellow-500" />
              ) : (
                <StarIconOutline className="h-6 w-6 text-gray-400" />
              )}
            </button>
            <img
              src={pokemon!.sprites.other['official-artwork'].front_default}
              alt={pokemon!.name}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white capitalize">
              {pokemon!.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              #{pokemon!.id.toString().padStart(3, '0')}
            </p>
          </div>
        </div>
        <div className="md:w-1/2 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Height</p>
                <p className="text-gray-800 dark:text-white">{(pokemon!.height / 10).toFixed(1)} m</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                <p className="text-gray-800 dark:text-white">{(pokemon!.weight / 10).toFixed(1)} kg</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Types</h2>
            <div className="flex flex-wrap gap-2">
              {pokemon!.types.map((type) => (
                <span
                  key={type.type.name}
                  className={`px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white capitalize`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Abilities</h2>
            <div className="flex flex-wrap gap-2">
              {pokemon!.abilities.map((ability) => (
                <span
                  key={ability.ability.name}
                  className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white capitalize"
                >
                  {ability.ability.name}
                  {ability.is_hidden && ' (hidden)'}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Stats</h2>
            <div className="space-y-2">
              {pokemon!.stats.map((stat) => (
                <div key={stat.stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                      {stat.stat.name.replace('-', ' ')}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {stat.base_stat}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-blue-500 h-2 rounded-full`}
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
        <Link
          to={backToUrl}
          className="inline-flex items-center px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white dark:text-white rounded disabled:opacity-50 hover:bg-blue-300 dark:hover:bg-blue-300 transition-colors"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default PokemonDetail;