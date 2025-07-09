import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MenuItem {
  id: number;
  pk_id?: string;
  restaurant_id?: string;
  sku_id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subCategory?: string;
  supplier?: string;
  brand?: string;
  modifiers?: string;
  unit?: string;
  taxable?: string;
  external_id?: string;
  bar_code?: string;
  comment?: string;
  cost?: string;
  quantity?: string;
  min_quantity?: string;
  max_quantity?: string;
  countable?: string;
  use_weighing_scale?: string;
  item_type?: string;
  duration?: string;
  discounts?: string;
  resources?: string;
  service_providers?: string;
  printer_type?: string;
  deposit?: string;
  visibility?: string;
  favorite?: string;
  sort_index?: string;
  out_of_stock?: string;
  is_enabled?: string;
  product_description?: string;
  level1_category?: string;
  level2_category?: string;
  appearance?: string;
  serving?: string;
  flavors?: string;
  variations?: string;
  allergy_info?: string;
  best_combo?: string;
  best_combo_ids?: string;
  best_name?: string;
  is_deleted?: string;
  tags?: string[];
  available: boolean;
  calories?: number;
  nutrients?: {
    protein?: string;
    carbs?: string;
    fat?: string;
    sat?: string;
    unsat?: string;
    trans?: string;
    sugar?: string;
    fiber?: string;
  };
  dietary?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
  };
  allergens?: string[];
  ingredients?: string[];
  pairings?: string[];
  modifiers_list?: {
    name: string;
    is_multi_select: string;
    is_forced: string;
    options: {
      name: string;
      price: number | string;
      isEnabled?: boolean;
      selectedByDefult?: string;
      attrSortIndex?: number;
      visibility?: string;
    }[];
  }[];
  is_spice_applicable?: string; // Added field to check if spice level should be shown
  raw_api_data?: string; // Added field to store the raw API data
  food_type?: string; // Added field to specify food type (veg, non-veg, etc.)
  indining_price?: number; // Added field for in-dining price
  inventory_status?: boolean; // Added field for inventory status
  prices?: { name: string; price: string }[]; // Added field for drinks pricing array
  type?: string; // Added field for drinks type (e.g., Whiskey, Beer)
  sub_type?: string; // Added field for drinks sub_type (e.g., Bourbon, IPA)
  party_orders?: { name: string; serving: string; price: string }[]; // Added field for party order options
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
}

interface MenuState {
  items: MenuItem[];
  categories: MenuCategory[];
  foodItems: MenuItem[];
  drinksItems: MenuItem[];
  loading: boolean;
  error: string | null;
  showMenuItems: boolean;
  currentMenuType: 'cards' | 'food' | 'drinks' | null;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  foodItems: [],
  drinksItems: [],
  loading: false,
  error: null,
  showMenuItems: typeof window !== 'undefined' ? sessionStorage.getItem('showMenuItems') === 'true' : false,
  currentMenuType: typeof window !== 'undefined' ? (sessionStorage.getItem('currentMenuType') as 'cards' | 'food' | 'drinks' | null) : null,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    // Synchronous actions
    setMenuItems: (state, action: PayloadAction<any[]>) => {
      console.log("action.payload", action.payload)
      state.items = action.payload;
    },
    setMenuCategories: (state, action: PayloadAction<any[]>) => {
      state.categories = action.payload;
    },
    setShowMenuItems: (state, action: PayloadAction<boolean>) => {
      state.showMenuItems = action.payload;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('showMenuItems', action.payload.toString());
      }
    },
    setCurrentMenuType: (state, action: PayloadAction<'cards' | 'food' | 'drinks' | null>) => {
      state.currentMenuType = action.payload;
      // Persist to sessionStorage
      if (typeof window !== 'undefined') {
        if (action.payload) {
          sessionStorage.setItem('currentMenuType', action.payload);
        } else {
          sessionStorage.removeItem('currentMenuType');
        }
      }
    },
    
    // Async action triggers for sagas
    fetchMenuRequest: (state, action: PayloadAction<string | undefined>) => {
      state.loading = true;
      state.error = null;
    },
    fetchMenuSuccess: (state, action: PayloadAction<{ items: any[], categories: any[], foodMenu?: any[], drinksMenu?: any[]}>) => {
      const { items, categories, foodMenu, drinksMenu } = action.payload;
      
      // If API response has separated foodMenu and drinksMenu, use them
      if (foodMenu && drinksMenu) {
        state.foodItems = foodMenu;
        state.drinksItems = drinksMenu;
        state.items = items; // Combined items for display
        state.categories = categories;
      } else {
        // Fallback to old logic for backward compatibility
        state.items = items;
        state.categories = categories;
      }
      
      state.loading = false;
    },
    fetchMenuFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setMenuItems,
  setMenuCategories,
  setShowMenuItems,
  setCurrentMenuType,
  fetchMenuRequest,
  fetchMenuSuccess,
  fetchMenuFailure
} = menuSlice.actions;

export default menuSlice.reducer;
