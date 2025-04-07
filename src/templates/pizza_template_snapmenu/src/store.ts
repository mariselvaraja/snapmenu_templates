import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import reservationReducer from './reservationSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    reservation: reservationReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
