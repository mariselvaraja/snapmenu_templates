import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Settings, ShoppingCart } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { useCart } from '../context/CartContext';

export function Navigation() {
  const { siteContent, loading } = useSiteContent();
  const { toggleCart } = useCart();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!siteContent) {
    return <div>Error: Site content not loaded.</div>;
  }

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
          <button onClick={toggleCart} className="text-white hover:text-green-400 transition">
            <ShoppingCart className="h-6 w-6" />
          </button>
        </div>
        <button onClick={toggleCart} className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">
          Order Now
        </button>

      </div>
    </nav>
  );
}
