import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRootMenu } from '../../../../context/RootMenuContext';
import searchService from '../services/searchService';

// Define interface for RootMenuContext
interface RootMenuContextType {
  menu: any;
  loading: boolean;
  error: string | null;
}

interface SearchContextType {
  search: (query: string) => Promise<any>;
  isLoading: boolean;
  isSearchInitialized: boolean;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSearchState] = useState(searchService.SEARCH_STATES.UNINITIALIZED);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Get data directly from RootMenuContext
  const rootMenuContext = useRootMenu() as RootMenuContextType;
  const { menu } = rootMenuContext;

  // Initialize search service when menu data changes
  useEffect(() => {
    let mounted = true;

    const initializeSearch = async () => {
      if (!menu || !mounted) return;

      try {
        // Only reinitialize if not already initialized or in error state
        if (searchState === searchService.SEARCH_STATES.READY) {
          console.log('Search already initialized');
          return;
        }

        console.log('Initializing search with menu data');
        
        // Clean up existing search index
        await searchService.cleanup();
        
        // Get the menu object
        const menuObj = typeof menu === 'object' && 'menu' in menu ? menu.menu : menu;
        if (!menuObj || typeof menuObj !== 'object') {
          throw new Error('Invalid menu data structure');
        }
        
        // Transform menu data into searchable format
        const flattenedMenu = Object.entries(menuObj).reduce((acc: any[], [category, items]) => {
          if (!Array.isArray(items)) return acc;
          
          const validItems = items
            .filter(item => item && item.id && item.name)
            .map(item => ({
              ...item,
              id: item.id,
              name: item.name,
              description: item.description || '',
              price: typeof item.price === 'string' ? parseFloat(item.price) : item.price || 0,
              category: category,
              subCategory: item.subCategory || '',
              dietary: {
                isVegetarian: item.dietary?.isVegetarian || false,
                isVegan: item.dietary?.isVegan || false,
                isGlutenFree: item.dietary?.isGlutenFree || false
              },
              ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
              allergens: Array.isArray(item.allergens) ? item.allergens : [],
              pairings: Array.isArray(item.pairings) ? item.pairings : [],
              image: item.image || '',
              nutrients: item.nutrients || {},
              calories: typeof item.calories === 'number' ? item.calories : 0
            }));
          
          return [...acc, ...validItems];
        }, []);

        if (flattenedMenu.length === 0) {
          throw new Error('No valid menu items found');
        }

        console.log(`Initializing search with ${flattenedMenu.length} items`);
        await searchService.initializeIndex({ items: flattenedMenu });
        console.log('Search initialization complete');
      } catch (error: any) {
        console.error('Failed to initialize search:', error);
        if (mounted) {
          setSearchError(error.message);
        }
      }
    };

    // Listen for search service state changes
    const handleStateChange = (state: string, error: string | null) => {
      console.log('Search state changed:', state, error);
      setSearchState(state);
      setSearchError(error);
    };

    searchService.addStateListener(handleStateChange);
    initializeSearch();

    return () => {
      mounted = false;
      searchService.removeStateListener(handleStateChange);
    };
  }, [menu, searchState]);

  const search = async (query: string) => {
    if (!query?.trim()) {
      return { results: [], grouped: {} };
    }

    try {
      setIsLoading(true);
      return await searchService.search(query);
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchContext.Provider 
      value={{ 
        search, 
        isLoading,
        isSearchInitialized: searchState === searchService.SEARCH_STATES.READY
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
