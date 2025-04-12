import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant } from '../../services/restaurantService';

interface RestaurantState {
  info: Restaurant | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  info: null,
  loading: false,
  error: null,
};

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    // Async action triggers for sagas
    fetchRestaurantInfoRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRestaurantInfoSuccess: (state, action: PayloadAction<Restaurant>) => {
      state.info = action.payload;
      state.loading = false;
    },
    fetchRestaurantInfoFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchRestaurantInfoRequest,
  fetchRestaurantInfoSuccess,
  fetchRestaurantInfoFailure,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
