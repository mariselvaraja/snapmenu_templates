import React from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../common/redux/hooks';
import { toggleDrawer } from '../../../../common/redux/slices/inDiningCartSlice';

interface NavbarProps {
  brand: any;
  tableName: string;
  cartItems: any[];
  onLogoClick: () => void;
  onBackClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  brand,
  tableName,
  cartItems,
  onLogoClick,
  onBackClick
}) => {
  const dispatch = useDispatch();
  const params = useParams<{ restaurantId: string; franchiseId: string; tableId: string }>();
  
  // Get franchise ID from params or sessionStorage
  const franchiseId = params.franchiseId || sessionStorage.getItem('franchise_id');
  
  // Access restaurant state from Redux
  const { info: restaurantInfo, loading: restaurantLoading, error: restaurantError } = useAppSelector(
    (state) => state.restaurant
  );
  
  // Find the specific restaurant by franchise ID
  // Assuming restaurantInfo could be a single restaurant or an array
  const currentRestaurant = React.useMemo(() => {
    console.log("franchiseId", franchiseId, restaurantInfo)
    
    if(!restaurantInfo) {
      return null;
    }
    console.log("restaurantInfo", restaurantInfo)
    // Check if restaurantInfo is an array
    if (Array.isArray(restaurantInfo)) {
      return restaurantInfo.find((restaurant: any) => restaurant.restaurant_id === franchiseId);
    }
    console.log("restaurantInfo", restaurantInfo)
    // If it's a single restaurant object, return it if it matches
    return (restaurantInfo as any).restaurant_id === franchiseId ? restaurantInfo : null;
  }, [restaurantInfo, franchiseId]);

  return (
    <div className="sticky top-0 z-40 bg-black bg-opacity-90 backdrop-blur-sm shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main navbar row */}
        <div className="flex justify-between items-center h-16">
          {/* Left section with restaurant info */}
          <div className="flex items-center">
            {/* Restaurant Name with Icon */}
            <div 
              className="flex items-center cursor-pointer"
            >
              {/* {currentRestaurant?.logo && (
                <img 
                  src={currentRestaurant.logo} 
                  alt={currentRestaurant.name || 'Restaurant'} 
                  className="h-12 w-auto" 
                />
              )} */}
              <div className='ml-5'>
                <h1 className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
                  {currentRestaurant?.restaurant_name || "SnapmenuAi"}
                </h1>
              </div>
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
        
        {/* Table name row */}
        <div className="pb-3 px-4 text-center">
          <p className="text-xl font-bold text-white">
            {tableName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
