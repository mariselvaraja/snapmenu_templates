import React, { useEffect } from 'react';
import { store } from './common/store';
import Template from './templates/Template';
import { fetchRestaurantByDomainRequest } from './common/redux/slices/restaurantSlice';

export default function App() {
  function getSubdomain(url) {
    const { hostname } = new URL(url);
    const domainParts = hostname.split('.');
 
    // Assuming the last two parts are the domain and TLD
    if (domainParts.length > 2) {
        return   store.dispatch(fetchRestaurantByDomainRequest((domainParts.slice(0, -2).join('.'))));
    }
    return   store.dispatch(fetchRestaurantByDomainRequest("tonyspizza"))
  }
 
  useEffect(() => {
   getSubdomain(window.location.href);
  }, []);
  
  return <Template store={store} />;
}
