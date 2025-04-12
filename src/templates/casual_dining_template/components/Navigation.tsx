import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X, ShoppingCart } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useCart } from '../context/CartContext';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { siteContent } = useContent();
  const { toggleCart, cart } = useCart();

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

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
        <div className="p-6">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6">
            <X className="w-8 h-8" />
          </button>
          <div className="flex flex-col space-y-8 mt-16 text-2xl">
            {siteContent.navigation.links.map((link) => (
              link.isEnabled && (
                <Link
                  key={link.label}
                  to={link.path}
                  className="hover:text-yellow-400 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
            <button onClick={toggleCart} className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-300 transition">
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={`w-full fixed z-30 ${isScrolled ? 'bg-black' : 'bg-transparent'} px-6 py-8 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold">{siteContent.brand.name}</Link>
          <div className="hidden md:flex space-x-8 items-center">
            {siteContent.navigation.links.map((link) => (
              link.isEnabled && (
                <Link
                  key={link.label}
                  to={link.path}
                  className="hover:text-yellow-400 transition"
                >
                  {link.label}
                </Link>
              )
            ))}
            <button onClick={toggleCart} className="relative hover:text-yellow-300 transition">
              <ShoppingCart className="w-6 h-6 text-yellow-400" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <MenuIcon className="w-8 h-8" />
          </button>
        </div>
      </nav>
    </>
  );
}
