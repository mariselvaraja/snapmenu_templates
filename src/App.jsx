import React, { useEffect, useState } from 'react';
import { store } from './common/store';
import Template from './templates/Template';
import AppRouter from './Router';
import { fetchRestaurantByDomainRequest } from './common/redux/slices/restaurantSlice';

export default function App() {
  // This would typically come from an API or configuration
  const [templateId, setTemplateId] = useState('casual_dining_template');

  function getSubdomain(url) {
    const { hostname } = new URL(url);
    const domainParts = hostname.split('.');
 
    // Assuming the last two parts are the domain and TLD
    // if (domainParts.length > 2) {
    //     return store.dispatch(fetchRestaurantByDomainRequest((domainParts.slice(0, -2).join('.'))));
    // }
    return store.dispatch(fetchRestaurantByDomainRequest("tonyspizza"))
  }
 
  useEffect(() => {
    getSubdomain(window.location.href);
    
    // In a real application, you might determine the template ID based on:
    // 1. Restaurant configuration from API
    // 2. URL parameters
    // 3. User selection
    // For now, we're hardcoding it to 'casual_dining_template'
  }, []);
  
  // For development/testing purposes, you can use the Router component directly
  // return <AppRouter templateId={templateId} />;
  
  // For production, use the Template component which handles API data loading
  return <Template store={store} />;
}
