import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';
import { Utensils, Pizza } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleCartDrawer } from '../cartSlice';
import SearchModal from './SearchModal';

const UtensilsIcon = Utensils;
const PizzaIcon = Pizza;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { siteContent } = useRootSiteContent();
  const brand = (siteContent as any)?.navigationBar?.brand || (siteContent as any)?.brand || { logo: { icon: "Pizza", text: "Pizza Restaurant" } };
  const navigation = (siteContent as any)?.navigationBar?.navigation || (siteContent as any)?.navigation || { links: [] };
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleCartDrawer());
  };

  return (
    <>
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
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:text-red-500 transition-colors"
                  aria-label="Search menu"
                >
                  <Search className="h-6 w-6" />
                </button>
                <button
                  onClick={handleCartClick}
                  className="relative hover:text-red-500 transition-colors"
                  aria-label="Open cart"
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
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleCartClick}
                  className="relative p-2"
                  aria-label="Open cart"
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
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
