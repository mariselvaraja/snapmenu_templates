import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ComboProduct {
  pk_id: string;
  sku_id: string;
  name: string;
  price: string;
  product_description: string;
  image?: string;
  is_enabled: boolean | string;
  modifiers_list?: any[];
  [key: string]: any; // For additional properties
}

interface ComboItem {
  combo_id: string;
  restaurant_id: string;
  title: string;
  description: string;
  products: ComboProduct[];
  combo_price: string;
  offer_percentage?: string;
  combo_image: string;
  is_enabled: boolean;
  created_date?: string;
}

interface ComboState {
  data: ComboItem[] | null;
  isActive: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ComboState = {
  data: null,
  isActive: false,
  loading: false,
  error: null,
};

export const comboSlice = createSlice({
  name: 'combo',
  initialState,
  reducers: {
    fetchComboRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchComboSuccess: (state, action: PayloadAction<{ data: ComboItem[], isActive: boolean }>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.isActive = action.payload.isActive;
    },
    fetchComboFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearComboError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchComboRequest,
  fetchComboSuccess,
  fetchComboFailure,
  clearComboError,
} = comboSlice.actions;

export default comboSlice.reducer;
