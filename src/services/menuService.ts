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
  getMenu: async (type?:any): Promise<{ items: MenuItem[], categories: MenuCategory[], foodMenu?: MenuItem[], drinksMenu?: MenuItem[] }> => {
    
    try {
      const url = type ? `${endpoints.menu.getAll}?type=${type}` : endpoints.menu.getAll;
      const response = await api.get<any>(url);
      
      // Check if response.data is a string (JSON string)
      let menuData = response.data;
      if (typeof response.data === 'string') {
        try {
          menuData = JSON.parse(response.data);
        } catch (e) {
          console.error('Error parsing menu data JSON string:', e);
        }
      }
      
      // Process the response data
      const items: MenuItem[] = [];
      const categories: MenuCategory[] = [];
      const categoryMap: { [key: string]: boolean } = {};
      let foodMenu: MenuItem[] = [];
      let drinksMenu: MenuItem[] = [];
      
      // Helper function to parse price
      function parsePrice(price: any): number {
        if (!price) return 0;
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
          return parseFloat(price.replace(/[^\d.-]/g, '')) || 0;
        }
        return 0;
      }

    // 
      
      // Helper function to determine dietary properties
      function getDietaryProperties(item: any): { isVegan: boolean; isVegetarian: boolean } {
        const isVegan = item.is_vegan === true || item.is_vegan?.toLowerCase() === "true" || item.is_vegan?.toLowerCase() === "yes";
        const foodType = (item.food_type || "").toLowerCase();
        const isVegFoodType = foodType === "veg" || foodType === "vegetarian";
        
        if (isVegan) {
          return { isVegan: true, isVegetarian: false };
        } else if (!isVegan && isVegFoodType) {
          return { isVegan: false, isVegetarian: true };
        } else {
          return { isVegan: false, isVegetarian: false };
        }
      }
      
      // Helper function to add category
      function addCategory(item: any, categories: MenuCategory[], categoryMap: { [key: string]: boolean }) {
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
      
      // Check if API response has separate foodMenu and drinksMenu arrays
      if (menuData && menuData.foodMenu && menuData.drinksMenu) {
        
        // Process food menu items
        if (Array.isArray(menuData.foodMenu)) {
          menuData.foodMenu.forEach((item: any) => {
            const dietaryProps = getDietaryProperties(item);
            const rawItem = {
              ...item,
              id: item.id || item.pk_id || Math.random().toString(36).substr(2, 9),
              name: item.name || '',
              description: item.description || item.product_description || '',
              price: parsePrice(item.price),
              image: item.image || '',
              category: item.category || item.level1_category || 'Food',
              dietary: {
                ...item.dietary,
                isVegan: dietaryProps.isVegan,
                isVegetarian: dietaryProps.isVegetarian,
              },
              raw_api_data: JSON.stringify(item, null, 2),
            };
            foodMenu.push(rawItem as any);
            items.push(rawItem as any);
            addCategory(item, categories, categoryMap);
          });
        }
        
        // Process drinks menu items
        if (Array.isArray(menuData.drinksMenu)) {
          menuData.drinksMenu.forEach((item: any) => {
            const dietaryProps = getDietaryProperties(item);
            const rawItem = {
              ...item,
              id: item.id || item.pk_id || Math.random().toString(36).substr(2, 9),
              name: item.name || 'Unnamed Item',
              description: item.description || item.product_description || '',
              price: parsePrice(item.price),
              image: item.image || '',
              category: item.category || item.level1_category || 'Drinks',
              dietary: {
                ...item.dietary,
                isVegan: dietaryProps.isVegan,
                isVegetarian: dietaryProps.isVegetarian,
              },
              raw_api_data: JSON.stringify(item, null, 2),
            };
            drinksMenu.push(rawItem as any);
            items.push(rawItem as any);
            addCategory(item, categories, categoryMap);
          });
        }
      } else if (menuData && Array.isArray(menuData)) {
        // If response is a direct array of menu items
        menuData.forEach((item: any) => {
          const dietaryProps = getDietaryProperties(item);
          // Store the raw item data
          const rawItem = {
            ...item,
            id: item.id || item.pk_id || Math.random().toString(36).substr(2, 9),
            name: item.name || 'Unnamed Item',
            description: item.description || item.product_description || '',
            price: parsePrice(item.price),
            image: item.image || '',
            category: item.category || item.level1_category || 'Uncategorized',
            dietary: {
              ...item.dietary,
              isVegan: dietaryProps.isVegan,
              isVegetarian: dietaryProps.isVegetarian,
            },
            raw_api_data: JSON.stringify(item, null, 2), // Store the raw API data
          };
          items.push(rawItem as any);
          
          // Add category if not already added
          addCategory(item, categories, categoryMap);
        });
      } else if (menuData && Array.isArray(menuData.menu_items)) {
        // If response has a menu_items array
        menuData.menu_items.forEach((item: any) => {
          const dietaryProps = getDietaryProperties(item);
          // Store the raw item data
          const rawItem = {
            ...item,
            id: item.id || item.pk_id || Math.random().toString(36).substr(2, 9),
            name: item.name || 'Unnamed Item',
            description: item.description || item.product_description || '',
            price: parsePrice(item.price),
            image: item.image || '',
            category: item.category || item.level1_category || 'Uncategorized',
            dietary: {
              ...item.dietary,
              isVegan: dietaryProps.isVegan,
              isVegetarian: dietaryProps.isVegetarian,
            },
            raw_api_data: JSON.stringify(item, null, 2), // Store the raw API data
          };
          items.push(rawItem as any);
          
          // Add category if not already added
          addCategory(item, categories, categoryMap);
        });
      } else if (menuData && menuData.menu && Array.isArray(menuData.menu)) {
        // If response has a menu array
        menuData.menu.forEach((item: any) => {
          const dietaryProps = getDietaryProperties(item);
          // Store the raw item data
          const rawItem = {
            ...item,
            id: item.id || item.pk_id || Math.random().toString(36).substr(2, 9),
            name: item.name || 'Unnamed Item',
            description: item.description || item.product_description || '',
            price: parsePrice(item.price),
            image: item.image || '',
            category: item.category || item.level1_category || 'Uncategorized',
            dietary: {
              ...item.dietary,
              isVegan: dietaryProps.isVegan,
              isVegetarian: dietaryProps.isVegetarian,
            },
            raw_api_data: JSON.stringify(item, null, 2), // Store the raw API data
          };
          items.push(rawItem as any);
          
          // Add category if not already added
          addCategory(item, categories, categoryMap);
        });
      } else if (menuData && typeof menuData === 'object') {
        // If response is an object with categories as keys
        Object.keys(menuData).forEach(category => {
          if (Array.isArray(menuData[category])) {
            menuData[category].forEach((item: any) => {
              // Add category to the item if not present
              const itemWithCategory = { ...item, category: category };
              const dietaryProps = getDietaryProperties(item);
              
              // Store the raw item data
              const rawItem = {
                ...itemWithCategory,
                id: item.id || item.pk_id || Math.random().toString(36).substr(2, 9),
                name: item.name || 'Unnamed Item',
                description: item.description || item.product_description || '',
                price: parsePrice(item.price),
                image: item.image || '',
                category: category,
                dietary: {
                  ...item.dietary,
                  isVegan: dietaryProps.isVegan,
                  isVegetarian: dietaryProps.isVegetarian,
                },
                raw_api_data: JSON.stringify(itemWithCategory, null, 2), // Store the raw API data
              };
              items.push(rawItem as any);
              
              // Add category if not already added
              addCategory(itemWithCategory, categories, categoryMap);
            });
          }
        });
      }
      
      return { items, categories, foodMenu, drinksMenu };
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
