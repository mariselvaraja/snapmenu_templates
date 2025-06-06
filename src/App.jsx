import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './common/store';
import Template from './templates/Template';
import AppRouter from './Router';
import { fetchRestaurantByDomainRequest } from './common/redux/slices/restaurantSlice';
import { useDispatch } from 'react-redux';
import { PaymentSuccess, PaymentFailure } from './common/payments/ipos/index';

// Component to handle Redux dispatch within Provider
const AppContent = () => {
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

  return (
    <Routes>
      {/* Common payment routes - rendered outside of any template */}
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failure" element={<PaymentFailure />} />
      
      {/* All other routes handled by Template */}
      <Route path="*" element={<Template store={store} />} />
    </Routes>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}
