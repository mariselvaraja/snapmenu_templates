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
        // Parse price from string (e.g., "$4.99") to number
        let price = 0;
        if (item.price) {
          if (typeof item.price === 'number') {
            price = item.price;
          } else if (typeof item.price === 'string') {
            // Remove dollar sign and convert to number
            price = parseFloat(item.price.replace(/[^\d.-]/g, '')) || 0;
          }
        }
        
        // Process dietary information
        const dietary = {
          isVegetarian: item.dietary?.isVegetarian || false,
          isVegan: item.dietary?.isVegan || (item.is_vegan === 'yes'),
          isGlutenFree: item.dietary?.isGlutenFree || false
        };
        
        // Process nutrients information
        const nutrients = item.nutrients || {};
        
        // Process ingredients (could be an array or a string)
        let ingredients = item.ingredients || [];
        if (typeof ingredients === 'string') {
          ingredients = ingredients.split(',').map((i: string) => i.trim());
        }
        
        // Process allergens (could be an array or a string)
        let allergens = item.allergens || [];
        if (typeof allergens === 'string') {
          allergens = allergens.split(',').map((a: string) => a.trim());
        }
        
        // Process tags (could be an array or a string)
        let tags = item.tags || [];
        if (typeof tags === 'string') {
          tags = tags.split(',').map((t: string) => t.trim());
        }
        
        // Add to items array with all available fields
        items.push({
          id: item.id || item.pk_id || Math.random().toString(36).substr(2, 9),
          pk_id: item.pk_id,
          restaurant_id: item.restaurant_id,
          sku_id: item.sku_id,
          name: item.name || 'Unnamed Item',
          description: item.description || item.product_description || '',
          price: price,
          image: item.image || '',
          category: item.category || item.level1_category || 'Uncategorized',
          subCategory: item.subCategory || item.level2_category,
          supplier: item.supplier,
          brand: item.brand,
          modifiers: item.modifiers,
          unit: item.unit,
          taxable: item.taxable,
          external_id: item.external_id,
          bar_code: item.bar_code,
          comment: item.comment,
          cost: item.cost,
          quantity: item.quantity,
          min_quantity: item.min_quantity,
          max_quantity: item.max_quantity,
          countable: item.countable,
          use_weighing_scale: item.use_weighing_scale,
          item_type: item.item_type,
          duration: item.duration,
          discounts: item.discounts,
          resources: item.resources,
          service_providers: item.service_providers,
          printer_type: item.printer_type,
          deposit: item.deposit,
          visibility: item.visibility,
          favorite: item.favorite,
          sort_index: item.sort_index,
          out_of_stock: item.out_of_stock,
          is_enabled: item.is_enabled,
          product_description: item.product_description,
          level1_category: item.level1_category,
          level2_category: item.level2_category,
          appearance: item.appearance,
          serving: item.serving,
          flavors: item.flavors,
          variations: item.variations,
          allergy_info: item.allergy_info,
          best_combo: item.best_combo,
          is_deleted: item.is_deleted,
          available: item.is_enabled !== 'false' && item.available !== false,
          calories: item.calories ? Number(item.calories) : undefined,
          nutrients: nutrients,
          dietary: dietary,
          allergens: allergens,
          ingredients: ingredients,
          pairings: item.pairings || [],
          tags: tags,
        });
        
        // Add category if not already added
        const categoryName = item.category || item.level1_category || 'Uncategorized';
        if (categoryName && !categoryMap[categoryName]) {
          categoryMap[categoryName] = true;
          categories.push({
            id: categoryName.toLowerCase().replace(/\s+/g, '-'),
            name: categoryName,
            description: '',
          });
        }
        
        // Add subcategory if available
        const subCategoryName = item.subCategory || item.level2_category;
        if (subCategoryName && !categoryMap[subCategoryName]) {
          categoryMap[subCategoryName] = true;
          categories.push({
            id: subCategoryName.toLowerCase().replace(/\s+/g, '-'),
            name: subCategoryName,
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
