import { createSlice, createAction } from '@reduxjs/toolkit';

// Create a separate action to handle domain parameter
export const fetchRestaurantRequest = createAction('restaurant/fetchRestaurantRequest', (domain) => ({
  payload: domain
}));

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchRestaurantStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRestaurantSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchRestaurantError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchRestaurantStart, fetchRestaurantSuccess, fetchRestaurantError } = restaurantSlice.actions;

export default restaurantSlice.reducer;
