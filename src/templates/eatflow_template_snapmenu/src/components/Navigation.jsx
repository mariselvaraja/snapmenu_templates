import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Settings, ShoppingCart, Search } from 'lucide-react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';
import { useCart } from '../context/CartContext';
import { SearchProvider } from '../context/SearchContext';
import SearchModal from './SearchModal';

export function Navigation() {
  const { siteContent: rootSiteContent, loading } = useRootSiteContent();
  const { toggleCart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Default site content with required properties
  const defaultSiteContent = {
    brand: {
      name: "Default Restaurant",
      logo: {
        icon: "Utensils",
        text: "Default Restaurant"
      }
    },
    navigation: {
      links: []
    }
  };

  // Transform the site content structure if needed
  const siteContent = rootSiteContent ? {
    // Use navigationBar properties if available, otherwise use top-level properties or defaults
    brand: rootSiteContent.navigationBar?.brand || rootSiteContent.brand || defaultSiteContent.brand,
    navigation: rootSiteContent.navigationBar?.navigation || rootSiteContent.navigation || defaultSiteContent.navigation,
  } : defaultSiteContent;

  const { brand, navigation } = siteContent;

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
    <>
      <nav className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {renderIcon(brand.logo.icon)}
            <span className="text-2xl font-bold text-white">{brand.logo.text}</span>
          </Link>
          <div className="hidden md:flex space-x-8 text-white">
            {navigation.links
              .filter(link => link.isEnabled)
              .map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="hover:text-green-400 transition flex items-center space-x-1"
                  aria-label={link.ariaLabel}
                >
                  {link.icon && renderIcon(link.icon)}
                  {link.label && <span>{link.label}</span>}
                </Link>
              ))}
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="text-white hover:text-green-400 transition"
              aria-label="Search menu"
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
      </nav>
      
      {/* Search Modal */}
      <SearchProvider>
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </SearchProvider>
    </>
  );
}
