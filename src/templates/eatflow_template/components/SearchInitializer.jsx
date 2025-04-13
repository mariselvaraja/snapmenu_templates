import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import searchService, { SearchState } from '../../../services/searchService';

/**
 * Custom SearchInitializer component for the eatflow template
 * This component initializes the search service with menu data
 */
const SearchInitializer = () => {
  const dispatch = useAppDispatch();
  
  // Get menu items from Redux
  const menuItems = useAppSelector(state => state.menu.items);
  const searchState = useAppSelector(state => state.search.searchState);
  
  // Initialize search service with menu data
  useEffect(() => {
    if (menuItems && menuItems.length > 0 && searchState === SearchState.UNINITIALIZED) {
      console.log('Initializing search service with menu data');
      
      // Process menu items for search
      const processedItems = menuItems.map(item => {
        // Create a comprehensive set of searchable terms
        const searchTerms = [
          item.name,
          item.description || '',
          item.category || 'other',
          item.subCategory || '',
          ...(item.ingredients || []),
          ...(item.tags || [])
        ].filter(Boolean).join(' ').toLowerCase();
        
        return {
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: typeof item.price === 'number' ? item.price : 
                typeof item.price === 'string' ? parseFloat(item.price) : 0,
          category: item.category || 'other',
          searchTerms: searchTerms,
          tags: [
            item.category || 'other',
            item.subCategory || '',
            ...(item.tags || []),
            ...(item.dietary?.isVegetarian ? ['vegetarian'] : []),
            ...(item.dietary?.isVegan ? ['vegan'] : []),
            ...(item.dietary?.isGlutenFree ? ['gluten-free'] : [])
          ].filter(Boolean),
          image: item.image || '',
          available: item.available !== false
        };
      });
      
      // Initialize search service
      searchService.initializeIndex({ items: processedItems })
        .then(() => {
          console.log('Search service initialized successfully');
          // Force the search state to be ready
          dispatch({
            type: 'search/setSearchState',
            payload: { 
              state: SearchState.READY, 
              error: null, 
              progress: 100 
            }
          });
        })
        .catch((error) => {
          console.error('Failed to initialize search service:', error);
        });
    }
  }, [searchState, menuItems, dispatch]);

  // This component doesn't render anything
  return null;
};

export default SearchInitializer;
