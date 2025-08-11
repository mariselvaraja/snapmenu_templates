import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleDrawer } from '../../../../common/redux/slices/inDiningCartSlice';

interface NavbarProps {
  brand: any;
  tableName: string;
  cartItems: any[];
  onLogoClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  brand,
  tableName,
  cartItems,
  onLogoClick
}) => {
  const dispatch = useDispatch();

  return (
    <div className="sticky top-0 z-40 bg-black bg-opacity-90 backdrop-blur-sm shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Restaurant Name with Icon and Table Number */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={onLogoClick}
          >
            <img src={brand.logo.icon} alt={brand.name || 'Restaurant'} className="h-8 w-auto" />
            <div className='ml-5'>
              <h1 className="text-xl font-bold text-white hover:text-gray-200 transition-colors">{brand?.name}</h1>
              <p className="text-xs text-gray-300">
                Table Number: {tableName}
              </p>
            </div>
          </div>
          
          {/* Cart Icon */}
          <div className="flex items-center">
            <div className="relative group">
              <button 
                onClick={() => dispatch(toggleDrawer())}
                className="p-2 rounded-full hover:bg-black hover:bg-opacity-50 relative"
                aria-label="Cart"
              >
                <ShoppingCart className="h-6 w-6 text-red-500" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((total: any, item: any) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {cartItems.length > 0 ? `Cart (${cartItems.length})` : 'Cart'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
