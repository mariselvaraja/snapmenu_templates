import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Settings, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

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

export function Navigation() {
  const { toggleCart } = useCart();

  // Use static navigation data
  const { brand, navigation } = staticNavData;

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
