import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import menuReducer from './slices/menuSlice';
import siteContentReducer from './slices/siteContentSlice';
import searchReducer from './slices/searchSlice';
import restaurantReducer from './slices/restaurantSlice';
import inDiningOrderReducer from './slices/inDiningOrderSlice';
import tableAvailabilityReducer from './slices/tableAvailabilitySlice';
import makeReservationReducer from './slices/makeReservationSlice';
import tableStatusReducer from './slices/tableStatusSlice';
import orderHistoryReducer from './slices/orderHistorySlice';
import tpnReducer from '../../redux/slices/tpnSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  menu: menuReducer,
  siteContent: siteContentReducer,
  search: searchReducer,
  restaurant: restaurantReducer,
  inDiningOrder: inDiningOrderReducer,
  tableAvailability: tableAvailabilityReducer,
  makeReservation: makeReservationReducer,
  tableStatus: tableStatusReducer,
  orderHistory: orderHistoryReducer,
  tpn: tpnReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
