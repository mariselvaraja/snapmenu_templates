import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { EatflowTemplateRoutes } from '../../routes';
import TitleUpdater from './components/TitleUpdater';
import { Utensils, Settings, ShoppingCart, Instagram, Facebook, Twitter, Search } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { openSearchModal } from '../../redux/slices/searchSlice';
import SearchInitializer from './components/SearchInitializer';
import SearchModal from './components/SearchModal';

function App() {
  return (
    <CartProvider>
      {/* Use the hook inside the provider */} <CartContent />
    </CartProvider>
  );
}

// Static navigation data
const staticNavData = {
  brand: {
    logo: {
      icon: "Utensils",
      text: "EatFlow"
    }
  },
  navigation: {
    links: [
      {
        label: "Home",
        path: "/",
        isEnabled: true,
        ariaLabel: "Home page"
      },
      {
        label: "Menu",
        path: "/menu",
        isEnabled: true,
        ariaLabel: "Menu page"
      },
      {
        label: "About",
        path: "/about",
        isEnabled: true,
        ariaLabel: "About page"
      },
      {
        label: "Blog",
        path: "/blog",
        isEnabled: true,
        ariaLabel: "Blog page"
      },
      {
        label: "Reservation",
        path: "/reservation",
        isEnabled: true,
        ariaLabel: "Reservation page"
      },
      {
        label: "Contact",
        path: "/contact",
        isEnabled: true,
        ariaLabel: "Contact page"
      }
    ]
  }
};

function CartContent() {
  const { isCartOpen, toggleCart } = useCart();
  const dispatch = useAppDispatch();
  const isSearchModalOpen = useAppSelector((state) => state.search.isModalOpen);
  const [isScrolled, setIsScrolled] = useState(false);

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
    <Router>
      <div className="min-h-screen flex flex-col">
        <TitleUpdater />
        <SearchInitializer />
        
        {/* Navigation bar moved directly into App */}
        <nav className={`fixed top-0 left-0 right-0 z-30 ${isScrolled ? 'bg-black/85 backdrop-blur-sm' : 'bg-black'} transition-all duration-300`}>
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                {renderIcon(staticNavData.brand.logo.icon)}
                <span className="text-2xl font-bold text-white">{staticNavData.brand.logo.text}</span>
              </Link>
              <div className="hidden md:flex space-x-8 text-white">
                {staticNavData.navigation.links
                  .filter(link => link.isEnabled)
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
        
        {/* Spacer to prevent content from being hidden behind fixed navbar */}
        <div className="h-24"></div>
        
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
        {/* Footer moved directly into App */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12">
              <div>
                <Link to="/" className="flex items-center space-x-2 mb-6">
                  <Utensils className="h-8 w-8 text-green-400" />
                  <span className="text-2xl font-bold">EatFlow</span>
                </Link>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h4>
                  <p className="text-gray-400 mb-4">Stay updated with our latest recipes, nutrition tips, and special offers.</p>
                  <div className="flex">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="px-4 py-2 rounded-l-lg w-full focus:outline-none"
                    />
                    <button className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
                  <li><Link to="/menu" className="hover:text-green-400 transition">Menu</Link></li>
                  <li><Link to="/about" className="hover:text-green-400 transition">About Us</Link></li>
                  <li><Link to="/blog" className="hover:text-green-400 transition">Blog</Link></li>
                  <li><Link to="/contact" className="hover:text-green-400 transition">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Information</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/reservation" className="hover:text-green-400 transition">Reservations</Link></li>
                  <li><Link to="/delivery" className="hover:text-green-400 transition">Delivery</Link></li>
                  <li><Link to="/faq" className="hover:text-green-400 transition">FAQ</Link></li>
                  <li><Link to="/privacy" className="hover:text-green-400 transition">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-green-400 transition">Terms of Service</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="https://instagram.com" className="hover:text-green-400 transition" aria-label="Follow us on Instagram">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="https://facebook.com" className="hover:text-green-400 transition" aria-label="Follow us on Facebook">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="https://twitter.com" className="hover:text-green-400 transition" aria-label="Follow us on Twitter">
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>© 2025 EatFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
