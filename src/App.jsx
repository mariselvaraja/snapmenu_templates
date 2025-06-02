import React, { useEffect, useState } from 'react';
import { store } from './common/store';
import Template from './templates/Template';
import AppRouter from './Router';
import { fetchRestaurantByDomainRequest } from './common/redux/slices/restaurantSlice';
import { useDispatch } from 'react-redux';

export default function App() {
  // This would typically come from an API or configuration
  const [templateId, setTemplateId] = useState('casual_dining_template');

  const dispatch = useDispatch();

  // Check for preview mode in URL and store in session storage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true';
    sessionStorage.setItem('isPreviewMode', isPreview.toString());
  
  }, []);

 
  useEffect(() => {
    sessionStorage.clear()
    dispatch(fetchRestaurantByDomainRequest())
  }, []);

  return <Template store={store} />;
}
