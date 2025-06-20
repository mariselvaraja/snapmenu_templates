import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import menuReducer from './slices/menuSlice';
import siteContentReducer from './slices/siteContentSlice';
import searchReducer from './slices/searchSlice';
import restaurantReducer from './slices/restaurantSlice';
import tpnReducer from './slices/tpnSlice';
import comboReducer from './slices/comboSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  menu: menuReducer,
  siteContent: siteContentReducer,
  search: searchReducer,
  restaurant: restaurantReducer,
  tpn: tpnReducer,
  combo: comboReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
