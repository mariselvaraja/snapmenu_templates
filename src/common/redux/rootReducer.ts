import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import inDiningCartReducer from './slices/inDiningCartSlice';
import menuReducer from './slices/menuSlice';
import siteContentReducer from './slices/siteContentSlice';
import searchReducer from './slices/searchSlice';
import restaurantReducer from './slices/restaurantSlice';
import inDiningOrderReducer from './slices/inDiningOrderSlice';
import tableAvailabilityReducer from './slices/tableAvailabilitySlice';
import makeReservationReducer from './slices/makeReservationSlice';
import tableStatusReducer from './slices/tableStatusSlice';
import orderHistoryReducer from './slices/orderHistorySlice';
import paymentReducer from './slices/paymentSlice';
import tpnReducer from '../../redux/slices/tpnSlice';
import comboReducer from '../../redux/slices/comboSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  inDiningCart: inDiningCartReducer,
  menu: menuReducer,
  siteContent: siteContentReducer,
  search: searchReducer,
  restaurant: restaurantReducer,
  inDiningOrder: inDiningOrderReducer,
  tableAvailability: tableAvailabilityReducer,
  makeReservation: makeReservationReducer,
  tableStatus: tableStatusReducer,
  orderHistory: orderHistoryReducer,
  payment: paymentReducer,
  tpn: tpnReducer,
  combo: comboReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
