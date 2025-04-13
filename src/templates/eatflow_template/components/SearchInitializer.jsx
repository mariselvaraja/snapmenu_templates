import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import searchService, { SearchState } from '../../../services/searchService';
import { setSearchState } from '../../../redux/slices/searchSlice';

/**
 * Custom SearchInitializer component for the eatflow template
 * This component initializes the search service with menu data
 */
const SearchInitializer = () => {
  const dispatch = useAppDispatch();
  
  // Get menu items from Redux
  const menuItems = useAppSelector(state => state.menu.items);
  const menuCategories = useAppSelector(state => state.menu.categories);
  const searchState = useAppSelector(state => state.search.searchState);
  
  // Initialize search service with menu data
  useEffect(() => {
    if (menuItems && menuItems.length > 0 && searchState === SearchState.UNINITIALIZED) {
      console.log('Initializing search service with menu data:', menuItems.length, 'items');
      
      // Extract unique categories for better categorization
      const uniqueCategories = new Set();
      menuItems.forEach(item => {
        if (item.category) {
          uniqueCategories.add(item.category.toLowerCase());
        }
      });
      
      console.log('Extracted unique categories:', Array.from(uniqueCategories));
      
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
        
        // Ensure category is properly formatted
        const category = item.category ? 
          item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase() : 
          'Other';
        
        return {
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: typeof item.price === 'number' ? item.price : 
                typeof item.price === 'string' ? parseFloat(item.price) : 0,
          category: category,
          searchTerms: searchTerms,
          tags: [
            category,
            item.subCategory || '',
            ...(item.tags || []),
            ...(item.dietary?.isVegetarian ? ['vegetarian'] : []),
            ...(item.dietary?.isVegan ? ['vegan'] : []),
            ...(item.dietary?.isGlutenFree ? ['gluten-free'] : [])
          ].filter(Boolean),
          image: item.image || '',
          imageUrl: item.image || '',
          available: item.available !== false
        };
      });
      
      console.log('Processed items for search:', processedItems.length);
      
      // Initialize search service
      searchService.initializeIndex({ items: processedItems })
        .then(() => {
          console.log('Search service initialized successfully');
          // Force the search state to be ready
          dispatch(setSearchState({ 
            state: SearchState.READY, 
            error: null, 
            progress: 100 
          }));
        })
        .catch((error) => {
          console.error('Failed to initialize search service:', error);
          dispatch(setSearchState({ 
            state: SearchState.ERROR, 
            error: error.message, 
            progress: 0 
          }));
        });
    }
  }, [searchState, menuItems, menuCategories, dispatch]);

  // This component doesn't render anything
  return null;
};

export default SearchInitializer;
