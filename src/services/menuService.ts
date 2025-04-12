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
      
      console.log('Menu API response:', response.data);
      
      // Check if response.data is a string (JSON string)
      let menuData = response.data;
      if (typeof response.data === 'string') {
        try {
          menuData = JSON.parse(response.data);
        } catch (e) {
          console.error('Error parsing menu data JSON string:', e);
        }
      }
      
      // Process menu items - handle different possible response structures
      if (menuData && Array.isArray(menuData)) {
        // If response is a direct array of menu items
        menuData.forEach((item: any) => {
          processMenuItem(item, items, categories, categoryMap);
        });
      } else if (menuData && Array.isArray(menuData.menu_items)) {
        // If response has a menu_items array
        menuData.menu_items.forEach((item: any) => {
          processMenuItem(item, items, categories, categoryMap);
        });
      } else if (menuData && menuData.menu && Array.isArray(menuData.menu)) {
        // If response has a menu array
        menuData.menu.forEach((item: any) => {
          processMenuItem(item, items, categories, categoryMap);
        });
      } else if (menuData && typeof menuData === 'object') {
        // If response is an object with categories as keys
        Object.keys(menuData).forEach(category => {
          if (Array.isArray(menuData[category])) {
            menuData[category].forEach((item: any) => {
              // Add category to the item if not present
              const itemWithCategory = { ...item, category: category };
              processMenuItem(itemWithCategory, items, categories, categoryMap);
            });
          }
        });
      }
      
      // If no items were processed, log an error
      if (items.length === 0) {
        console.error('No menu items found in API response:', menuData);
      }
      
      // Helper function to process a menu item
      function processMenuItem(item: any, items: MenuItem[], categories: MenuCategory[], categoryMap: { [key: string]: boolean }) {
        // Add to items array
        items.push({
          id: item.id || Math.random().toString(36).substr(2, 9),
          name: item.name || 'Unnamed Item',
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
