import React from 'react';
import { BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import TitleUpdater from './components/TitleUpdater';
import PizzaTemplateRoutes from '../../routes/pizza_template_routes';
import { SiteContentProvider } from './context/SiteContentContext';
import { SearchInitializer } from '../../components';

// Layout component that conditionally renders the Navbar
const Layout = () => {
  const location = useLocation();
  const isInDiningOrderPage = location.pathname === '/placeindiningorder';

  return (
    <div className="min-h-screen flex flex-col">
      <SearchInitializer />
      <TitleUpdater />
      {!isInDiningOrderPage && <Navbar />}
      <CartDrawer />
      <main className={`flex-grow ${!isInDiningOrderPage ? 'pt-20' : ''}`}>
        <Routes>
          {PizzaTemplateRoutes}
        </Routes>
      </main>
      {!isInDiningOrderPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <SiteContentProvider>
      <Router>
        <Layout />
      </Router>
    </SiteContentProvider>
  );
}

export default App;
