import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleDrawer } from '../../../../common/redux/slices/inDiningCartSlice';
import { setSearchQuery } from '../../../../common/redux/slices/searchSlice';

interface InDiningNavbarProps {
  brand: any;
  tableName: string;
  cartItemsCount: number;
  onSearchClick: () => void;
}

export default function InDiningNavbar({ brand, tableName, cartItemsCount, onSearchClick }: InDiningNavbarProps) {
  const dispatch = useDispatch();

  return (
    <div className="sticky top-0 z-40 bg-black bg-opacity-90 backdrop-blur-sm shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Restaurant Name with Icon and Table Number */}
          <div className="flex-shrink-0 flex items-center">
            <img src={brand.logo.icon} alt={brand.name || 'Restaurant'} className="h-8 w-auto" />
            <div className='ml-5'>
              <h1 className="text-xl font-bold text-white">{brand?.name}</h1>
              <p className="text-xs text-gray-300">
                Table Number: {tableName}
              </p>
            </div>
          </div>
          
          {/* Icons on right */}
          <div className="flex items-center space-x-4">
            {/* Search Icon with Tooltip */}
            <div className="relative group">
              <button 
                onClick={() => {
                  onSearchClick();
                  dispatch(setSearchQuery(''));
                }}
                className="p-2 rounded-full hover:bg-black hover:bg-opacity-50"
                aria-label="Search"
              >
                <Search className="h-6 w-6 text-red-500" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Search
              </div>
            </div>
            
            {/* Cart Icon with Tooltip */}
            <div className="relative group">
              <button 
                onClick={() => dispatch(toggleDrawer())}
                className="p-2 rounded-full hover:bg-black hover:bg-opacity-50 relative"
                aria-label="Cart"
              >
                <ShoppingCart className="h-6 w-6 text-red-500" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {cartItemsCount > 0 ? `Cart (${cartItemsCount})` : 'Cart'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
