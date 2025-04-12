import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { Utensils, Pizza } from 'lucide-react';
import { useAppSelector, useAppDispatch, toggleDrawer } from '../shared/redux';
import { openSearchModal, closeSearchModal } from '../shared/redux/slices/searchSlice';
import { SearchModal } from '../shared/components/search';

const UtensilsIcon = Utensils;
const PizzaIcon = Pizza;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { navigationBar } = useSiteContent();
  const { brand, navigation } = navigationBar;
  const cartItems = useAppSelector((state) => state.cart.items);
  const isSearchModalOpen = useAppSelector((state) => state.search.isModalOpen);
  const dispatch = useAppDispatch();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-black text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {brand.logo.icon === "Utensils" && <UtensilsIcon className="h-8 w-8 text-red-500" />}
              {brand.logo.icon === "Pizza" && <PizzaIcon className="h-8 w-8 text-red-500" />}
              <span className="text-2xl font-bold">{brand.logo.text}</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navigation.links.filter(link => link.isEnabled).map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="hover:text-red-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/reservation"
                className="bg-white text-red-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Book a Table
              </Link>
              <Link
                to="/order"
                className="bg-red-500 px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                Order Now
              </Link>
              <button
                onClick={() => dispatch(openSearchModal())}
                className="hover:text-red-500 transition-colors"
              >
                <Search className="h-6 w-6" />
              </button>
              <button
                onClick={() => dispatch(toggleDrawer())}
                className="relative hover:text-red-500 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-red-500 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.links.filter(link => link.isEnabled).map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="block px-3 py-2 hover:text-red-500"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/reservation"
              className="block px-3 py-2 bg-white text-red-500 text-center rounded-full mt-4 hover:bg-gray-100"
            >
              Book a Table
            </Link>
            <Link
              to="/order"
              className="block px-3 py-2 bg-red-500 text-center rounded-full mt-4 hover:bg-red-600"
            >
              Order Now
            </Link>
            <div className="flex justify-center mt-4 space-x-4">
              <button 
                onClick={() => dispatch(openSearchModal())}
                className="p-2"
              >
                <Search className="h-6 w-6" />
              </button>
              <button
                onClick={() => dispatch(toggleDrawer())}
                className="relative p-2"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => dispatch(closeSearchModal())} 
      />
    </nav>
  );
}
