import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ContentProvider } from './context/ContentContext';
import { CartProvider } from './context/CartContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>
);
