module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        // Pokémon type colors
        'normal': '#A8A878',
        'fire': '#F08030',
        'water': '#6890F0',
        'electric': '#F8D030',
        'grass': '#78C850',
        'ice': '#98D8D8',
        'fighting': '#C03028',
        'poison': '#A040A0',
        'ground': '#E0C068',
        'flying': '#A890F0',
        'psychic': '#F85888',
        'bug': '#A8B820',
        'rock': '#B8A038',
        'ghost': '#705898',
        'dragon': '#7038F8',
        'dark': '#705848',
        'steel': '#B8B8D0',
        'fairy': '#EE99AC',
        
        // Dark mode variants
        'normal-dark': '#6D6D4E',
        'fire-dark': '#9C531F',
        'water-dark': '#445E9C',
        'electric-dark': '#A1871F',
        'grass-dark': '#4E8234',
        'ice-dark': '#638D8D',
        'fighting-dark': '#7D1F1A',
        'poison-dark': '#682A68',
        'ground-dark': '#927D44',
        'flying-dark': '#6D5E9C',
        'psychic-dark': '#A13959',
        'bug-dark': '#6D7815',
        'rock-dark': '#786824',
        'ghost-dark': '#493963',
        'dragon-dark': '#4924A1',
        'dark-dark': '#49392F',
        'steel-dark': '#787887',
        'fairy-dark': '#9B6470',
      },
    },
  },
  plugins: [],
};