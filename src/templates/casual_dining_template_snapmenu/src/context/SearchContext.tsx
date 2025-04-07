import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRootMenu } from '../../../../context/RootMenuContext.jsx';
import searchService from '../services/searchService';

interface SearchContextType {
  search: (query: string) => Promise<any>;
  isLoading: boolean;
  isSearchInitialized: boolean;
  categories: Array<{ id: string; name: string }>;
  menu: { [category: string]: any[] };
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
  const rootMenuContext = useRootMenu();
  // Use type assertion to handle the type
  const { menu: rootMenu, loading: rootLoading, error: rootError } = rootMenuContext as {
    menu: any;
    loading: boolean;
    error: Error | null;
  };
  
  // Process menu data to handle different structures
  const getProcessedMenu = () => {
    if (!rootMenu) return { menu: {}, categories: [] };
    
    try {
      let menuObj;
      if (typeof rootMenu === 'object') {
        if ('menu' in rootMenu) {
          // If rootMenu has a menu property
          menuObj = rootMenu.menu;
        } else {
          // If rootMenu is directly the menu object
          menuObj = rootMenu;
        }
      } else {
        menuObj = {};
      }
      
      // Extract categories from menu object
      const categories = Object.keys(menuObj).map(categoryId => {
        // Convert category ID to a more readable name (e.g., 'main_courses' -> 'Main Courses')
        const categoryName = categoryId
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        return { id: categoryId, name: categoryName };
      });
      
      return { 
        menu: menuObj,
        categories
      };
    } catch (error) {
      console.error("Error processing menu data:", error);
      return { menu: {}, categories: [] };
    }
  };
  
  const menuData = getProcessedMenu();
  const menu = menuData.menu;

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
        
        // Transform menu data into searchable format
        const flattenedMenu = Object.entries(menu).reduce((acc: any[], [category, items]) => {
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
        isSearchInitialized: searchState === searchService.SEARCH_STATES.READY,
        categories: menuData.categories || [],
        menu: menuData.menu || {}
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
