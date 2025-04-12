import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import TitleUpdater from './components/TitleUpdater';
import PizzaTemplateRoutes from '../../routes/pizza_template_routes';
import { SiteContentProvider } from './context/SiteContentContext';
import { SearchInitializer } from './shared';

function App() {
  return (
    <SiteContentProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <SearchInitializer />
          <TitleUpdater />
          <Navbar />
          <CartDrawer />
          <main className="flex-grow pt-20">
            <Routes>
              {PizzaTemplateRoutes}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </SiteContentProvider>
  );
}

export default App;
