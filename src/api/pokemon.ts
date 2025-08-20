import axios, { AxiosError } from 'axios';
import { QueryFunctionContext } from '@tanstack/react-query';

const PAGE_SIZE = 20;
const BASE_URL = 'https://pokeapi.co/api/v2';

// Create axios instance with better defaults
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
}

export const fetchPokemonList = async ({ queryKey, signal }: QueryFunctionContext): Promise<PokemonListResponse> => {
  try {
    const [_, { page }] = queryKey as [string, { page: number }];
    console.log('Fetching Pokémon list, page:', page);
    
    const response = await api.get<PokemonListResponse>('/pokemon', {
      params: { 
        offset: (page - 1) * PAGE_SIZE, 
        limit: PAGE_SIZE 
      },
      signal,
    });
    
    console.log('Pokémon list response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon list:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response?.status === 404) {
        throw new Error('Pokémon API endpoint not found.');
      }
      if (error.message.includes('Network Error')) {
        throw new Error('Network error. Please check your internet connection.');
      }
    }
    
    throw new Error('Failed to load Pokémon. Please try again.');
  }
};

export const fetchPokemonDetails = async (id: string): Promise<PokemonDetails> => {
  try {
    console.log('Fetching Pokémon details for ID:', id);
    const response = await api.get<PokemonDetails>(`/pokemon/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon details:', error);
    
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`Pokémon with ID "${id}" not found`);
    }
    
    throw new Error('Failed to load Pokémon details. Please try again.');
  }
};

export const fetchPokemonByName = async (name: string, signal?: AbortSignal): Promise<PokemonDetails> => {
  try {
    console.log('Fetching Pokémon by name:', name);
    const response = await api.get<PokemonDetails>(`/pokemon/${name.toLowerCase()}`, { 
      signal 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon by name:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Pokémon "${name}" not found`);
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Search timeout. Please try again.');
      }
    }
    
    throw new Error('Failed to search Pokémon. Please try again.');
  }
};

// Add a test function to verify API connection
export const testPokeAPI = async (): Promise<boolean> => {
  try {
    const response = await api.get('/pokemon?limit=1');
    return response.status === 200;
  } catch (error) {
    console.error('PokeAPI test failed:', error);
    return false;
  }
};