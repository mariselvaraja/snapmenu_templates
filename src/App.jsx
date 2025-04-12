import React from 'react';
import { store } from './common/store';
import Template from './templates/Template';
import { fetchRestaurantByDomainRequest } from './common/redux/slices/restaurantSlice';

// Dispatch all actions directly when the app loads
// This is done outside of React components to ensure it happens immediately
store.dispatch(fetchRestaurantByDomainRequest('tonyspizza'));

export default function App() {
  return <Template store={store} />;
}
