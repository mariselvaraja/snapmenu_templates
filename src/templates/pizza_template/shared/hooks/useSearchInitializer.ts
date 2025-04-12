import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { searchService, SearchState } from '../services';

/**
 * Custom hook to initialize the search service with menu data
 * This hook should be used in a component that has access to the Redux store
 * and will initialize the search service when the menu data is loaded
 */
export function useSearchInitializer() {
  // Get search state from Redux store
  const searchState = useAppSelector((state) => state.search.searchState);
  const menuItems = useAppSelector((state) => state.menu.items);
  const dispatch = useAppDispatch();

  // Fetch menu data if not already loaded
  useEffect(() => {
    if ((!menuItems || menuItems.length === 0) && searchState === SearchState.UNINITIALIZED) {
      dispatch({ type: 'menu/fetchMenuRequest' });
    }
  }, [dispatch, menuItems, searchState]);

  // Initialize search service when menu data is loaded
  useEffect(() => {
    // Only initialize if search is not already initialized and we have menu items
    if (searchState === SearchState.UNINITIALIZED && menuItems && menuItems.length > 0) {
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
      menuItems.forEach(item => {
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
        })
        .catch((error) => {
          console.error('Failed to initialize search service:', error);
        });
    }
  }, [searchState]);

  return null;
}

export default useSearchInitializer;
