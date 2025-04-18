import React from 'react';
import { BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import TitleUpdater from './components/TitleUpdater';
import { Navigation } from './components/Navigation';
import CasualDiningTemplateRoutes from '../../routes/casual_dining_template_routes';
import { SearchInitializer } from '../../components/search';
import { Footer } from './components/Footer';
import { CartProvider } from './context/CartContext';

// Layout component that conditionally renders the Navigation and Footer
const Layout = () => {
  const location = useLocation();
  const isInDiningOrderPage = location.pathname === '/placeindiningorder';
  const isInDiningOrderPageWithTable = location.pathname.startsWith('/placeindiningorder/');

  return (
    <div className="min-h-screen flex flex-col">
      <SearchInitializer />
      <TitleUpdater />
      {!isInDiningOrderPage && !isInDiningOrderPageWithTable && <Navigation />}
      {!isInDiningOrderPage && !isInDiningOrderPageWithTable && <CartDrawer />} {/* Only render CartDrawer when not on in-dining pages */}
      <main className={`flex-grow ${!isInDiningOrderPage && !isInDiningOrderPageWithTable ? 'pt-20' : ''}`}>
        <Routes>
          {CasualDiningTemplateRoutes}
        </Routes>
      </main>
      {!isInDiningOrderPage && !isInDiningOrderPageWithTable && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Layout />
      </CartProvider>
    </Router>
  );
}
