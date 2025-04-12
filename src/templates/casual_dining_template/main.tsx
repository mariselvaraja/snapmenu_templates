import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ContentProvider } from './context/ContentContext';
import { MenuProvider } from './context/MenuContext';
import { CartProvider } from './context/CartContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <MenuProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </MenuProvider>
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>
);
