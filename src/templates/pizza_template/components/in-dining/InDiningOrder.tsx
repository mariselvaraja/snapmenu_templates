import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Utensils, Trash2, Plus, X, Minus, Search, UtensilsCrossed, Pizza, ArrowLeft, ShoppingCart, ClipboardList, Filter, Check, ChevronRight, Wine } from 'lucide-react';
import { FaPepperHot } from "react-icons/fa";
import InDiningModifierModal from './InDiningModifierModal';
import InDiningDrinksModifierModal from './InDiningDrinksModifierModal';
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';
import { CiWheat } from 'react-icons/ci';
import { GoDotFill } from 'react-icons/go';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../common/store';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { addItem, removeItem, toggleDrawer, setTableId } from '../../../../common/redux/slices/inDiningCartSlice';
import { setSearchQuery } from '../../../../common/redux/slices/searchSlice';
import { getInDiningOrdersRequest, placeInDiningOrderRequest } from '../../../../common/redux/slices/inDiningOrderSlice';
import { setShowMenuItems, setMenuItems, setCurrentMenuType } from '../../../../common/redux/slices/menuSlice';
import SearchBarComponent from '../SearchBarComponent';
import InDiningProductDetails from './InDiningProductDetails';
import InDiningCartDrawer from './InDiningCartDrawer';
import InDiningOrders from './InDiningOrders';
import OrdersBottomBar from './OrdersBottomBar';
import { fetchTableStatusRequest } from '@/common/redux/slices/tableStatusSlice';
import { useAppSelector } from '@/redux';
import { getOrderHistoryRequest } from '@/common/redux/slices/orderHistorySlice';
import InDiningCards from './InDiningCards';

