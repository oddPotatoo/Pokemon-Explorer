import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('pokemon-theme') as 'light' | 'dark') || 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('pokemon-theme', newTheme);
    return { theme: newTheme };
  }),
}));