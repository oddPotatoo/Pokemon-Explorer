import { Link } from 'react-router-dom';
import { useFavorites } from '../../stores/favorites';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { useSearchParamsState } from '../../hooks/useSearchParams';

interface PokemonListItemProps {
  pokemon: {
    id: number;
    name: string;
    sprite: string;
    types: string[];
  };
}

const PokemonListItem = ({ pokemon }: PokemonListItemProps) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { page, search, typeFilter, sort, favoritesOnly } = useSearchParamsState();

  // Build the URL with current search parameters
  const searchParams = new URLSearchParams();
  
  if (page && page > 1) searchParams.set('page', page.toString());
  if (search) searchParams.set('q', search);
  if (typeFilter) searchParams.set('type', typeFilter);
  if (sort && sort !== 'id-asc') searchParams.set('sort', sort);
  if (favoritesOnly) searchParams.set('favorites', 'true');

  const pokemonUrl = `/pokemon/${pokemon.id}?${searchParams.toString()}`;

  return (
    <div className="p-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(pokemon.id.toString());
            }}
            className="absolute top-2 right-2 z-10 p-1 bg-white dark:bg-gray-700 rounded-full shadow"
            aria-label={favorites[pokemon.id] ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorites[pokemon.id] ? (
              <StarIconSolid className="h-5 w-5 text-yellow-500" />
            ) : (
              <StarIconOutline className="h-5 w-5 text-gray-400" />
            )}
          </button>
          <Link to={pokemonUrl} className="block">
            <div className="h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                className="h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                {pokemon.name}
              </h3>
              {/* Types will be empty in list view due to API limitations */}
              {pokemon.types.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className={`px-2 py-1 text-xs rounded-full bg-${type}-100 dark:bg-${type}-800 text-${type}-800 dark:text-${type}-100`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PokemonListItem;