/**
 * Menu service for handling menu-related API calls
 */

import api from './api';
import endpoints from '../config/endpoints';
import { MenuItem, MenuCategory } from '../redux/slices/menuSlice';

// Types for API responses
export interface MenuResponse {
  items: MenuItem[];
  categories: MenuCategory[];
}

// Helper function to transform API response to MenuItem format
const transformMenuItems = (apiResponse: any[]): MenuItem[] => {
  if (!apiResponse || !Array.isArray(apiResponse)) return [];
  
  return apiResponse.map(item => ({
    id: parseInt(item.sku_id?.replace('CHR', '')) || parseInt(item.id) || 0,
    pk_id: item.pk_id,
    restaurant_id: item.restaurant_id,
    sku_id: item.sku_id,
    name: item.name || '',
    description: item.description || item.product_description || '',
    price: parseFloat(item.price?.toString().replace('$', '')) || 0,
    image: item.image || '',
    category: item.level1_category || item.category || '',
    subCategory: item.level2_category || item.subCategory,
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
    available: item.is_enabled === 'true' || true,
    tags: extractTags(item),
    calories: item.calories,
    nutrients: item.nutrients,
    dietary: item.dietary,
    allergens: item.allergens,
    ingredients: item.ingredients,
    pairings: item.pairings
  }));
};

// Helper function to extract tags from menu item
const extractTags = (item: any): string[] => {
  const tags: string[] = [];
  
  // Add subcategory as a tag if available
  if (item.subCategory) {
    tags.push(item.subCategory.toLowerCase());
  }
  
  // Add dietary information as tags
  if (item.dietary) {
    if (item.dietary.isVegan) {
      tags.push('vegan');
      tags.push('vegetarian');
    }
  }
  
  // Add ingredients as tags if available
  if (item.ingredients && Array.isArray(item.ingredients)) {
    item.ingredients.forEach((ingredient: string) => {
      if (ingredient && ingredient.trim() !== '') {
        tags.push(ingredient.trim().toLowerCase());
      }
    });
  }
  
  // Remove duplicates and return
  return [...new Set(tags)];
};

// Helper function to extract categories from menu items
const extractCategories = (menuItems: any[]): MenuCategory[] => {
  if (!menuItems || !Array.isArray(menuItems)) return [];
  
  // Get unique categories
  const uniqueCategories = [...new Set(menuItems.map(item => item.level1_category || item.category))];
  
  // Create category objects
  return uniqueCategories
    .filter(category => category) // Filter out undefined/null/empty categories
    .map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      description: `${category} menu items`
    }));
};

/**
 * Service for handling menu-related operations
 */
export const menuService = {
  /**
   * Fetches all menu items and categories
   */
  getMenu: async (): Promise<MenuResponse> => {
    // Make API call to get menu data
    const response = await api.get<any[]>(endpoints.menu.getAll);
    
    // Process the menu data to match our expected format
    const items = transformMenuItems(response.data);
    const categories = extractCategories(response.data);
    
    return {
      items,
      categories
    };
  },
};

export default menuService;
