import { motion } from 'framer-motion';
import  { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { LuVegan } from 'react-icons/lu';
import { RootState, AppDispatch } from '../../../../common/store';
import { addItem, removeItem, toggleDrawer } from '../../../../common/redux/slices/inDiningCartSlice';
import { setSearchQuery as setReduxSearchQuery } from '../../../../common/redux/slices/searchSlice';
import { placeInDiningOrderRequest } from '../../../../common/redux/slices/inDiningOrderSlice';
import { setShowMenuItems, setMenuItems, setCurrentMenuType } from '../../../../common/redux/slices/menuSlice';
import { getFestivalMenuRequest } from '../../../../common/redux/slices/festivalMenuSlice';
import { useAppSelector } from '../../../../redux';
import { usePayment } from '../../../../hooks';
import SearchBarComponent from '../SearchBarComponent';
import OrderListener from '../../../../components/orderListener';
import InDiningProductDetails from '../in-dining/InDiningProductDetails';
import QuickMenuCartDrawer from './QuickMenuCartDrawer';
import InDiningOrders from '../in-dining/InDiningOrders';
import CategoryGrid from '../in-dining/CategoryGrid';
import SearchBar from '../in-dining/SearchBar';
import MenuTypeSelector from '../in-dining/MenuTypeSelector';
import InDiningModifierModal from '../in-dining/InDiningModifierModal';
import InDiningDrinksModifierModal from '../in-dining/InDiningDrinksModifierModal';
import Navbar from '../in-dining/Navbar';
import FoodMenuItem from '../in-dining/FoodMenuItem';
import DrinksMenuItem from '../in-dining/DrinksMenuItem';
import EmptyState from '../in-dining/EmptyState';
import HeroBanner from '../in-dining/HeroBanner';
import InDiningCards from '../in-dining/InDiningCards';
import PaymentStatusHandler from '../PaymentStatusHandler';

function FestivalMenu() {
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
  const [tableName, setTableName] = useState('Quick Menu');
  const [isModifierModalOpen, setIsModifierModalOpen] = useState<boolean>(false);
  const [isDrinksModifierModalOpen, setIsDrinksModifierModalOpen] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVegan, setisVegan] = useState<boolean>(false);
  const [isVeg, setisVeg] = useState<boolean>(false);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState<boolean>(false);
  
  // Helper function to filter items based on vegan/vegetarian selection
  const getFilteredItems = (items: any[], menuType: string) => {
    // Only apply dietary filters for food menu, not drinks menu
    if (menuType === 'drinks' || (!isVegan && !isVeg)) {
      // No filters selected or drinks menu, return all items
      return items;
    }
    
    return items.filter(item => {
      const foodType = item.food_type?.toLowerCase();
      const isVeganItem = item.is_vegan?.toLowerCase() === 'yes';
      
      if (isVegan && isVeg) {
        return isVeganItem || foodType === 'veg' || foodType === 'vegan';
      } else if (isVegan) {
        return isVeganItem;
      } else if (isVeg) {
        return foodType === 'veg' || foodType === 'vegan' || isVeganItem;
      }
      
      return true;
    });
  };

  // Helper function to get categories with first item image
  const getCategoriesWithImages = (items: any[], menuType: string) => {
    // First filter items based on vegan/vegetarian selection (only for food menu)
    const filteredItems = getFilteredItems(items, menuType);
    
    const categoryMap = new Map();
    
    filteredItems.forEach(item => {
      const categoryName = menuType === 'drinks' ? item.type : item.category;
      if (categoryName && !categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          name: categoryName,
          image: item.image || '',
          itemCount: 1
        });
      } else if (categoryName && categoryMap.has(categoryName)) {
        const cat = categoryMap.get(categoryName);
        cat.itemCount++;
        // Use first available image
        if (!cat.image && item.image) {
          cat.image = item.image;
        }
      }
    });
    
    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };
  
  // Get restaurant and franchise IDs from URL path parameters (no table for festival menu)
  const location = useLocation();
  const params = useParams<{ restaurantId: string; franchiseId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    { navigationBar: { brand: { logo: {} }, navigation: [] } };
  const navigationBar = siteContent?.navigationBar || { brand: { logo: {} }, navigation: [] };
  
  const brand = "SnapMenuAi";
  
  
  // Use heroData.banners if available, otherwise use empty array
  const banners:any = [];
  
  // Extract restaurant and franchise IDs from params
  const restaurantId = params.restaurantId;
  const franchiseId = params.franchiseId;


  const cartItems = useSelector((state: RootState) => state.inDiningCart.items);
  // Use festival menu state instead of regular menu state
  const menuItems = useSelector((state: RootState) => state.festivalMenu.items);
  const foodItems = useSelector((state: RootState) => state.festivalMenu.foodItems);
  const drinksItems = useSelector((state: RootState) => state.festivalMenu.drinksItems);
  const loading = useSelector((state: RootState) => state.festivalMenu.loading);
  const showMenuItems = useSelector((state: RootState) => state.menu.showMenuItems);
  const currentMenuType = useSelector((state: RootState) => state.menu.currentMenuType);

  console.log("foodItems", foodItems)
  
  // Use payment hook for payment availability check (same logic as regular menu)
  const { isPaymentAvilable } = usePayment();
  
  // Determine whether to show cards or directly show menu
  const shouldShowCards = foodItems.length > 0 && drinksItems.length > 0;
  const shouldDirectlyShowMenu = (foodItems.length > 0 && drinksItems.length === 0) || (foodItems.length === 0 && drinksItems.length > 0);

  
  useEffect(() => {
    // Store restaurant and franchise IDs in sessionStorage
    if (restaurantId) {
      sessionStorage.setItem('restaurant_id', restaurantId);
    }
    if (franchiseId) {
      sessionStorage.setItem('franchise_id', franchiseId);
    }
    // Set display name for festival menu
    setTableName('Quick Menu');
  }, [restaurantId, franchiseId])

  // Fetch festival menu when component mounts
  useEffect(() => {
    // Fetch festival menu from /getSiteContentJson?folder_path=festival
    dispatch(getFestivalMenuRequest());
    
    // Clear any existing search query from Redux when component mounts
    dispatch(setReduxSearchQuery(''));
    
    // Reset menu state to show cards view on page load/refresh
    dispatch(setShowMenuItems(false));
    dispatch(setCurrentMenuType(null));
    setShowCategories(false);
    setSelectedCategory('All');
    setSelectedSubcategory('All');
  }, [dispatch]);

  // Payment completed event is now handled by OrderListener component
  // No need for additional WebSocket event listeners here

  // Set menu type based on available data when page loads
  useEffect(() => {
    if (!loading && (foodItems.length > 0 || drinksItems.length > 0)) {
      // Only auto-show menu if there's only one type available
      if (foodItems.length > 0 && drinksItems.length === 0) {
        // Only food menu has data
        dispatch(setCurrentMenuType('food'));
        setShowCategories(true);
        dispatch(setShowMenuItems(false));
      } else if (drinksItems.length > 0 && foodItems.length === 0) {
        // Only drinks menu has data
        dispatch(setCurrentMenuType('drinks'));
        setShowCategories(true);
        dispatch(setShowMenuItems(false));
      }
      // If both menus have data, show cards view first
    }
  }, [loading, foodItems, drinksItems, dispatch]);

  
  // Filter menu items by selected category and subcategory
  const filteredMenuItems = (() => {
    // Use the filtered local state items instead of Redux menuItems
    const itemsToFilter = currentMenuType === "drinks" ? drinksItems : foodItems;
    
    if (currentMenuType === "drinks") {
      // For drinks menu, filter by type and sub_type
      return selectedCategory === 'All' 
        ? (selectedSubcategory === 'All' ? itemsToFilter : itemsToFilter.filter(item => item.sub_type === selectedSubcategory))
        : (selectedSubcategory === 'All' ? itemsToFilter.filter(item => item.type === selectedCategory) : itemsToFilter.filter(item => item.type === selectedCategory && item.sub_type === selectedSubcategory));
    } else {
      // For food menu, filter by category and level2_category (existing logic)
      return selectedCategory === 'All'
        ? (selectedSubcategory === 'All' ? itemsToFilter : itemsToFilter.filter(item => item.level2_category === selectedSubcategory))
        : (selectedSubcategory === 'All' ? itemsToFilter.filter(item => item.category === selectedCategory) : itemsToFilter.filter(item => item.category === selectedCategory && item.level2_category === selectedSubcategory));
    }
  })();


  // Extract unique main categories directly from menu items
  // Use the filtered local state items instead of Redux menuItems
  const itemsForCategories = currentMenuType === "drinks" ? drinksItems : foodItems;
  
  const uniqueCategories = Array.from(
    new Set(
      currentMenuType === "drinks" 
        ? itemsForCategories.map(item => item.type).filter(Boolean)
        : itemsForCategories.map(item => item.category).filter(Boolean)
    )
  ).sort();
  
  // Extract unique subcategories based on selected main category
  const uniqueSubcategories = Array.from(
    new Set(
      currentMenuType === "drinks"
        ? (selectedCategory === 'All'
            ? itemsForCategories.map(item => item.sub_type).filter((cat): cat is string => !!cat)
            : itemsForCategories
                .filter(item => item.type === selectedCategory)
                .map(item => item.sub_type)
                .filter((cat): cat is string => !!cat))
        : (selectedCategory === 'All'
            ? itemsForCategories.map(item => item.level2_category).filter((cat): cat is string => !!cat)
            : itemsForCategories
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
        table_name: tableName, // Use tableName state which is 'Festival Menu'
        modifiers: modifiers || [],
        spiceLevel: spiceLevel // Include spice level explicitly
      };
    });
    
    let restaurant_id = sessionStorage.getItem("franchise_id");
    let restaurant_parent_id = sessionStorage.getItem("restaurant_id");
    
    // Use the tableNumber from component state instead of sessionStorage
    // This ensures consistency with the table number displayed in the UI
    
    // Dispatch the placeInDiningOrderRequest action for festival menu (no table)
    dispatch(placeInDiningOrderRequest({
      table_id: '', // No table for festival menu
      restaurant_id,
      restaurant_parent_id,
      order_type: 'in-dining', // Set order type to in-dining, not website
      additional_details: 'Festival Menu Order',
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

  // Handlers for InDiningCards - show categories first
  const handleFoodMenuClick = () => {
    dispatch(setCurrentMenuType('food')); // Set current menu type
    setShowCategories(true); // Show categories
    dispatch(setShowMenuItems(false)); // Don't show menu items yet
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSearchQuery(''); // Clear search when selecting menu type
  };

  const handleDrinksMenuClick = () => {
    dispatch(setCurrentMenuType('drinks')); // Set current menu type
    setShowCategories(true); // Show categories
    dispatch(setShowMenuItems(false)); // Don't show menu items yet
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSearchQuery(''); // Clear search when selecting menu type
  };

  // Handler for category selection
  const handleCategoryClick = (categoryName: string) => {
    const items = currentMenuType === 'food' ? foodItems : drinksItems;
    // First apply vegan/vegetarian filtering (only for food menu)
    const dietFilteredItems = getFilteredItems(items, currentMenuType || 'food');
    // Then filter by category
    const filteredItems = dietFilteredItems.filter(item => 
      currentMenuType === 'drinks' ? item.type === categoryName : item.category === categoryName
    );
    
    dispatch(setMenuItems(filteredItems));
    dispatch(setShowMenuItems(true));
    setShowCategories(false);
    setSelectedCategory(categoryName);
    setSearchQuery(''); // Clear search when selecting a category
  };

  // Show orders view if showOrders is true
  if (showOrders) {
    return (
      <InDiningOrders 
        onClose={(autoSelectFood?: boolean) => {
          setShowOrders(false);
          // If we just placed an order, reset the cart
          if (orderNumber) {
            resetOrder();
            setOrderNumber(''); // Clear order number
          }
          
          // Check if auto-select food menu is requested
          if (autoSelectFood && foodItems.length > 0) {
            // Auto-select food menu
            dispatch(setCurrentMenuType('food'));
            setShowCategories(true);
            dispatch(setShowMenuItems(false));
            setSelectedCategory('All');
            setSelectedSubcategory('All');
            setSearchQuery('');
            return;
          }
          
          // When coming back from orders, check if a menu type was previously selected
          if (currentMenuType) {
            // If a menu type was selected (food or drinks), go back to that category view
            setShowCategories(true);
            dispatch(setShowMenuItems(false));
            // Keep the currentMenuType as it is (don't reset it)
          } else {
            // If no menu type was selected, show appropriate view based on available menus
            if (shouldShowCards) {
              // If both menus exist, show the cards view
              setShowCategories(false);
              dispatch(setCurrentMenuType(null));
            } else if (foodItems.length > 0 && drinksItems.length === 0) {
              // If only food menu exists, show food categories
              dispatch(setCurrentMenuType('food'));
              setShowCategories(true);
            } else if (drinksItems.length > 0 && foodItems.length === 0) {
              // If only drinks menu exists, show drinks categories
              dispatch(setCurrentMenuType('drinks'));
              setShowCategories(true);
            }
          }
          
          // Reset only the selection states, not the menu type
          dispatch(setShowMenuItems(false));
          setSelectedCategory('All');
          setSelectedSubcategory('All');
          setSearchQuery(''); // Clear search when coming back from orders
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
      {/* OrderListener Component for WebSocket handling */}
      <OrderListener />
      
      {/* Navbar */}
      <Navbar
        brand={brand}
        tableName={tableName}
        cartItems={cartItems}
        onLogoClick={() => {
          dispatch(setShowMenuItems(false));
          setShowCategories(true);
          setSelectedCategory('All');
          setSelectedSubcategory('All');
          setSearchQuery(''); // Clear search when clicking logo
        }}
      />
      
      {/* Hero Banner Section - Hide when showing categories or menu items */}
      {!showCategories && !showMenuItems && <HeroBanner banners={banners} />}
      
      {/* Show InDiningCards if both menus have data - Hide when showing categories or menu items */}
      {!showMenuItems && !showCategories && shouldShowCards && (
        <InDiningCards 
          onFoodMenuClick={handleFoodMenuClick}
          onDrinksMenuClick={handleDrinksMenuClick}
        />
      )}
      
      {/* Show categories after selecting from cards or when only one menu type exists */}
      {!showMenuItems && showCategories && (foodItems.length > 0 || drinksItems.length > 0) && (
        <div>
          {/* Fixed Header Section */}
          <div className="sticky top-24 z-30 bg-white">
            {/* Back Button */}
            {shouldShowCards && (
              <div className="px-4 pt-3 pb-2">
                <button
                  onClick={() => {
                    setShowCategories(false);
                    dispatch(setCurrentMenuType(null));
                    setSearchQuery(''); // Clear search when going back
                  }}
                  className="text-gray-700 hover:text-gray-900 flex items-center gap-1 text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>back</span>
                </button>
              </div>
            )}
            {/* Search Bar */}
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={(value) => setSearchQuery(value)}
              menuType={currentMenuType}
            />
          </div>
          
          {/* Category Grid */}
          <div className="pb-20">
            {searchQuery ? (
            // Show filtered items when searching - filter only current menu type
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-0">
                {(() => {
                  // Filter only within the current menu type
                  const itemsToSearch = currentMenuType === 'food' ? foodItems : drinksItems;
                  // Apply vegan/vegetarian filtering first, then search (only for food menu)
                  const dietFilteredItems = getFilteredItems(itemsToSearch, currentMenuType || 'food');
                  const searchResults = dietFilteredItems.filter(item => 
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  
                  if (searchResults.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No items found matching "{searchQuery}"</p>
                      </div>
                    );
                  }
                  
                  // Render results based on current menu type
                  return searchResults.map((item) => {
                    if (currentMenuType === 'drinks') {
                      return (
                        <DrinksMenuItem
                          key={item.id}
                          item={item}
                          onProductClick={handleProductClick}
                          onAddClick={openDrinksModifierPopup}
                          isTpnAvailable={isPaymentAvilable}
                        />
                      );
                    } else {
                      return (
                        <FoodMenuItem
                          key={item.id}
                          item={item}
                          onProductClick={handleProductClick}
                          onAddClick={openModifiersPopup}
                          isTpnAvailable={isPaymentAvilable}
                        />
                      );
                    }
                  });
                })()}
              </div>
            </div>
          ) : (
            // Show category grid when not searching
            <>
              {/* Filter Toggle Buttons - Only show on food menu */}
              {currentMenuType === 'food' && (
                <FilterToggleButtons
                  isVeganFilter={isVegan}
                  isVegetarianFilter={isVeg}
                  onVeganToggle={() => setisVegan(!isVegan)}
                  onVegetarianToggle={() => {
                    const newVegState = !isVeg;
                    setisVeg(newVegState);
                    setisVegan(newVegState);
                  }}
                />
              )}
              
              {(() => {
                const categories = getCategoriesWithImages(
                  currentMenuType === 'food' ? foodItems : drinksItems,
                  currentMenuType || 'food'
                );
                
                // Check if dietary filters are active and no categories are available
                if ((isVegan || isVeg) && categories.length === 0) {
                  return (
                    <div className="px-4 py-12 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="mb-4">
                          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.87 0-5.431.58-7.543 1.501A1.994 1.994 0 014 18.014V19a1 1 0 001 1h14a1 1 0 001-1v-.986a1.994 1.994 0 00-.457-1.513z" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {isVegan && isVeg ? 'Vegetarian & Vegan Options' : isVegan ? 'Vegan Options' : 'Vegetarian Options'} Unavailable
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          We apologize, but {isVegan && isVeg ? 'vegetarian and vegan dishes' : isVegan ? 'vegan dishes' : 'vegetarian dishes'} are not available at this moment. 
                          Please explore our other delicious restaurant favorites and signature dishes.
                        </p>
                        <button
                          onClick={() => {
                            setisVegan(false);
                            setisVeg(false);
                          }}
                          className="inline-flex items-center text-sm px-4 py-2 border border-transparent text-base font-normal rounded-3xl text-white bg-orange-600 hover:bg-orange-600 "
                        >
                          View All Menu Items
                        </button>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <CategoryGrid
                    categories={categories}
                    onCategoryClick={handleCategoryClick}
                  />
                );
              })()}
            </>
          )}
          </div>
        </div>
      )}
      
      {/* Show loading indicator or empty state */}
      {!showMenuItems && !showCategories && foodItems.length === 0 && drinksItems.length === 0 && (
        loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">Loading menu...</p>
          </div>
        ) : (
          <EmptyState isMenuEmpty={true} />
        )
      )}
      
      {/* Menu Items - Directly show without filters */}
      {showMenuItems && (
      <>
      {/* Header with search bar and category name */}
      <div className="bg-white border-b border-gray-200 sticky top-24 z-30">
      <div className="px-4 pt-3 pb-2">
          {/* Back Button */}
          <div className="mb-3">
            <button
              onClick={() => {
                dispatch(setShowMenuItems(false));
                setShowCategories(true);
                setSelectedCategory('All');
                setSelectedSubcategory('All');
                setSearchQuery(''); // Clear search when going back
              }}
              className="text-gray-700 hover:text-gray-900 flex items-center gap-1 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>back</span>
            </button>
          </div>
          {/* Search Bar */}
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={(value) => setSearchQuery(value)}
            menuType={currentMenuType}
          />
          
          {/* Category name and item count - Hide when searching */}
          {!searchQuery && (
            <div className="flex justify-between items-center mt-3">
              {/* Left side - Category name */}
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCategory === 'All' ? 'All Items' : selectedCategory}
                </h2>
              </div>
              
              {/* Right side - Item count */}
              <div className="text-sm text-gray-600">
                {`${filteredMenuItems.length} ${filteredMenuItems.length === 1 ? 'item' : 'items'}`}
              </div>
            </div>
          )}
          
          {/* Search results count - Show only when searching */}
          {searchQuery && (
            <div className="text-sm text-gray-600 mt-3 text-center">
              {(() => {
                // When searching, filter only within current menu type
                const itemsToSearch = currentMenuType === 'food' ? foodItems : drinksItems;
                const searchResults = itemsToSearch.filter(item => 
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                return `${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'} found`;
              })()}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-0">
          {/* Menu Items */}
          {currentMenuType === "food" &&
            <div>
              <div className="space-y-0">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading menu items...</p>
                  </div>
                ) : foodItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p>No menu items available</p>
                  </div>
                ) : filteredMenuItems.length === 0 ? (
                  <EmptyState 
                    selectedCategory={selectedCategory}
                    onViewAll={() => setSelectedCategory('All')}
                  />
                ) : (
                  (() => {
                    // When searching, filter only within current menu type (food items only)
                    if (searchQuery) {
                      // Apply vegan/vegetarian filtering first, then search (only for food menu)
                      const dietFilteredItems = getFilteredItems(foodItems, 'food');
                      const searchResults = dietFilteredItems.filter(item => 
                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      
                      if (searchResults.length === 0) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No items found matching "{searchQuery}"</p>
                          </div>
                        );
                      }
                      
                      // Display only food items
                      return searchResults.map((item) => (
                        <FoodMenuItem
                          key={item.id}
                          item={item}
                          onProductClick={handleProductClick}
                          onAddClick={openModifiersPopup}
                          isTpnAvailable={isPaymentAvilable}
                        />
                      ));
                    }
                    
                    // When not searching, show filtered menu items
                    return filteredMenuItems.map((item) => (
                      <FoodMenuItem
                        key={item.name}
                        item={item}
                        onProductClick={handleProductClick}
                        onAddClick={openModifiersPopup}
                        isTpnAvailable={isPaymentAvilable}
                      />
                    ));
                  })()
                )}
              </div>
            </div>
          }

          {currentMenuType === "drinks" &&
            <div>
              <div className="space-y-0">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading menu items...</p>
                  </div>
                ) : drinksItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p>No menu items available</p>
                  </div>
                ) : filteredMenuItems.length === 0 ? (
                  <EmptyState 
                    selectedCategory={selectedCategory}
                    onViewAll={() => setSelectedCategory('All')}
                  />
                ) : (
                  (() => {
                    // When searching, filter only within current menu type (drinks items only)
                    if (searchQuery) {
                      // Apply vegan/vegetarian filtering first, then search (no dietary filters for drinks)
                      const dietFilteredItems = getFilteredItems(drinksItems, 'drinks');
                      const searchResults = dietFilteredItems.filter(item => 
                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      
                      if (searchResults.length === 0) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No items found matching "{searchQuery}"</p>
                          </div>
                        );
                      }
                      
                      // Display only drinks items
                      return searchResults.map((item) => (
                        <DrinksMenuItem
                          key={item.id}
                          item={item}
                          onProductClick={handleProductClick}
                          onAddClick={openDrinksModifierPopup}
                          isTpnAvailable={isPaymentAvilable}
                        />
                      ));
                    }
                    
                    // When not searching, show filtered menu items
                    return filteredMenuItems.map((item) => (
                      <DrinksMenuItem
                        key={item.name}
                        item={item}
                        onProductClick={handleProductClick}
                        onAddClick={openDrinksModifierPopup}
                        isTpnAvailable={isPaymentAvilable}
                      />
                    ));
                  })()
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
          menuItems={currentMenuType === 'drinks' ? drinksItems : foodItems}
          onProductSelect={(product) => {
            setSelectedProduct(product);
            // Keep the product details modal open with the new product
          }}
          onViewOrders={() => setShowOrders(true)}
        />
      )}
      
      {/* Cart Drawer Component */}
      <QuickMenuCartDrawer 
        onPlaceOrder={handlePlaceOrder} 
        displayName={tableName}
        onOrderSuccess={() => {
          // Reset view to show cards or categories
          if (shouldShowCards) {
            // Show cards if both menus exist
            setShowCategories(false);
            dispatch(setCurrentMenuType(null));
            dispatch(setShowMenuItems(false));
          } else if (foodItems.length > 0) {
            // Show food categories if only food menu exists
            dispatch(setCurrentMenuType('food'));
            setShowCategories(true);
            dispatch(setShowMenuItems(false));
          } else if (drinksItems.length > 0) {
            // Show drinks categories if only drinks menu exists
            dispatch(setCurrentMenuType('drinks'));
            setShowCategories(true);
            dispatch(setShowMenuItems(false));
          }
          setSelectedCategory('All');
          setSelectedSubcategory('All');
          setSearchQuery('');
        }}
      />
      
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
      
      {/* Payment Status Handler - handles all payment status popups */}
      <PaymentStatusHandler 
        onInDiningTryAgain={() => {
          // When Try Again is clicked in in-dining context:
          // 1. Show orders page
          // 2. Then continue to first menu selection
          setShowOrders(true);
          
          // After showing orders, automatically continue to first menu
          setTimeout(() => {
            setShowOrders(false);
            // Show the first available menu (food or drinks)
            if (foodItems.length > 0) {
              dispatch(setCurrentMenuType('food'));
              setShowCategories(true);
              dispatch(setShowMenuItems(false));
            } else if (drinksItems.length > 0) {
              dispatch(setCurrentMenuType('drinks'));
              setShowCategories(true);
              dispatch(setShowMenuItems(false));
            }
          }, 2000); // Show orders for 2 seconds then continue
        }}
        onInDiningContinue={() => {
          // When Continue is clicked after successful payment in in-dining context:
          // Auto-select food menu directly
          if (foodItems.length > 0) {
            dispatch(setCurrentMenuType('food'));
            setShowCategories(true);
            dispatch(setShowMenuItems(false));
            setSelectedCategory('All');
            setSelectedSubcategory('All');
            setSearchQuery('');
          } else if (drinksItems.length > 0) {
            dispatch(setCurrentMenuType('drinks'));
            setShowCategories(true);
            dispatch(setShowMenuItems(false));
            setSelectedCategory('All');
            setSelectedSubcategory('All');
            setSearchQuery('');
          }
        }}
      />
    </div>
  );
}

// Filter Toggle Buttons Component
const FilterToggleButtons = ({ 
  isVeganFilter, 
  isVegetarianFilter, 
  onVeganToggle, 
  onVegetarianToggle 
}: {
  isVeganFilter: boolean;
  isVegetarianFilter: boolean;
  onVeganToggle: () => void;
  onVegetarianToggle: () => void;
}) => {
  return (
    <div className="px-5 py-5 bg-white">
      <div className="flex gap-4">
        {/* Vegan Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onVeganToggle}
            className={`relative w-12 h-6 rounded-full border-2 transition-all duration-500 ease-in-out transform hover:scale-105 ${
              isVeganFilter
                ? 'bg-green-100 border-green-300 shadow-md'
                : 'bg-gray-100 border-gray-300'
            }`}
          >
            {/* Toggle Slider */}
            <motion.div 
              className={`absolute top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isVeganFilter
                  ? 'bg-white border-green-500 shadow-lg'
                  : 'bg-white border-gray-400'
              }`}
              animate={{
                x: isVeganFilter ? 24 : 0,
                scale: isVeganFilter ? 1.1 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: 0.3
              }}
            >
              {/* Vegan Icon (LuVegan) with fade animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: isVeganFilter ? 1 : 0,
                  scale: isVeganFilter ? 1 : 0,
                  rotate: isVeganFilter ? 0 : 180
                }}
                transition={{ 
                  duration: 0.2,
                  delay: isVeganFilter ? 0.1 : 0
                }}
              >
                <LuVegan className="w-3 h-3 text-green-500" />
              </motion.div>
            </motion.div>
          </button>
          <span className="text-sm font-medium text-gray-700">Vegan</span>
        </div>

        {/* Vegetarian Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onVegetarianToggle}
            className={`relative w-12 h-6 rounded-full border-2 transition-all duration-500 ease-in-out transform hover:scale-105 ${
              isVegetarianFilter
                ? 'bg-green-100 border-green-300 shadow-md'
                : 'bg-gray-100 border-gray-300'
            }`}
          >
            {/* Toggle Slider */}
            <motion.div 
              className={`absolute top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isVegetarianFilter
                  ? 'bg-white border-green-500 shadow-lg'
                  : 'bg-white border-gray-400'
              }`}
              animate={{
                x: isVegetarianFilter ? 24 : 0,
                scale: isVegetarianFilter ? 1.1 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: 0.3
              }}
            >
              {/* Vegetarian Icon (Green Circle) with fade animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: isVegetarianFilter ? 1 : 0,
                  scale: isVegetarianFilter ? 1 : 0,
                }}
                transition={{ 
                  duration: 0.2,
                  delay: isVegetarianFilter ? 0.1 : 0
                }}
              >
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </motion.div>
            </motion.div>
          </button>
          <span className="text-sm font-medium text-gray-700">Vegetarian</span>
        </div>
      </div>
    </div>
  );
};

export default FestivalMenu;
