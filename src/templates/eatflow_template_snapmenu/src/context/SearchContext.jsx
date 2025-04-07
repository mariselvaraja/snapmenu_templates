import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRootMenu } from '../../../../context/RootMenuContext';
import searchService from '../services/searchService';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchState, setSearchState] = useState(searchService.SEARCH_STATES.UNINITIALIZED);
  const [searchError, setSearchError] = useState(null);
  const { menu: rootMenu } = useRootMenu();
  
  // Process menu data to handle different structures (similar to MenuContext)
  let menu = null;
  
  try {
    if (rootMenu) {
      if (typeof rootMenu === 'object') {
        if ('menu' in rootMenu) {
          // If rootMenu has a menu property
          menu = rootMenu;
        } else {
          // If rootMenu is directly the menu object
          menu = { menu: rootMenu };
        }
      } else {
        menu = rootMenu;
      }
    }
  } catch (error) {
    console.error("Error processing menu data:", error);
    menu = { menu: {} };
  }
  
  // Default menu structure if no menu is available
  if (!menu) {
    menu = { 
      menu: {
        starters: [],
        mains: [],
        desserts: [],
        drinks: []
      }
    };
  }

  // Initialize search service when menu data changes
  useEffect(() => {
    let mounted = true;

    const initializeSearch = async () => {
      if (!menu || !mounted) return;
      
      console.log('Menu data structure:', menu);

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
        let menuData;
        
        // Handle different possible structures of menu data
        if (menu.default && menu.default.menu) {
          // Case: { default: { menu: { ... } } }
          menuData = menu.default.menu;
          console.log('Using menu.default.menu:', menuData);
        } else if (menu.menu) {
          // Case: { menu: { ... } }
          menuData = menu.menu;
          console.log('Using menu.menu:', menuData);
        } else if (menu.default) {
          // Case: { default: { ... } }
          menuData = menu.default;
          console.log('Using menu.default:', menuData);
        } else {
          // Case: { ... }
          menuData = menu;
          console.log('Using menu directly:', menuData);
        }
        
        const flattenedMenu = Object.entries(menuData).reduce((acc, [category, items]) => {
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
      } catch (error) {
        console.error('Failed to initialize search:', error);
        if (mounted) {
          setSearchError(error.message);
        }
      }
    };

    // Listen for search service state changes
    const handleStateChange = (state, error) => {
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

  const search = async (query) => {
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
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

export { SearchContext };
