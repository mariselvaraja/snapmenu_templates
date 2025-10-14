import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FestivalMenuItem {
  id: string;
  name: string;
  price: number;
  indining_price?: number;
  image?: string;
  description?: string;
  category?: string;
  level2_category?: string;
  type?: string;
  sub_type?: string;
  modifiers_list?: any[];
  is_spice_applicable?: string;
  food_type?: string;
  is_vegan?: string;
  [key: string]: any;
}

interface FestivalMenuState {
  items: FestivalMenuItem[];
  foodItems: FestivalMenuItem[];
  drinksItems: FestivalMenuItem[];
  loading: boolean;
  error: string | null;
  rawData: any | null;
}

const initialState: FestivalMenuState = {
  items: [],
  foodItems: [],
  drinksItems: [],
  loading: false,
  error: null,
  rawData: null
};

const festivalMenuSlice = createSlice({
  name: 'festivalMenu',
  initialState,
  reducers: {
    getFestivalMenuRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getFestivalMenuSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.rawData = action.payload.rawResponse;
      
      // Extract food and drinks items (already filtered by saga)
      const foodItems = action.payload.foodMenu || [];
      const drinksItems = action.payload.drinksMenu || [];
      
      state.foodItems = foodItems;
      state.drinksItems = drinksItems;
      state.items = [...foodItems, ...drinksItems];
      state.error = null;
      
      console.log('Quick menu loaded:', {
        foodItems: foodItems.length,
        drinksItems: drinksItems.length
      });
    },
    getFestivalMenuFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearFestivalMenu: (state) => {
      state.items = [];
      state.foodItems = [];
      state.drinksItems = [];
      state.loading = false;
      state.error = null;
      state.rawData = null;
    }
  }
});

export const {
  getFestivalMenuRequest,
  getFestivalMenuSuccess,
  getFestivalMenuFailure,
  clearFestivalMenu
} = festivalMenuSlice.actions;

export default festivalMenuSlice.reducer;
