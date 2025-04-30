import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X, ShoppingCart, Search, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { openSearchModal } from '../../../redux/slices/searchSlice';
import { SearchModal } from '../../../components/search';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleCart, cart } = useCart();
  
  // Redux integration
  const dispatch = useAppDispatch();
  const isSearchModalOpen = useAppSelector((state) => state.search.isModalOpen);
  
  // Get site content from Redux state
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Parse the site content from the raw API response
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    { navigationBar: { brand: { name: 'Restaurant' }, navigation: { links: [] } } };

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
  
  // Handle search modal open
  const handleOpenSearch = () => {
    dispatch(openSearchModal());
  };

  // Get navigation links from the site content
  const navigationLinks = siteContent.navigation || siteContent.navigation?.links || siteContent.navigationBar?.navigation?.links || [];
  const brandName = siteContent.brand?.name || siteContent.navigationBar?.brand?.name || 'Restaurant';

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
        <div className="p-6">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6">
            <X className="w-8 h-8" />
          </button>
          <div className="flex flex-col space-y-8 mt-16 text-2xl">
            {navigationLinks.filter((link: any) => link.isEnabled).map((link: any) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-white hover:text-yellow-400 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button onClick={toggleCart} className="bg-yellow-400 text-black px-6 py-2 rounded-full hover:bg-yellow-300 transition">
              Order Now
            </button>
            <div className="flex space-x-4 mt-4">
              <button 
                onClick={handleOpenSearch}
                className="p-2 text-white hover:text-yellow-400 transition"
              >
                <Search className="h-6 w-6 text-yellow-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={`w-full fixed z-30 bg-black px-6 py-8 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="h-8 w-8 text-yellow-400" />
            <span className="text-3xl font-bold text-white">{brandName}</span>
          </Link>
          <div className="hidden md:flex space-x-8 items-center">
            {navigationLinks.filter((link: any) => link.isEnabled).map((link: any) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-white hover:text-yellow-400 transition"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleOpenSearch}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <Search className="h-6 w-6 text-yellow-400" />
            </button>
            <button onClick={toggleCart} className="relative text-white hover:text-yellow-300 transition">
              <ShoppingCart className="w-6 h-6 text-yellow-400" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(true)}>
            <MenuIcon className="w-8 h-8" />
          </button>
        </div>
      </nav>
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => dispatch({ type: 'search/closeSearchModal' })} 
      />
    </>
  );
}
