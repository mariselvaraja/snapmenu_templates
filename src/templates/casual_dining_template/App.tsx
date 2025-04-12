import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ContentProvider } from './context/ContentContext';
import { MenuProvider } from './context/MenuContext';
import CartDrawer from './components/CartDrawer';
import TitleUpdater from './components/TitleUpdater';
import CasualDiningTemplateRoutes from '../../routes/casual_dining_template_routes';

export default function App() {
  
  return (
    <ContentProvider>
      <MenuProvider>
        <CartProvider>
          <CartDrawer /> {/* Render CartDrawer outside Routes */}
          <Router>
            <TitleUpdater />
            <Routes>
              {CasualDiningTemplateRoutes}
            </Routes>
          </Router>
        </CartProvider>
      </MenuProvider>
    </ContentProvider>
  );
}
