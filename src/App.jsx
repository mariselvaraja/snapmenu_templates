import React from 'react';
import { Provider } from 'react-redux';
import { store } from './common/store';
import PizzaApp from './templates/pizza_template/App';
import { fetchRestaurantByDomainRequest } from './common/redux/slices/restaurantSlice';
import { fetchSiteContentRequest } from './common/redux/slices/siteContentSlice';
import { fetchMenuRequest } from './common/redux/slices/menuSlice';

// Dispatch all actions directly when the app loads
// This is done outside of React components to ensure it happens immediately
store.dispatch(fetchRestaurantByDomainRequest('tonyspizza'));
// store.dispatch(fetchSiteContentRequest());
// store.dispatch(fetchMenuRequest());

export default function App() {
  return (
    <Provider store={store}>
      <PizzaApp />
    </Provider>
  );
}
