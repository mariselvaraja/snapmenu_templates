import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Link, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import EatflowTemplateRoutes from '../../routes/eatflow_template_routes';
import TitleUpdater from './components/TitleUpdater';
import { Utensils, Settings, ShoppingCart, Search } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../redux';
import { openSearchModal } from '../../redux/slices/searchSlice';
import SearchInitializer from './components/SearchInitializer';
import SearchModal from './components/SearchModal';

// Layout component that conditionally renders the Navbar and Footer
const Layout = () => {
  const { isCartOpen, toggleCart } = useCart();
  const dispatch = useAppDispatch();
  const isSearchModalOpen = useAppSelector((state) => state.search.isModalOpen);
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    { navigationBar: { brand: { logo: {} }, navigation: { links: [] } } };
  const navigationBar = siteContent?.navigationBar || { brand: { logo: {} }, navigation: { links: [] } };
  const { brand, navigation } = navigationBar;

  // Check if current page is an in-dining order page
  const location = useLocation();
  const isInDiningOrderPage = location.pathname === '/placeindiningorder';
  const isInDiningOrderPageWithTable = location.pathname.startsWith('/placeindiningorder/');
  const shouldShowNavAndFooter = !isInDiningOrderPage && !isInDiningOrderPageWithTable;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to render the appropriate icon
  const renderIcon = (iconName) => {
    switch(iconName) {
      case 'Settings':
        return <Settings className="h-5 w-5" />;
      case 'Utensils':
      default:
        return <Utensils className="h-8 w-8 text-green-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TitleUpdater />
      <SearchInitializer />
      
      {/* Navigation bar - only shown on non-in-dining pages */}
      {shouldShowNavAndFooter && (
        <nav className={`fixed top-0 left-0 right-0 z-30 ${isScrolled ? 'bg-black/85 backdrop-blur-sm' : 'bg-black'} transition-all duration-300`}>
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                {renderIcon(brand?.logo?.icon || "Utensils")}
                <span className="text-2xl font-bold text-white">{brand?.logo?.text || "EatFlow"}</span>
              </Link>
              <div className="hidden md:flex space-x-8 text-white">
                {navigation?.links
                  ?.filter(link => link.isEnabled)
                  .map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="text-white hover:text-green-400 transition flex items-center space-x-1"
                      aria-label={link.ariaLabel}
                    >
                      {link.icon && renderIcon(link.icon)}
                      {link.label && <span>{link.label}</span>}
                    </Link>
                  ))}
                <button 
                  onClick={() => dispatch(openSearchModal())}
                  className="text-white hover:text-green-400 transition"
                >
                  <Search className="h-6 w-6" />
                </button>
                <button onClick={toggleCart} className="text-white hover:text-green-400 transition">
                  <ShoppingCart className="h-6 w-6" />
                </button>
              </div>
              <button onClick={toggleCart} className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">
                Order Now
              </button>
            </div>
          </div>
        </nav>
      )}
      
      {/* Spacer to prevent content from being hidden behind fixed navbar - only added when navbar is shown */}
      {shouldShowNavAndFooter && <div className="h-24"></div>}
      
      <CartDrawer isOpen={isCartOpen} onClose={toggleCart} />
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => dispatch({ type: 'search/closeSearchModal' })} 
      />
      <main className="flex-grow">
        <Routes>
          {EatflowTemplateRoutes}
        </Routes>
      </main>
      {shouldShowNavAndFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout />
      </Router>
    </CartProvider>
  );
}

export default App;
