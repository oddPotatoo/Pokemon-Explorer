import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useSearchParamsState = () => {
  // Try to get search params, fall back to defaults if not in router context
  let searchParams: URLSearchParams;
  let setSearchParams: ReturnType<typeof useSearchParams>[1];
  let hasRouterContext = true;

  try {
    [searchParams, setSearchParams] = useSearchParams();
  } catch (error) {
    // Not in router context, use defaults
    hasRouterContext = false;
    searchParams = new URLSearchParams();
    setSearchParams = () => {}; // no-op function
  }

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || 'id-asc';
  const favoritesOnly = searchParams.get('favorites') === 'true';
  
  const updateParams = useCallback((updates: Record<string, string | number | boolean>) => {
    if (!hasRouterContext) {
      console.warn('updateParams called outside router context');
      return;
    }
    
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'false') {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams, hasRouterContext]);
  
  return { page, search, typeFilter, sort, favoritesOnly, updateParams };
};