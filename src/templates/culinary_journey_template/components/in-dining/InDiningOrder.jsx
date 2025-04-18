import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Utensils, 
  Search, 
  ShoppingCart, 
  ClipboardList, 
  Filter, 
  ArrowLeft, 
  Plus, 
  UtensilsCrossed 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, toggleDrawer, removeItem } from '../../../../common/redux/slices/cartSlice';
import { setSearchQuery } from '../../../../common/redux/slices/searchSlice';
import InDiningProductDetails from './InDiningProductDetails';
import InDiningCartDrawer from './InDiningCartDrawer';
import InDiningOrders from './InDiningOrders';
import FilterDrawer from './FilterDrawer';
import SearchBarComponent from '../SearchBarComponent';

export default function InDiningOrder() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [tableNumber, setTableNumber] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Get table number from URL
  const location = useLocation();
  
  useEffect(() => {
    // Extract table number from URL query parameter or path parameter
    // Examples: 
    // - Query parameter: /placeindiningorder?table=12
    // - Path parameter: /placeindiningorder/12
    
    // First check for query parameter
    const searchParams = new URLSearchParams(location.search);
    const tableFromQuery = searchParams.get('table');
    
    // Then check for path parameter
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const tableFromPath = !isNaN(Number(lastSegment)) ? lastSegment : null;
    
    console.log("URL:", location.pathname + location.search);
    console.log("Search Params:", location.search);
    console.log("Table from Query:", tableFromQuery);
    console.log("Table from Path:", tableFromPath);
    
    // Use table from query parameter first, then fall back to path parameter
    if (tableFromQuery && !isNaN(Number(tableFromQuery))) {
      setTableNumber(tableFromQuery);
    } else if (tableFromPath) {
      setTableNumber(tableFromPath);
    } else {
      setTableNumber(null);
    }
  }, [location]);
  
  const cartItems = useSelector((state) => state.cart.items);
  const menuItems = useSelector((state) => state.menu.items);
  const menuCategories = useSelector((state) => state.menu.categories);
  const loading = useSelector((state) => state.menu.loading);
  
  // Filter menu items by selected category and subcategory
  const filteredMenuItems = selectedCategory === 'All' 
    ? (selectedSubcategory === 'All' 
        ? menuItems 
        : menuItems.filter(item => item.level2_category === selectedSubcategory))
    : (selectedSubcategory === 'All'
        ? menuItems.filter(item => item.category === selectedCategory)
        : menuItems.filter(item => item.category === selectedCategory && item.level2_category === selectedSubcategory));
  
  const dispatch = useDispatch();
  
  // Extract unique main categories directly from menu items
  const uniqueCategories = Array.from(
    new Set(menuItems.map(item => item.category))
  ).filter(Boolean).sort();
  
  // Extract unique subcategories based on selected main category
  const uniqueSubcategories = Array.from(
    new Set(
      selectedCategory === 'All'
        ? menuItems.map(item => item.level2_category).filter(cat => !!cat)
        : menuItems
            .filter(item => item.category === selectedCategory)
            .map(item => item.level2_category)
            .filter(cat => !!cat)
    )
  ).sort();
  
  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductDetailsOpen(true);
    
    // Check if product is in cart to set initial quantity
    const cartItem = cartItems.find(item => item.id === product.id);
    setQuantity(cartItem ? cartItem.quantity : 1);
  };
  
  const closeProductDetails = () => {
    setIsProductDetailsOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };
  
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    
    // Generate a random order number
    const randomOrderNumber = Math.floor(10000 + Math.random() * 90000).toString();
    setOrderNumber(randomOrderNumber);
    
    // Show the orders view instead of the order confirmation
    setShowOrders(true);
    
    // In a real application, you would send the order to a backend service here
    console.log('Order placed:', {
      items: cartItems,
      orderNumber: randomOrderNumber,
      timestamp: new Date().toISOString()
    });
  };

  const resetOrder = () => {
    setOrderPlaced(false);
    // Clear cart items
    cartItems.forEach(item => {
      dispatch(removeItem(item.id));
    });
  };

  // Show orders view if showOrders is true
  if (showOrders) {
    return (
      <InDiningOrders 
        onClose={() => {
          setShowOrders(false);
          // If we just placed an order, reset the cart
          if (orderNumber) {
            resetOrder();
          }
        }}
        newOrderNumber={orderNumber}
      />
    );
  }

  // If search is active, render the SearchBarComponent
  if (isSearchActive) {
    return <SearchBarComponent onClose={() => setIsSearchActive(false)} />;
  }

  return (
    <div className="pt-0 pb-8 sm:pb-20">
      {/* Navbar */}
      <div className="sticky top-0 z-40 bg-black shadow-md">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Restaurant Name with Icon and Table Number */}
            <div className="flex-shrink-0 flex items-center">
              <Utensils className="h-6 w-6 text-orange-600 mr-2" />
              <div>
                <h1 className="text-xl font-bold text-white">In-Dining Order</h1>
                <p className="text-xs text-orange-400">
                  Table Number: {tableNumber ? `#${tableNumber}` : 'No Table'}
                </p>
              </div>
            </div>
            
            {/* Icons on right */}
            <div className="flex items-center space-x-4">
              {/* Search Icon with Tooltip */}
              <div className="relative group">
                <button 
                  onClick={() => {
                    setIsSearchActive(true);
                    dispatch(setSearchQuery(''));
                  }}
                  className="p-2 rounded-full hover:bg-gray-800"
                  aria-label="Search"
                >
                  <Search className="h-6 w-6 text-orange-600" />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Search
                </div>
              </div>
              
              {/* Orders Icon with Tooltip */}
              <div className="relative group">
              <button 
                onClick={() => setShowOrders(true)}
                className="p-2 rounded-full hover:bg-gray-800"
                aria-label="Orders"
              >
                <ClipboardList className="h-6 w-6 text-orange-600" />
              </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Orders
                </div>
              </div>
              
              {/* Cart Icon with Tooltip */}
              <div className="relative group">
                <button 
                  onClick={() => dispatch(toggleDrawer())}
                  className="p-2 rounded-full hover:bg-gray-800 relative"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {cartItems.length > 0 ? `Cart (${cartItems.length})` : 'Cart'}
                </div>
              </div>
              
              {/* Filter Icon with Tooltip */}
              <div className="relative group">
                <button 
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-800"
                  aria-label="Filter"
                >
                  <Filter className="h-6 w-6 text-orange-600" />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Filter
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu Item Count and Categories */}
      <div className="sticky top-16 z-30">
        <div className="bg-white shadow-sm">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop View */}
            <div className="hidden sm:flex py-3 justify-between items-center">
              <div className="text-sm font-medium text-gray-700">
                Showing {filteredMenuItems.length} menu items
              </div>
              <div className="overflow-x-auto">
                <div className="flex space-x-2">
                  {selectedCategory === 'All' ? (
                    <>
                      {/* All Category */}
                      <button
                        key="All"
                        onClick={() => {
                          setSelectedCategory('All');
                          setSelectedSubcategory('All');
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                          selectedCategory === 'All'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        }`}
                      >
                        All
                      </button>
                      
                      {/* Main categories */}
                      {uniqueCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setSelectedSubcategory('All');
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                            selectedCategory === category
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {/* Show All Categories button */}
                      <button
                        onClick={() => {
                          setSelectedCategory('All');
                          setSelectedSubcategory('All');
                        }}
                        className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center bg-gray-300 text-gray-800 hover:bg-gray-400"
                      >
                        All
                      </button>
                      
                      {/* All Subcategories for selected category */}
                      <button
                        onClick={() => {
                          setSelectedSubcategory('All');
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                          selectedSubcategory === 'All'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        }`}
                      >
                        All {selectedCategory}
                      </button>
                      
                      {/* Subcategories for selected category */}
                      {uniqueSubcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => {
                            setSelectedSubcategory(subcategory);
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                            selectedSubcategory === subcategory
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                          }`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mobile View */}
            <div className="sm:hidden py-2">
              <div className="overflow-x-auto">
                <div className="flex space-x-2">
                  {selectedCategory === 'All' ? (
                    <>
                      {/* All Category */}
                      <button
                        key="All"
                        onClick={() => {
                          setSelectedCategory('All');
                          setSelectedSubcategory('All');
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                          selectedCategory === 'All'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        }`}
                      >
                        All
                      </button>
                      
                      {/* Main categories - show all in mobile */}
                      {uniqueCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setSelectedSubcategory('All');
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                            selectedCategory === category
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {/* Show All Categories button */}
                      <button
                        onClick={() => {
                          setSelectedCategory('All');
                          setSelectedSubcategory('All');
                        }}
                        className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center bg-gray-300 text-gray-800 hover:bg-gray-400"
                      >
                         All 
                      </button>
                      
                      {/* All Subcategories for selected category */}
                      <button
                        onClick={() => {
                          setSelectedSubcategory('All');
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                          selectedSubcategory === 'All'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        }`}
                      >
                        All {selectedCategory}
                      </button>
                      
                      {/* Subcategories for selected category */}
                      {uniqueSubcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => {
                            setSelectedSubcategory(subcategory);
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                            selectedSubcategory === subcategory
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                          }`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Menu Items */}
          <div>
            <div className="space-y-4 sm:space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading menu items...</p>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-8">
                  <p>No menu items available</p>
                </div>
              ) : filteredMenuItems.length === 0 ? (
                <div className="flex items-center justify-center h-[50vh]">
                  <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <UtensilsCrossed className="h-12 w-12 text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Items Available</h3>
                    <p className="text-gray-600 mb-8 px-4">
                      There are no items available in the "{selectedCategory}" category at the moment.
                    </p>
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="px-8 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors flex items-center mx-auto"
                    >
                      View All Menu Items
                    </button>
                  </div>
                </div>
              ) : (
                filteredMenuItems.map((item, index) => (
                <div
                  key={item.name}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-row"
                >
                  <div className="relative w-1/3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleProductClick(item)}
                      />
                    ) : (
                      <div 
                        className="w-full h-full bg-orange-100 flex items-center justify-center cursor-pointer"
                        onClick={() => handleProductClick(item)}
                      >
                        <span className="text-4xl font-bold text-orange-600">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {/* Dietary Information Badges */}
                    {item.dietary && (
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {item.dietary.isVegetarian && (
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Veg
                          </div>
                        )}
                        {item.dietary.isVegan && (
                          <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Vegan
                          </div>
                        )}
                        {item.dietary.isGlutenFree && (
                          <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            GF
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    {/* Product name with left-right alignment on mobile */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="text-lg sm:text-xl font-semibold cursor-pointer hover:text-orange-600"
                        onClick={() => handleProductClick(item)}
                      >
                        {item.name}
                      </h3>
                    </div>
                    
                    {/* Description with line clamp */}
                    <p 
                      className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 overflow-hidden cursor-pointer hover:text-gray-800"
                      onClick={() => handleProductClick(item)}
                    >
                      {item.description}
                    </p>
                    
                    {/* Price on bottom left and Add to Order on bottom right */}
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</p>
                      <button 
                        onClick={() => dispatch(addItem({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          quantity: 1,
                          image: item.image || ''
                        }))}
                        className="flex items-center gap-2 bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-orange-700 transition-colors text-sm sm:text-base"
                      >
                        Add <Plus/>
                      </button>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Component */}
      {isProductDetailsOpen && selectedProduct && (
        <InDiningProductDetails
          product={selectedProduct}
          onClose={closeProductDetails}
          menuItems={menuItems}
        />
      )}
      
      {/* Cart Drawer Component */}
      <InDiningCartDrawer onPlaceOrder={handlePlaceOrder} />
      
      {/* Filter Drawer Component */}
      <FilterDrawer 
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={(filters) => {
          console.log('Applied filters:', filters);
          setIsFilterDrawerOpen(false);
          // In a real app, you would apply these filters to the menu items
        }}
      />
    </div>
  );
}
