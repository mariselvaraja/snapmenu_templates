import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import TitleUpdater from './components/TitleUpdater';
import { Navigation } from './components/Navigation';
import CasualDiningTemplateRoutes from '../../routes/casual_dining_template_routes';
import { SearchInitializer } from '../../components/search';
import { Footer } from './components/Footer';
import { CartProvider } from './context/CartContext';

export default function App() {
  
  return (
    <CartProvider>
      <>
        <SearchInitializer />
        <CartDrawer /> {/* Render CartDrawer outside Routes */}
        <Router>
          <TitleUpdater />
          <Navigation /> {/* Navigation component moved to App level */}
          <Routes>
            {CasualDiningTemplateRoutes}
          </Routes>
          <Footer/>
        </Router>
      </>
    </CartProvider>
  );
}