function InDiningOrder() {
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
  const [isModifierModalOpen, setIsModifierModalOpen] = useState<boolean>(false);
  const [isDrinksModifierModalOpen, setIsDrinksModifierModalOpen] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
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
  const homepage = siteContent.homepage;
  const { brand } = homepage;
  const heroData = homepage?.hero;

  // Use heroData.banners if available, otherwise use empty array
  const banners = heroData?.banners?.length > 0 ? heroData.banners : [];
  const table_name = sessionStorage.getItem('Tablename');
  const searchParams = new URLSearchParams(location.search);
  const tableFromQuery:any = searchParams.get('table');

  const orderHistoryState = useSelector((state: RootState) => state.orderHistory);
  const historyLoading = orderHistoryState.loading;
  const historyError = orderHistoryState.error;
  const orderHistory = orderHistoryState.orders;

  const cartItems = useSelector((state: RootState) => state.inDiningCart.items);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const foodItems = useSelector((state: RootState) => state.menu.foodItems);
  const drinksItems = useSelector((state: RootState) => state.menu.drinksItems);
  const loading = useSelector((state: RootState) => state.menu.loading);
  const showMenuItems = useSelector((state: RootState) => state.menu.showMenuItems);
  const currentMenuType = useSelector((state: RootState) => state.menu.currentMenuType);
  
  // Determine whether to show cards or directly show menu
  const shouldShowCards = foodItems.length > 0 && drinksItems.length > 0;
  const shouldDirectlyShowMenu = (foodItems.length > 0 && drinksItems.length === 0) || (foodItems.length === 0 && drinksItems.length > 0);

  
  useEffect(()=>{
    let tabledata = tableStatus?.find((table:any)=>table.table_id == tableFromQuery);
    if(tableFromQuery) {
      dispatch(getOrderHistoryRequest(tableFromQuery));
    }
      sessionStorage.setItem('Tablename', tabledata?.table_name)
      setTableName(tabledata?.table_name)
  },[tableFromQuery, tableStatus])


  // Transform orderHistory to match the expected Order interface
  const orders = orderHistory ? orderHistory.map((orderData:any) => {
    const order = orderData as any;
    
    // Check if the order has ordered_items (from the sample data structure)
    const items = order.ordered_items 
      ? order.ordered_items.map((item:any) => ({
          name: item.name,
          quantity: item.quantity,
          status: item.status,
          price: item?.indining_price || item.itemPrice || 0.00 ,
          image: item.image || '',
          modifiers: item.modifiers || [],
          spiceLevel: item.spiceLevel || null
        }))
      : order.items || []; // Fallback to order.items if ordered_items doesn't exist

      
    
    return {
      id: order.id || (order.dining_id ? order.dining_id.toString() : '') || '',
      date: order.createdAt || order.created_date || new Date().toISOString(),
      status: order.status || order.dining_status || 'pending',
      total: order.totalAmount || (order.total_amount ? parseFloat(order.total_amount) : 0) || 0,
      items: items
    };
  }) : [];


  useEffect(() => {
    dispatch(fetchTableStatusRequest(tableFromQuery))
  }, [location]);
  
  // Auto-rotate carousel
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => 
          (prevIndex + 1) % banners.length
        );
      }, 5000); // Change slide every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [banners.length]);
  
  // Fetch in-dining orders when component mounts
  useEffect(() => {
    dispatch(getInDiningOrdersRequest());
  }, [dispatch]);

  // Set menu type based on available data when page loads
  useEffect(() => {
    if (!loading && (foodItems.length > 0 || drinksItems.length > 0)) {
      // Determine menu type based on available data
      if (foodItems.length > 0 && drinksItems.length === 0) {
        // Only food menu has data
        dispatch(setCurrentMenuType('food'));
      } else if (drinksItems.length > 0 && foodItems.length === 0) {
        // Only drinks menu has data
        dispatch(setCurrentMenuType('drinks'));
      } else if (foodItems.length > 0 && drinksItems.length > 0) {
        // Both have data - set to cards if not already set
        if (!currentMenuType) {
          dispatch(setCurrentMenuType('cards'));
        }
      }
    }
  }, [loading, foodItems, drinksItems]);

  // Auto-show menu if only one type has data OR restore from session storage
  useEffect(() => {
    if (!loading) {
      switch (currentMenuType) {
        case 'food':
          if (foodItems.length > 0) {
            dispatch(setShowMenuItems(true));
            dispatch(setMenuItems(foodItems));
            dispatch(setCurrentMenuType('food'));
          }
          break;
        case 'drinks':
          if (drinksItems.length > 0) {
            dispatch(setShowMenuItems(true));
            dispatch(setMenuItems(drinksItems));
            dispatch(setCurrentMenuType('drinks'));
          }
          break;
        default:
          break;
      }

      if (!showMenuItems && shouldDirectlyShowMenu) {
        dispatch(setShowMenuItems(true));
        if (foodItems.length > 0 && drinksItems.length === 0) {
          dispatch(setMenuItems(foodItems));
        } else if (drinksItems.length > 0 && foodItems.length === 0) {
          dispatch(setMenuItems(drinksItems));
        }
      }
    }
  }, [loading, currentMenuType, foodItems, drinksItems]);

  
  // Filter menu items by selected category and subcategory
  const filteredMenuItems = (() => {
    if (currentMenuType === "drinks") {
      // For drinks menu, filter by type and sub_type
      return selectedCategory === 'All' 
        ? (selectedSubcategory === 'All' ? menuItems : menuItems.filter(item => item.sub_type === selectedSubcategory))
        : (selectedSubcategory === 'All' ? menuItems.filter(item => item.type === selectedCategory) : menuItems.filter(item => item.type === selectedCategory && item.sub_type === selectedSubcategory));
    } else {
      // For food menu, filter by category and level2_category (existing logic)
      return selectedCategory === 'All'
        ? (selectedSubcategory === 'All' ? menuItems : menuItems.filter(item => item.level2_category === selectedSubcategory))
        : (selectedSubcategory === 'All' ? menuItems.filter(item => item.category === selectedCategory) : menuItems.filter(item => item.category === selectedCategory && item.level2_category === selectedSubcategory));
    }
  })();


  // Extract unique main categories directly from menu items
  const uniqueCategories = Array.from(
    new Set(
      currentMenuType === "drinks" 
        ? menuItems.map(item => item.type).filter(Boolean)
        : menuItems.map(item => item.category).filter(Boolean)
    )
  ).sort();
  
  // Extract unique subcategories based on selected main category
  const uniqueSubcategories = Array.from(
    new Set(
      currentMenuType === "drinks"
        ? (selectedCategory === 'All'
            ? menuItems.map(item => item.sub_type).filter((cat): cat is string => !!cat)
            : menuItems
                .filter(item => item.type === selectedCategory)
                .map(item => item.sub_type)
                .filter((cat): cat is string => !!cat))
        : (selectedCategory === 'All'
            ? menuItems.map(item => item.level2_category).filter((cat): cat is string => !!cat)
            : menuItems
                .filter(item => item.category === selectedCategory)
                .map(item => item.level2_category)
                .filter((cat): cat is string => !!cat))
    )
  ).sort();
  

  // Helper function to check if spice level should be shown based on is_spice_applicable
  const shouldShowSpiceLevel = (product: any) => {
    // Check if product has is_spice_applicable field and it's "yes"
    if (product?.is_spice_applicable?.toLowerCase() === 'yes') {
      return true;
    }
    // Also check in raw_api_data if it exists
    if (product?.raw_api_data) {
      try {
        const rawData = typeof product.raw_api_data === 'string' 
          ? JSON.parse(product.raw_api_data) 
          : product.raw_api_data;
        if (rawData?.is_spice_applicable?.toLowerCase() === 'yes') {
          return true;
        }
      } catch (e) {
        // If parsing fails, continue with other checks
      }
    }
    return false;
  };

  // Helper function to check if product has any modifiers
  const hasModifiers = (product: any) => {
    return product?.modifiers_list && product.modifiers_list.length > 0;
  };

  // Helper function to check if product needs customization (has modifiers or spice level)
  const needsCustomization = (product: any) => {
    return hasModifiers(product) || shouldShowSpiceLevel(product);
  };

  // Helper function to check if drinks product needs customization (has multiple price options)
  const needsDrinksCustomization = (product: any) => {
    return product?.prices && Array.isArray(product.prices) && product.prices.length > 1;
  };

  // Add item directly to cart without opening modifier modal
  const addDirectlyToCart = (product: any) => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product?.indining_price || 0,
      image: product.image || '',
      quantity: 1,
      selectedModifiers: []
    };

    dispatch(addItem(cartItem));
    dispatch(toggleDrawer(true));
  };

  const handleProductClick = (product: any) => {
    console.log("dproduct")
    setSelectedProduct(product);
    setIsProductDetailsOpen(true);
    
    // Check if product is in cart to set initial quantity
    const cartItem = cartItems.find((item:any) => item.id === product.id);
    setQuantity(cartItem ? cartItem.quantity : 1);
  };

  const handleDrinksProduct = (product: any) => {
    setSelectedProduct(product);
    setIsProductDetailsOpen(true);
    
    // Check if product is in cart to set initial quantity
    const cartItem = cartItems.find((item:any) => item.id === product.id);
    setQuantity(cartItem ? cartItem.quantity : 1);
  };
  
  const closeProductDetails = () => {
    setIsProductDetailsOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };
  
  const handlePlaceOrder = (specialRequest: string = '') => {
    if (cartItems.length === 0) return;
    
    // Generate a random order number
    const randomOrderNumber = Math.floor(10000 + Math.random() * 90000).toString();
    setOrderNumber(randomOrderNumber);
    
    // Show the orders view instead of the order confirmation
    setShowOrders(true);
    
    // Transform cart items to the required format
    const orderedItems = cartItems.map((item:any) => {
      // Extract spice level from selectedModifiers if it exists
      const spiceLevel = item.selectedModifiers?.find((mod:any) => mod.name === "Spice Level")?.options[0]?.name || "";
      let modifiers = item.selectedModifiers?.filter((mod:any) => mod.name != "Spice Level");
      let options = modifiers.flatMap((mod:any)=>mod.options);
      modifiers = options.map((option:any)=>({
        modifier_name : option.name,
        modifier_price : option.price
      }))
      console.log("Modifiers",spiceLevel, modifiers)
      return {
        name: item.name,
        quantity: item.quantity,
        itemPrice: item?.indining_price || item.price || 0,
        image: item.image || '',
        table_name,
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
      special_requests: specialRequest,
      ordered_items: orderedItems
    }));
  };

  const resetOrder = () => {
    setOrderPlaced(false);
    // Clear cart items
    cartItems.forEach((item:any) => {
      dispatch(removeItem(item.id));
    });
  };
  
  
  // Smart function to handle add to order - opens modal only if customization is needed
  const openModifiersPopup = (product: any) => {
    if (needsCustomization(product)) {
      // Open modifier modal if product has modifiers or spice level
      setSelectedMenuItem(product);
      setIsModifierModalOpen(true);
    } else {
      // Add directly to cart if no customization needed
      addDirectlyToCart(product);
    }
  };
  // Special function for drinks menu - opens modal with ML options as radio buttons or adds directly to cart
  const openDrinksModifierPopup = (product: any) => {
    // Check if drinks item needs customization (multiple price options)
    // if (needsDrinksCustomization(product)) {
      setSelectedMenuItem(product);
      setIsDrinksModifierModalOpen(true);
    // } else {
      // Add directly to cart if only one price option or no prices array
      // addDirectlyToCart(product);
    // }
  };

  // Handlers for InDiningCards - use stored data and set menu type
  const handleFoodMenuClick = () => {
    dispatch(setShowMenuItems(true));
    dispatch(setMenuItems(foodItems)); // Use stored food items
    dispatch(setCurrentMenuType('food')); // Set current menu type
    setSelectedCategory('All');
    setSelectedSubcategory('All');
  };

  const handleDrinksMenuClick = () => {
    dispatch(setShowMenuItems(true));
    dispatch(setMenuItems(drinksItems)); // Use stored drinks items
    dispatch(setCurrentMenuType('drinks')); // Set current menu type
    setSelectedCategory('All');
    setSelectedSubcategory('All');
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
    return <SearchBarComponent onClose={() => setIsSearchActive(false)} onPlaceOrder={handlePlaceOrder} />;
  }

  return (
    <div className="pt-0 pb-20 sm:pb-24">
      {/* Navbar */}
      <div className="sticky top-0 z-40 bg-black bg-opacity-90 backdrop-blur-sm shadow-md">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
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
                      {cartItems.reduce((total:any, item:any) => total + item.quantity, 0)}
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
      
      {/* Hero Banner Section with Carousel - Only render if banners exist */}
      {banners && banners.length > 0 && (
        <section className="relative h-64 sm:h-80 flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {banners.map((banner: { image: string }, index: number) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === currentBannerIndex ? 1 : 0,
                  zIndex: index === currentBannerIndex ? 1 : 0
                }}
                transition={{ duration: 0.8 }}
                style={{
                  backgroundImage: `url('${banner.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
            <motion.div
              key={currentBannerIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {banners[currentBannerIndex]?.title || 'Welcome to Our Restaurant'}
              </h1>
              <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                {banners[currentBannerIndex]?.subtitle || 'Discover our delicious menu'}
              </p>
            </motion.div>
            
            {/* Carousel indicators */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentBannerIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Show InDiningCards if both menus have data */}
      {!showMenuItems && shouldShowCards && (
        <InDiningCards 
          onFoodMenuClick={handleFoodMenuClick}
          onDrinksMenuClick={handleDrinksMenuClick}
        />
      )}
      
      {/* Show empty state if both menus are empty */}
      {!loading && !showMenuItems && foodItems.length === 0 && drinksItems.length === 0 && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md px-4">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="h-12 w-12 text-red-400" style={{ color: '#ef4421' }} />
            </div>
            <h3 className="text-xl font-semibold text-black-800 mb-3">No Menu Available</h3>
            <p className="text-black-600 mb-8 text-sm">
              We're currently updating our menu. Please check back later or contact our staff for assistance.
            </p>
          </div>
        </div>
      )}
      
      {/* Menu Item Count and Categories - Only show when menu items should be displayed */}
      {showMenuItems && (
      <>
      <div className="sticky top-16 z-30">
        <div className="bg-white shadow-sm">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop View */}
            <div className="hidden sm:flex py-3 justify-between items-center pt-5">
                <div className="flex items-center gap-4">
                  {shouldShowCards &&
                    <button
                      onClick={() => dispatch(setShowMenuItems(false))}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-black-700 text-sm font-medium transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Menu
                    </button>
                   }
                  <div className="text-sm font-medium text-gray-700">
                    Showing {filteredMenuItems.length} menu items
                  </div>
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
                            setSelectedCategory(category || '');
                            setSelectedSubcategory('All');
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
                            selectedCategory === category
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                          }`}
                        >
                          {category}
                          <ChevronRight className="h-3 w-3" />
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
                            setSelectedSubcategory(subcategory || '');
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
              {shouldShowCards &&
                <div className="my-6">
                  <button
                    onClick={() => dispatch(setShowMenuItems(false))}
                    className="flex items-center gap-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-black-700 text-sm font-medium transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Menu
                  </button>
                </div>
              }
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
                            sessionStorage.setItem('selectedCategory', 'All');
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
                            selectedCategory === category
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                          }`}
                        >
                          {category}
                          <ChevronRight className="h-3 w-3" />
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
          {currentMenuType === "food" &&
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
                          className="h-[200px] w-full object-cover cursor-pointer"
                          onClick={() => handleProductClick(item)}
                        />
                      ) : (
                        <div 
                          className="w-full bg-red-100 flex items-center justify-center cursor-pointer h-[200px]"
                          onClick={() => handleProductClick(item)}
                        >
                          <span className="text-4xl font-bold text-red-500">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      {/* Dietary Information Icons */}
                      {item.dietary && (
                        <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
                          {item.dietary.isVegetarian && (
                            <div className="bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center">
                              <IoLeafOutline className="w-4 h-4" />
                            </div>
                          )}
                          {item.dietary.isVegan && (
                            <div className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center">
                              <LuVegan className="w-4 h-4" />
                            </div>
                          )}
                          {item.dietary.isGlutenFree && (
                            <div className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center">
                              <CiWheat className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                      {/* Product name with left-right alignment on mobile */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {item.dietary && (item.dietary.isVegetarian || item.dietary.isVegan) ? (
                              <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-green-600 flex-shrink-0">
                              <GoDotFill className="w-2 h-2 text-green-600" />
                            </div>
                          ) : (
                            <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-red-600 flex-shrink-0">
                              <GoDotFill className="w-2 h-2 text-red-600" />
                            </div>
                          )}
                          <h3 
                            className="text-lg sm:text-xl font-semibold cursor-pointer hover:text-red-500"
                            onClick={() => handleProductClick(item)}
                          >
                            {item.name}
                          </h3>
                        </div>
                      </div>
                      
                      
                      {/* Description with line clamp */}
                      <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 overflow-hidden cursor-pointer hover:text-gray-800"
                        onClick={() => handleProductClick(item)}
                      >
                        {item.description}
                      </p>
                      
                      {/* Price on bottom left and Add to Order/Out of Stock on bottom right */}
                      <div className="flex justify-between items-center mt-auto">
                        {currentMenuType === "food" && (
                          <p className="text-lg font-bold text-red-500">${item?.indining_price || 0.00}</p>
                        )}
                       
                        {item?.out_of_stock == "true" ? (
                          <div className="px-4 sm:px-6 py-2 rounded-full bg-gray-200 text-gray-600 text-sm sm:text-base font-medium">
                            Out of Stock
                          </div>
                        ) : (
                          <button 
                            onClick={() => openModifiersPopup(item)}
                            className="flex items-center gap-2 bg-red-500 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base"
                          >
                            Add <Plus/>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  ))
                )}
              </div>
            </div>
          }

          {currentMenuType === "drinks" &&
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
                          className="h-[200px] w-full object-cover cursor-pointer"
                          onClick={() => handleProductClick(item)}
                        />
                      ) : (
                        <div className="w-full bg-red-100 flex items-center justify-center cursor-pointer h-[200px]"
                          onClick={() => handleProductClick(item)}
                        >
                          <span className="text-4xl font-bold text-red-500">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      {item.dietary && (
                        <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
                          {item.dietary.isVegetarian && (
                            <div className="bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center">
                              <IoLeafOutline className="w-4 h-4" />
                            </div>
                          )}
                          {item.dietary.isVegan && (
                            <div className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center">
                              <LuVegan className="w-4 h-4" />
                            </div>
                          )}
                          {item.dietary.isGlutenFree && (
                            <div className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center">
                              <CiWheat className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                      {/* Product name with left-right alignment on mobile */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 pb-2 sm:pb-0">
                          <Wine className='w-5 h-5 text-red-500' />
                          <h3 
                            className="text-sm  sm:text-xl  font-semibold cursor-pointer hover:text-red-500"
                            onClick={() => handleProductClick(item)}
                          >
                            {item.name}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Price badges for drinks menu - show all available prices */}
                      {item?.prices && Array.isArray(item.prices) && item.prices.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2">
                            {item.prices.map((priceOption, index) => (
                              <div 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-[8px] sm:text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                              >
                                <span className="font-semibold">{priceOption.name}</span>&nbsp;-
                                <span className="ml-1">${parseFloat(priceOption.price) || 0}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Price on bottom left and Add to Order/Out of Stock on bottom right */}
                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-lg font-bold text-red-500">
                          ${(() => {
                            // Check if item has prices array and use 0th index
                            if (item?.prices && Array.isArray(item.prices) && item.prices.length > 0) {
                              return parseFloat(item.prices[0].price) || 0;
                            }
                            // Fallback to other price properties
                            return parseFloat(String(item?.indining_price || item?.price || 0)) || 0;
                          })()}
                        </p>

                        {item?.out_of_stock == "true" ? (
                          <div className="px-4 sm:px-6 py-2 rounded-full bg-gray-200 text-gray-600 text-sm sm:text-base font-medium">
                            Out of Stock
                          </div>
                        ) : (
                          <button 
                            onClick={() => openDrinksModifierPopup(item)}
                            className="flex items-center gap-2 bg-red-500 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base"
                          >
                            Add <Plus className='w-5 h-5'/>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  ))
                )}
              </div>
            </div>
          }
        </div>
      </div>
      </>
      )}
      
      {/* Product Details Component */}
      {isProductDetailsOpen && selectedProduct && (
        <InDiningProductDetails
          product={selectedProduct}
          currentMenuType = {currentMenuType}
          onClose={closeProductDetails}
          menuItems={menuItems}
          onProductSelect={(product) => {
            setSelectedProduct(product);
            // Keep the product details modal open with the new product
          }}
          onViewOrders={() => setShowOrders(true)}
        />
      )}
      
      {/* Cart Drawer Component */}
      <InDiningCartDrawer onPlaceOrder={handlePlaceOrder} />
      
      {/* In-Dining Modifier Modal */}
      <InDiningModifierModal
        isOpen={isModifierModalOpen}
        onClose={(updatedItem?: any) => {
          setIsModifierModalOpen(false);
          // If an updated item is passed back, it means we're editing an existing cart item
          // For now, we'll just close the modal since we're adding new items to cart
          if (updatedItem) {
            console.log('Updated item received:', updatedItem);
          }
        }}
        menuItem={selectedMenuItem}
      />

      {/* In-Dining Drinks Modifier Modal */}
      <InDiningDrinksModifierModal
        isOpen={isDrinksModifierModalOpen}
        onClose={(updatedItem?: any) => {
          setIsDrinksModifierModalOpen(false);
          if (updatedItem) {
            console.log('Updated drinks item received:', updatedItem);
          }
        }}
        menuItem={selectedMenuItem}
      />
      
      {/* Fixed Bottom Bar - Orders */}
      {orders.length != 0 &&
        <OrdersBottomBar
          onViewOrders={() => setShowOrders(true)}
          onPlaceOrder={handlePlaceOrder}
          orders={orders}
          historyLoading={historyLoading}
          historyError={historyError}
        />}
      
    </div>
  );
}

export default InDiningOrder;
