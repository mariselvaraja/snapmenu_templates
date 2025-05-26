import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../../../common/store';
import { addItem, removeItem, toggleDrawer } from '../../../../../common/redux/slices/cartSlice';
import { setSearchQuery } from '../../../../../common/redux/slices/searchSlice';
import { getInDiningOrdersRequest, placeInDiningOrderRequest } from '../../../../../common/redux/slices/inDiningOrderSlice';
import { fetchTableStatusRequest } from '../../../../../common/redux/slices/tableStatusSlice';
import { useAppSelector } from '../../../../../redux';

export const useInDiningOrder = () => {
  // State management
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
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Redux setup
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const tableStatus = useSelector((state: any) => state.tableStatus?.tables);
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

  // Get table number from URL
  const searchParams = new URLSearchParams(location.search);
  const tableFromQuery = searchParams.get('table');

  // Redux selectors
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const loading = useSelector((state: RootState) => state.menu.loading);

  // Effects
  useEffect(() => {
    let tabledata = tableStatus?.find((table: any) => table.table_id == tableFromQuery);
    sessionStorage.setItem('Tablename', tabledata?.table_name);
    setTableName(tabledata?.table_name);
  }, [tableFromQuery, tableStatus]);

  useEffect(() => {
    dispatch(fetchTableStatusRequest(tableFromQuery));
  }, [location]);

  useEffect(() => {
    dispatch(getInDiningOrdersRequest());
  }, [dispatch]);

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
    (total: any, item: any) => total + item.price * item.quantity, 
    0
  );

  // Helper functions
  const shouldShowSpiceLevel = (product: any) => {
    if (product?.is_spice_applicable?.toLowerCase() === 'yes') {
      return true;
    }
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

  const hasModifiers = (product: any) => {
    return product?.modifiers_list && product.modifiers_list.length > 0;
  };

  const needsCustomization = (product: any) => {
    return hasModifiers(product) || shouldShowSpiceLevel(product);
  };

  const addDirectlyToCart = (product: any) => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: typeof product.price === 'number' ? product.price : 0,
      image: product.image || '',
      quantity: 1,
      selectedModifiers: []
    };

    dispatch(addItem(cartItem));
    dispatch(toggleDrawer(true));
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductDetailsOpen(true);
    
    const cartItem = cartItems.find((item: any) => item.id === product.id);
    setQuantity(cartItem ? cartItem.quantity : 1);
  };

  const closeProductDetails = () => {
    setIsProductDetailsOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    
    const randomOrderNumber = Math.floor(10000 + Math.random() * 90000).toString();
    setOrderNumber(randomOrderNumber);
    setShowOrders(true);
    
    const orderedItems = cartItems.map((item: any) => {
      const spiceLevel = item.selectedModifiers?.find((mod: any) => mod.name === "Spice Level")?.options[0]?.name || "Medium";
      const modifiers = item.selectedModifiers?.filter((mod: any) => mod.name != "Spice Level");
      return {
        name: item.name,
        quantity: item.quantity,
        itemPrice: item.price,
        image: item.image || '',
        modifiers: modifiers || [],
        spiceLevel: spiceLevel
      };
    });
    
    let restaurant_id = sessionStorage.getItem("franchise_id");
    let restaurant_parent_id = sessionStorage.getItem("restaurant_id");
    
    dispatch(placeInDiningOrderRequest({
      table_id: tableFromQuery,
      restaurant_id,
      restaurant_parent_id,
      additional_details: '',
      ordered_items: orderedItems
    }));
  };

  const resetOrder = () => {
    setOrderPlaced(false);
    cartItems.forEach((item: any) => {
      dispatch(removeItem(item.id));
    });
  };

  const openModifiersPopup = (product: any) => {
    if (needsCustomization(product)) {
      setSelectedMenuItem(product);
      setIsModifierModalOpen(true);
    } else {
      addDirectlyToCart(product);
    }
  };

  // Category handlers
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const handleViewAllItems = () => {
    setSelectedCategory('All');
  };

  // Navigation handlers
  const handleSearchClick = () => {
    setIsSearchActive(true);
    dispatch(setSearchQuery(''));
  };

  const handleOrdersClick = () => {
    setShowOrders(true);
  };

  return {
    // State
    orderPlaced,
    orderNumber,
    selectedProduct,
    isProductDetailsOpen,
    quantity,
    selectedCategory,
    selectedSubcategory,
    isSearchActive,
    showOrders,
    isFilterDrawerOpen,
    tableName,
    isModifierModalOpen,
    selectedMenuItem,
    currentBannerIndex,
    
    // Data
    cartItems,
    menuItems,
    loading,
    filteredMenuItems,
    uniqueCategories,
    uniqueSubcategories,
    totalPrice,
    banners,
    brand,
    tableFromQuery,
    
    // Setters
    setOrderPlaced,
    setOrderNumber,
    setSelectedProduct,
    setIsProductDetailsOpen,
    setQuantity,
    setSelectedCategory,
    setSelectedSubcategory,
    setIsSearchActive,
    setShowOrders,
    setIsFilterDrawerOpen,
    setTableName,
    setIsModifierModalOpen,
    setSelectedMenuItem,
    setCurrentBannerIndex,
    
    // Handlers
    handleProductClick,
    closeProductDetails,
    handlePlaceOrder,
    resetOrder,
    openModifiersPopup,
    handleCategoryChange,
    handleSubcategoryChange,
    handleViewAllItems,
    handleSearchClick,
    handleOrdersClick,
    
    // Helper functions
    shouldShowSpiceLevel,
    hasModifiers,
    needsCustomization,
    addDirectlyToCart
  };
};
