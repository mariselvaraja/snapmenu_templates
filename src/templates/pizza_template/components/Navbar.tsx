import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, Utensils, Pizza } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../redux';
import { openSearchModal, closeSearchModal } from '../../../redux/slices/searchSlice';
import { useCart } from '../context/CartContext';
import { SearchModal } from '../../../components/search';
import { usePayment } from '@/hooks';

const UtensilsIcon = Utensils;
const PizzaIcon = Pizza;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { rawApiResponse } = useAppSelector(state => state.siteContent);

  const [isCtbiriyani, setIsCtbiriyani] = useState(false);

  const {isPaymentAvilable} = usePayment();


  useEffect(() => {
    const url = window.location.href;

    if (url) {

      setIsCtbiriyani(url.includes('ctbiryani'));
    }
    else
    {
      setIsCtbiriyani(false)
    }
  }, []);

  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    { navigationBar: { brand: { logo: {} }, navigation: [] } };
  const navigationBar = siteContent;
  const { brand } = siteContent.homepage  || { brand: { logo: {} }, navigation: [] };
  
  // Handle both navigation formats: navigation: [] or navigation: { links: [] }
  // Ensure navigationLinks is always an array
  let navigationLinks = [];
  
  if (Array.isArray(navigationBar.navigation)) {
    navigationLinks = navigationBar.navigation;
  } else if (navigationBar.navigation && Array.isArray(navigationBar.navigation.links)) {
    navigationLinks = navigationBar.navigation.links;
  }
  
  const { state: { items: cartItems }, toggleDrawer } = useCart();
  const isSearchModalOpen = useAppSelector((state) => state.search.isModalOpen);
  const dispatch = useAppDispatch();
  const cartItemCount = cartItems.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);

  return (
    <nav className="bg-black text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center">
                {brand?.logo?.icon ? (
                  <img src={brand.logo.icon} alt={brand.logo.text || 'Restaurant'} className="h-8 w-auto" />
                ) : (
                  <UtensilsIcon className="h-8 w-8 text-red-500" />
                )}
              </div>
              <span className="text-2xl font-bold ml-8">{brand?.logo?.text || 'Restaurant'}</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navigationLinks.filter((link: any) => link && link.isEnabled).map((link: any, index: number) => (
                <Link
                  key={index}
                  to={link.path}
                  className="hover:text-red-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={() => dispatch(openSearchModal())}
                className="hover:text-red-500 transition-colors"
              >
                <Search className="h-6 w-6" />
              </button>
              
            { isCtbiriyani &&  <a
              href="https://ctbiryani.square.site/"
              className="block px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-center mx-3 mt-2"
            >
              Order Online
            </a>}
        {  isPaymentAvilable &&    <button
                onClick={() => toggleDrawer()}
                className="relative hover:text-red-500 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
               { cartItemCount!=0 &&<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>}
              </button>}
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
            {navigationLinks.filter((link: any) => link && link.isEnabled).map((link: any, index: number) => (
              <Link
                key={index}
                to={link.path}
                className="block px-3 py-2 hover:text-red-500"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
         { isCtbiriyani &&  <a
              href="https://ctbiryani.square.site/"
              className="block px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-center mx-3 mt-2"
            >
              Order Online
            </a>}
            <div className="flex justify-center mt-4 space-x-4">
              <button 
                onClick={() => dispatch(openSearchModal())}
                className="p-2"
              >
                <Search className="h-6 w-6" />
              </button>
            { isPaymentAvilable && <button
                onClick={() => toggleDrawer()}
                className="relative p-2"
              >
                <ShoppingCart className="h-6 w-6" />
              { cartItemCount!=0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>}
              </button>}
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
