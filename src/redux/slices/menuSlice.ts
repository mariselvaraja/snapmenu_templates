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
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
}

interface MenuState {
  items: MenuItem[];
  categories: MenuCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  loading: false,
  error: null,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    // Synchronous actions
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.items = action.payload;
    },
    setMenuCategories: (state, action: PayloadAction<MenuCategory[]>) => {
      state.categories = action.payload;
    },
    
    // Async action triggers for sagas
    fetchMenuRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMenuSuccess: (state, action: PayloadAction<{ items: MenuItem[], categories: MenuCategory[] }>) => {
      state.items = action.payload.items;
      state.categories = action.payload.categories;
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
  fetchMenuRequest,
  fetchMenuSuccess,
  fetchMenuFailure,
} = menuSlice.actions;

export default menuSlice.reducer;
