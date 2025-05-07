import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Utensils, Trash2, Plus, X, Minus, Search, UtensilsCrossed, Pizza, ArrowLeft, ShoppingCart, ClipboardList, Filter, Check } from 'lucide-react';
import { FaPepperHot } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../common/store';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { addItem, removeItem, toggleDrawer } from '../../../../common/redux/slices/cartSlice';
import { setSearchQuery } from '../../../../common/redux/slices/searchSlice';
import { getInDiningOrdersRequest, placeInDiningOrderRequest } from '../../../../common/redux/slices/inDiningOrderSlice';
import SearchBarComponent from '../SearchBarComponent';
import InDiningProductDetails from './InDiningProductDetails';
import InDiningCartDrawer from './InDiningCartDrawer';
import InDiningOrders from './InDiningOrders';
import { fetchTableStatusRequest } from '@/common/redux/slices/tableStatusSlice';
import { useAppSelector } from '@/redux';

export default function InDiningOrder() {
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [showOrders, setShowOrders] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [tableName, setTableName] = useState('');
  const [showModifiersPopup, setShowModifiersPopup] = useState<boolean>(false);
  const [selectedModifierOptions, setSelectedModifierOptions] = useState<any[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<string | null>('Medium');
  const [productForModifiers, setProductForModifiers] = useState<any>(null);
  
  // Get table number from URL
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const tableStatus = useSelector((state:any)=>state.tableStatus?.tables);

  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    { navigationBar: { brand: { logo: {} }, navigation: [] } };
  const navigationBar = siteContent?.navigationBar || { brand: { logo: {} }, navigation: [] };
  const { brand } = navigationBar;

  const searchParams = new URLSearchParams(location.search);
  const tableFromQuery = searchParams.get('table');

  
  useEffect(()=>{
    let tabledata = tableStatus?.find((table:any)=>table.table_id == tableFromQuery);
      console.log("tableFromQuerys", tableFromQuery)
      sessionStorage.setItem('Tablename', tabledata?.table_name)
      setTableName(tabledata?.table_name)
  },[tableFromQuery, tableStatus])

  useEffect(() => {

    dispatch(fetchTableStatusRequest(tableFromQuery))

  }, [location]);
  
  // Fetch in-dining orders when component mounts
  useEffect(() => {
    dispatch(getInDiningOrdersRequest());
  }, [dispatch]);
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const loading = useSelector((state: RootState) => state.menu.loading);
  
  // Filter menu items by selected category and subcategory
  const filteredMenuItems = selectedCategory === 'All' 
    ? (selectedSubcategory === 'All' 
        ? menuItems 
        : menuItems.filter(item => item.level2_category === selectedSubcategory))
    : (selectedSubcategory === 'All'
        ? menuItems.filter(item => item.category === selectedCategory)
        : menuItems.filter(item => item.category === selectedCategory && item.level2_category === selectedSubcategory));
  
  // Extract unique main categories directly from menu items
  const uniqueCategories = Array.from(
    new Set(menuItems.map(item => item.category))
  ).filter(Boolean).sort();
  
  // Extract unique subcategories based on selected main category
  const uniqueSubcategories = Array.from(
    new Set(
      selectedCategory === 'All'
        ? menuItems.map(item => item.level2_category).filter((cat): cat is string => !!cat)
        : menuItems
            .filter(item => item.category === selectedCategory)
            .map(item => item.level2_category)
            .filter((cat): cat is string => !!cat)
    )
  ).sort();
  
  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  const handleProductClick = (product: any) => {
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


  const getItemPrice = (item:any)=>{
    let price = 0;
    if((item?.price) && ((item?.price != "$0")))
    {
      if(item.price.includes('$'))
      {
        return Number(item?.price.replace('$', '')).toFixed(2);
      }
      else
      {
        return item?.price.toFixed(2).toFixed(2);
      }
    }
    return price?.toFixed(2);
  }

  
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    
    // Generate a random order number
    const randomOrderNumber = Math.floor(10000 + Math.random() * 90000).toString();
    setOrderNumber(randomOrderNumber);
    
    // Show the orders view instead of the order confirmation
    setShowOrders(true);
    
    // Calculate tax amount (5% of total price)
    const taxAmount = (totalPrice * 0.05).toFixed(2);
    // Calculate grand total (total price + tax)
    const grandTotal = (totalPrice * 1.05).toFixed(2);
    
    // Transform cart items to the required format
    const orderedItems = cartItems.map(item => {
      // Extract spice level from selectedModifiers if it exists
      const spiceLevel = item.selectedModifiers?.find(mod => mod.name === "Spice Level")?.options[0]?.name || "Medium";
      const modifiers = item.selectedModifiers?.filter(mod => mod.name != "Spice Level")
      return {
        name: item.name,
        quantity: item.quantity,
        itemPrice: item.price,
        image: item.image || '',
        modifiers: modifiers || [],
        spiceLevel: spiceLevel // Include spice level explicitly
      };
    });
    
    let restaurant_id = sessionStorage.getItem("franchise_id");
    let restaurant_parent_id = sessionStorage.getItem("restaurant_id");
    
    // Use the tableNumber from component state instead of sessionStorage
    // This ensures consistency with the table number displayed in the UI
    
    // Dispatch the placeInDiningOrderRequest action
    dispatch(placeInDiningOrderRequest({
      table_id: tableFromQuery, // Use the state variable instead of sessionStorage
      restaurant_id,
      restaurant_parent_id,
      additional_details:'',
      ordered_items: orderedItems
    }));
  };

  const resetOrder = () => {
    setOrderPlaced(false);
    // Clear cart items
    cartItems.forEach(item => {
      dispatch(removeItem(item.id));
    });
  };
  
  // Handle adding item with modifiers to cart
  const handleAddToCart = () => {
    if (!productForModifiers) return;
    
    // Group selected options by modifier name
    const modifierGroups = selectedModifierOptions.reduce((groups: any, option: any) => {
      const modifierName = option.modifierName;
      if (!groups[modifierName]) {
        groups[modifierName] = {
          name: modifierName,
          options: []
        };
      }
      groups[modifierName].options.push({
        name: option.name,
        price: option.price || 0
      });
      return groups;
    }, {});
    
    const itemToAdd = {
      id: productForModifiers.id,
      name: productForModifiers.name,
      price: productForModifiers.price,
      quantity: 1,
      image: productForModifiers.image || '',
      selectedModifiers: Object.values(modifierGroups) as { 
        name: string; 
        options: { name: string; price: number; }[] 
      }[]
    };
    
    // Add spice level as a modifier if selected
    if (spiceLevel) {
      itemToAdd.selectedModifiers.push({
        name: "Spice Level",
        options: [
          {
            name: spiceLevel,
            price: 0
          }
        ]
      });
    }
    
    dispatch(addItem(itemToAdd));
    setShowModifiersPopup(false);
    setSelectedModifierOptions([]);
    setSpiceLevel(null);
    setProductForModifiers(null);
  };
  
  // Toggle option selection
  const toggleOption = (modifier: any, option: any) => {
    const optionKey = `${modifier.name}-${option.name}`;
    const optionIndex = selectedModifierOptions.findIndex(
      opt => opt.modifierName === modifier.name && opt.name === option.name
    );
    
    if (optionIndex >= 0) {
      // Remove option if already selected
      const newOptions = [...selectedModifierOptions];
      newOptions.splice(optionIndex, 1);
      setSelectedModifierOptions(newOptions);
    } else {
      // Add option if not selected
      setSelectedModifierOptions([
        ...selectedModifierOptions, 
        { 
          modifierName: modifier.name, 
          name: option.name,
          modifier_price: option.price || 0
        }
      ]);
    }
  };
  
  // Check if an option is selected
  const isOptionSelected = (modifier: any, option: any) => {
    return selectedModifierOptions.some(
      opt => opt.modifierName === modifier.name && opt.name === option.name
    );
  };
  
  // Open modifiers popup for a product
  const openModifiersPopup = (product: any) => {
    setProductForModifiers(product);
    setSelectedModifierOptions([]);
    setSpiceLevel('Medium'); // Set default spice level to Medium
    setShowModifiersPopup(true);
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

  // If search is active, render only the SearchBarComponent
  if (isSearchActive) {
    return <SearchBarComponent onClose={() => setIsSearchActive(false)} />;
  }

  return (
    <div className="pt-0 pb-8 sm:pb-20">
      {/* Navbar */}
      <div className="sticky top-0 z-40 bg-black bg-opacity-90 backdrop-blur-sm shadow-md">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Restaurant Name with Icon and Table Number */}
            <div className="flex-shrink-0 flex items-center">
              <img src={brand.logo.icon} alt={brand.logo.text || 'Restaurant'} className="h-8 w-auto" />
              <div className='ml-5'>
                <h1 className="text-xl font-bold text-white">{brand?.logo?.text}</h1>
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
                    setIsSearchActive(true);
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
              
              {/* Orders Icon with Tooltip */}
              <div className="relative group">
              <button 
                onClick={() => setShowOrders(true)}
                className="p-2 rounded-full hover:bg-black hover:bg-opacity-50"
                aria-label="Orders"
              >
                <ClipboardList className="h-6 w-6 text-red-500" />
              </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Orders
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
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
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
                            ? 'bg-red-500 text-white'
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
                              ? 'bg-red-500 text-white'
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
                            ? 'bg-red-500 text-white'
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
                              ? 'bg-red-500 text-white'
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
                            ? 'bg-red-500 text-white'
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
                              ? 'bg-red-500 text-white'
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
                            ? 'bg-red-500 text-white'
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
                              ? 'bg-red-500 text-white'
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
      
      <div className=" mt-3 mx-auto px-4 sm:px-6 lg:px-8">
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
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <UtensilsCrossed className="h-12 w-12 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Items Available</h3>
                    <p className="text-gray-600 mb-8 px-4">
                      There are no items available in the "{selectedCategory}" category at the moment.
                    </p>
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center mx-auto"
                    >
                      
                      View All Menu Items
                    </button>
                  </div>
                </div>
              ) : (
                filteredMenuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 1, y: 0 }}
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
                        className="w-full h-full bg-red-100 flex items-center justify-center cursor-pointer"
                        onClick={() => handleProductClick(item)}
                      >
                        <span className="text-4xl font-bold text-red-500">
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
                        className="text-lg sm:text-xl font-semibold cursor-pointer hover:text-red-500"
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
                      <p className="text-lg font-bold text-red-500">${item.price.toFixed(2)}</p>
                      <button 
                        onClick={() => openModifiersPopup(item)}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base"
                      >
                        Add <Plus/>
                      </button>
                    </div>
                  </div>
                </motion.div>
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
      
      {/* Modifiers Popup */}
      {showModifiersPopup && productForModifiers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Select Options for {productForModifiers.name}</h3>
              <button 
                onClick={() => setShowModifiersPopup(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Cancel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              {/* Spice Level Selection - Moved to top */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
                  <FaPepperHot className="h-5 w-5 text-red-500 mr-2" /> Spice Level
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setSpiceLevel('Mild')}
                    className={`flex items-center px-4 py-2 rounded-full border ${
                      spiceLevel === 'Mild' 
                        ? 'border-red-500 bg-red-50 text-red-500' 
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    <FaPepperHot className="h-4 w-4 mr-2 text-yellow-500" />
                    {/* Mild */}
                    {spiceLevel === 'Mild' && <Check className="h-4 w-4 ml-2" />}
                  </button>
                  <button
                    onClick={() => setSpiceLevel('Medium')}
                    className={`flex items-center px-4 py-2 rounded-full border ${
                      spiceLevel === 'Medium' 
                        ? 'border-red-500 bg-red-50 text-red-500' 
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex mr-2">
                      <FaPepperHot className="h-4 w-4 text-orange-500" />
                      <FaPepperHot className="h-4 w-4 -ml-1 text-orange-500" />
                    </div>
                    {/* Medium */}
                    {spiceLevel === 'Medium' && <Check className="h-4 w-4 ml-2" />}
                  </button>
                  <button
                    onClick={() => setSpiceLevel('Hot')}
                    className={`flex items-center px-4 py-2 rounded-full border ${
                      spiceLevel === 'Hot' 
                        ? 'border-red-500 bg-red-50 text-red-500' 
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex mr-2">
                      <FaPepperHot className="h-4 w-4 text-red-500" />
                      <FaPepperHot className="h-4 w-4 -ml-1 text-red-500" />
                      <FaPepperHot className="h-4 w-4 -ml-1 text-red-500" />
                    </div>
                    {/* Hot */}
                    {spiceLevel === 'Hot' && <Check className="h-4 w-4 ml-2" />}
                  </button>
                </div>
              </div>
              
              {/* Modifiers List */}
              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Additional Options</h4>
                
                {/* Get unique modifiers by name */}
                {(() => {
                  // Create a map to store unique modifiers by name
                  const uniqueModifiers = new Map();
                  
                  // If modifiers_list exists, add each modifier to the map with name as key
                  if (productForModifiers.modifiers_list && productForModifiers.modifiers_list.length > 0) {
                    productForModifiers.modifiers_list.forEach((modifier: any) => {
                      if (!uniqueModifiers.has(modifier.name)) {
                        uniqueModifiers.set(modifier.name, modifier);
                      }
                    });
                  }
                  
                  // Convert map values back to array
                  const modifiersArray = Array.from(uniqueModifiers.values());
                  
                  if (modifiersArray.length > 0) {
                    return modifiersArray.map((modifier: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium mb-2">{modifier.name}</h4>
                      <div className="mt-2 pl-2 space-y-2 max-h-40 overflow-y-auto pr-2">
                        {modifier.options.map((option: any, optIndex: number) => (
                          <div key={optIndex} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <button
                                onClick={() => toggleOption(modifier, option)}
                                className={`w-5 h-5 rounded-md mr-2 flex items-center justify-center ${
                                  isOptionSelected(modifier, option) 
                                    ? 'bg-red-500 text-white' 
                                    : 'border border-gray-300'
                                }`}
                              >
                                {isOptionSelected(modifier, option) && <Check className="h-3 w-3" />}
                              </button>
                              <span className="text-sm text-gray-700">{option.name}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              ${getItemPrice(option)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    ));
                  } else {
                    return (
                      <div className="text-center text-gray-500 py-4">
                        <p>No additional options available for this item</p>
                      </div>
                    );
                  }
                })()}
              </div>
              
              <div className="mt-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
    </div>
  );
}
