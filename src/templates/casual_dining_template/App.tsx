import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ContentProvider } from './context/ContentContext';
import { MenuProvider } from './context/MenuContext';
import CartDrawer from './components/CartDrawer';
import TitleUpdater from './components/TitleUpdater';
import { Navigation } from './components/Navigation';
import CasualDiningTemplateRoutes from '../../routes/casual_dining_template_routes';
import { SearchInitializer } from '../../components/search';

export default function App() {
  
  return (
    <ContentProvider>
      <MenuProvider>
        <CartProvider>
          <SearchInitializer />
          <CartDrawer /> {/* Render CartDrawer outside Routes */}
          <Router>
            <TitleUpdater />
            <Navigation /> {/* Navigation component moved to App level */}
            <Routes>
              {CasualDiningTemplateRoutes}
            </Routes>
          </Router>
        </CartProvider>
      </MenuProvider>
    </ContentProvider>
  );
}
