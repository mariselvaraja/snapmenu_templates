/**
 * Menu service for handling menu-related API calls
 */

import api, { ApiResponse } from './api';
import endpoints from '../config/endpoints';
import { MenuItem, MenuCategory } from '../redux/slices/menuSlice';

/**
 * Service for handling menu-related operations
 */
export const menuService = {
  /**
   * Fetches the menu data from the API
   */
  getMenu: async (): Promise<{ items: MenuItem[], categories: MenuCategory[] }> => {
    console.log('Fetching menu data from API');
    
    try {
      const response = await api.get<any>(endpoints.menu.getAll);
      
      // Process the response data
      const items: MenuItem[] = [];
      const categories: MenuCategory[] = [];
      const categoryMap: { [key: string]: boolean } = {};
      
      // Process menu items
      if (response.data && Array.isArray(response.data.menu_items)) {
        response.data.menu_items.forEach((item: any) => {
          // Add to items array
          items.push({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: parseFloat(item.price) || 0,
            image: item.image || '',
            category: item.category || 'Uncategorized',
            available: item.available !== false,
            // Add other fields as needed
          });
          
          // Add category if not already added
          if (item.category && !categoryMap[item.category]) {
            categoryMap[item.category] = true;
            categories.push({
              id: item.category.toLowerCase().replace(/\s+/g, '-'),
              name: item.category,
              description: '',
            });
          }
        });
      }
      
      return { items, categories };
    } catch (error) {
      console.error('Error fetching menu data:', error);
      throw error;
    }
  },

  /**
   * Fetches menu items by category
   */
  getMenuByCategory: async (category: string): Promise<MenuItem[]> => {
    console.log(`Fetching menu items for category ${category} from API`);
    
    try {
      const { items } = await menuService.getMenu();
      
      // Filter items by category
      return items.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error(`Error fetching menu items for category ${category}:`, error);
      throw error;
    }
  },

  /**
   * Fetches a menu item by ID
   */
  getMenuItem: async (id: number): Promise<MenuItem | null> => {
    console.log(`Fetching menu item ${id} from API`);
    
    try {
      const { items } = await menuService.getMenu();
      
      // Find item by ID
      const item = items.find(item => item.id === id);
      
      return item || null;
    } catch (error) {
      console.error(`Error fetching menu item ${id}:`, error);
      throw error;
    }
  },
};

export default menuService;
