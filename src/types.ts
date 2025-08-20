export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export interface PokemonType {
  name: string;
  url: string;
}