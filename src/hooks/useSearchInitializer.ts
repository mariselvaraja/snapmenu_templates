import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../common/redux/hooks';
import searchService, { SearchState as SearchServiceState } from '../services/searchService';
import { setSearchState } from '../common/redux/slices/searchSlice';

/**
 * Custom hook to initialize the search service with menu data
 * This hook should be used in a component that has access to the Redux store
 * and will initialize the search service when the menu data is loaded
 */
export function useSearchInitializer() {
  // Get search state from Redux store
  const searchState = useAppSelector((state: any) => state.search.searchState);
  const menuItems = useAppSelector((state: any) => state.menu.items);
  const dispatch = useAppDispatch();

  // Get menu loading state
  const menuLoading = useAppSelector((state: any) => state.menu.loading);
  
  // We no longer need to fetch menu data here as it's handled by the site content saga
  // This prevents multiple calls to fetch menu data
  // The search service will still be initialized when menu data becomes available

  // Initialize search service when menu data is loaded
  useEffect(() => {
    // Only initialize if search is not already initialized and we have menu items
    if (searchState === SearchServiceState.UNINITIALIZED && menuItems && menuItems.length > 0) {
      console.log('Initializing search service with menu data from API');
      
      // Process menu data from the Redux store
      interface ProcessedItem {
        id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        tags: string[];
        image: string;
        available: boolean;
      }
      
      const processedItems: ProcessedItem[] = [];
      
      // Process each menu item
      menuItems.forEach((item: any) => {
        if (item.id && item.name && item.category) {
          // Create a more comprehensive set of tags for better search matching
          const tags = [];
          
          // Add category as a tag for better category search
          tags.push(item.category.toLowerCase());
          
          // Add dietary tags if available
          if (item.dietary) {
            if (item.dietary.isVegetarian) tags.push('vegetarian');
            if (item.dietary.isVegan) tags.push('vegan');
            if (item.dietary.isGlutenFree) tags.push('gluten-free');
          }
          
          // Add ingredients as tags if available
          if (item.ingredients && Array.isArray(item.ingredients)) {
            item.ingredients.forEach((ingredient: string) => {
              tags.push(ingredient.toLowerCase());
            });
          }
          
          // Add any existing tags
          if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach((tag: string) => {
              tags.push(tag.toLowerCase());
            });
          }
          
          processedItems.push({
            id: item.id.toString(),
            name: item.name,
            description: item.description || '',
            price: typeof item.price === 'number' ? item.price : 
                   typeof item.price === 'string' ? parseFloat(item.price) : 0,
            category: item.category,
            tags: tags,
            image: item.image || '',
            available: item.available !== false
          });
        }
      });
      
      console.log('Processed menu items:', processedItems.length);
      
      // Transform menu data to the format expected by the search service
      const searchData = {
        items: processedItems
      };

      // Initialize search service
      searchService.initializeIndex(searchData)
        .then(() => {
          console.log('Search service initialized successfully');
          // Update search state in Redux store
          dispatch(setSearchState({
            state: SearchServiceState.READY,
            error: null,
            progress: 100
          }));
        })
        .catch((error) => {
          console.error('Failed to initialize search service:', error);
          // Update search state in Redux store with error
          dispatch(setSearchState({
            state: SearchServiceState.ERROR,
            error: error.message || 'Failed to initialize search service',
            progress: 0
          }));
        });
    }
  }, [searchState, menuItems]);

  return null;
}

export default useSearchInitializer;
