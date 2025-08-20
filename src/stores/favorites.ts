import { create } from 'zustand';

interface FavoritesState {
  favorites: Record<string, boolean>;
  toggleFavorite: (id: string) => void;
}

export const useFavorites = create<FavoritesState>((set) => ({
  favorites: JSON.parse(localStorage.getItem('pokemon-favorites') || '{}'),
  toggleFavorite: (id) => set((state) => {
    const newFavorites = { ...state.favorites, [id]: !state.favorites[id] };
    localStorage.setItem('pokemon-favorites', JSON.stringify(newFavorites));
    return { favorites: newFavorites };
  }),
}));