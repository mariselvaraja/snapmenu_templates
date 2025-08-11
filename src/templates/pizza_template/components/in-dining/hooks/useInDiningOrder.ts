import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../../../common/store';
import { addItem, removeItem } from '../../../../../common/redux/slices/inDiningCartSlice';
import { getInDiningOrdersRequest, placeInDiningOrderRequest } from '../../../../../common/redux/slices/inDiningOrderSlice';
import { setShowMenuItems, setMenuItems, setCurrentMenuType } from '../../../../../common/redux/slices/menuSlice';
import { fetchTableStatusRequest } from '../../../../../common/redux/slices/tableStatusSlice';
import { getOrderHistoryRequest } from '../../../../../common/redux/slices/orderHistorySlice';
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
  const [tableName, setTableName] = useState('');
  const [isModifierModalOpen, setIsModifierModalOpen] = useState<boolean>(false);
  const [isDrinksModifierModalOpen, setIsDrinksModifierModalOpen] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [showCategories, setShowCategories] = useState<boolean>(false);

  // Redux hooks
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const tableStatus = useSelector((state: any) => state.tableStatus?.tables);
  const { rawApiResponse } = useAppSelector(state => state.siteContent);

  // Redux selectors
  const orderHistoryState = useSelector((state: RootState) => state.orderHistory);
  const cartItems = useSelector((state: RootState) => state.inDiningCart.items);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const foodItems = useSelector((state: RootState) => state.menu.foodItems);
  const drinksItems = useSelector((state: RootState) => state.menu.drinksItems);
  const loading = useSelector((state: RootState) => state.menu.loading);
  const showMenuItems = useSelector((state: RootState) => state.menu.showMenuItems);
  const currentMenuType = useSelector((state: RootState) => state.menu.currentMenuType);

  // Parse site content
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    { navigationBar: { brand: { logo: {} }, navigation: [] } };
  const homepage = siteContent.homepage;
  const brand = homepage?.brand;

  // Get table info
  const searchParams = new URLSearchParams(location.search);
  const tableFromQuery: any = searchParams.get('table');
  const table_name = sessionStorage.getItem('Tablename');

  // Transform order history
  const orders = orderHistoryState.orders ? orderHistoryState.orders.map((orderData: any) => {
    const order = orderData as any;
    const items = order.ordered_items 
      ? order.ordered_items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          status: item.status,
          price: item?.indining_price || item.itemPrice || 0.00,
          image: item.image || '',
          modifiers: item.modifiers || [],
          spiceLevel: item.spiceLevel || null
        }))
      : order.items || [];
    
    return {
      id: order.id || (order.dining_id ? order.dining_id.toString() : '') || '',
      date: order.createdAt || order.created_date || new Date().toISOString(),
      status: order.status || order.dining_status || 'pending',
      total: order.totalAmount || (order.total_amount ? parseFloat(order.total_amount) : 0) || 0,
      items: items
    };
  }) : [];

  // Effects
  useEffect(() => {
    const tabledata = tableStatus?.find((table: any) => table.table_id == tableFromQuery);
    if (tableFromQuery) {
      dispatch(getOrderHistoryRequest(tableFromQuery));
    }
    if (tabledata?.table_name) {
      sessionStorage.setItem('Tablename', tabledata.table_name);
      setTableName(tabledata.table_name);
    }
  }, [tableFromQuery, tableStatus]);

  useEffect(() => {
    dispatch(fetchTableStatusRequest(tableFromQuery));
  }, [location]);

  // useEffect(() => {
  //   dispatch(getInDiningOrdersRequest());
  // }, [dispatch]);

  useEffect(() => {
    if (!loading && (foodItems.length > 0 || drinksItems.length > 0)) {
      if (foodItems.length > 0) {
        dispatch(setCurrentMenuType('food'));
        setShowCategories(true);
        dispatch(setShowMenuItems(false));
      } else if (drinksItems.length > 0 && foodItems.length === 0) {
        dispatch(setCurrentMenuType('drinks'));
        setShowCategories(true);
        dispatch(setShowMenuItems(false));
      }
    }
  }, [loading, foodItems, drinksItems]);

  // Helper functions
  const getCategoriesWithImages = (items: any[], menuType: string) => {
    const categoryMap = new Map();
    
    items.forEach(item => {
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
        if (!cat.image && item.image) {
          cat.image = item.image;
        }
      }
    });
    
    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleCategoryClick = (categoryName: string) => {
    const items = currentMenuType === 'food' ? foodItems : drinksItems;
    const filteredItems = items.filter(item => 
      currentMenuType === 'drinks' ? item.type === categoryName : item.category === categoryName
    );
    
    dispatch(setMenuItems(filteredItems));
    dispatch(setShowMenuItems(true));
    setShowCategories(false);
    setSelectedCategory(categoryName);
  };

  const handleNavbarClick = () => {
    dispatch(setShowMenuItems(false));
    setShowCategories(true);
    setSelectedCategory('All');
    setSelectedSubcategory('All');
  };

  const handlePlaceOrder = (specialRequest: string = '') => {
    if (cartItems.length === 0) return;
    
    const randomOrderNumber = Math.floor(10000 + Math.random() * 90000).toString();
    setOrderNumber(randomOrderNumber);
    setShowOrders(true);
    
    const orderedItems = cartItems.map((item: any) => {
      const spiceLevel = item.selectedModifiers?.find((mod: any) => mod.name === "Spice Level")?.options[0]?.name || "";
      let modifiers = item.selectedModifiers?.filter((mod: any) => mod.name != "Spice Level");
      let options = modifiers.flatMap((mod: any) => mod.options);
      modifiers = options.map((option: any) => ({
        modifier_name: option.name,
        modifier_price: option.price
      }));
      
      return {
        name: item.name,
        quantity: item.quantity,
        itemPrice: item?.indining_price || item.price || 0,
        image: item.image || '',
        table_name,
        modifiers: modifiers || [],
        spiceLevel: spiceLevel
      };
    });
    
    const restaurant_id = sessionStorage.getItem("franchise_id");
    const restaurant_parent_id = sessionStorage.getItem("restaurant_id");
    
    dispatch(placeInDiningOrderRequest({
      table_id: tableFromQuery,
      restaurant_id,
      restaurant_parent_id,
      additional_details: '',
      special_requests: specialRequest,
      ordered_items: orderedItems
    }));
  };

  const resetOrder = () => {
    setOrderPlaced(false);
    cartItems.forEach((item: any) => {
      dispatch(removeItem(item.id));
    });
  };

  const handleMenuTypeSelection = (type: 'food' | 'drinks') => {
    dispatch(setCurrentMenuType(type));
    setShowCategories(true);
    setSelectedCategory('All');
    setSelectedSubcategory('All');
  };

  return {
    // State
    orderNumber,
    selectedProduct,
    isProductDetailsOpen,
    quantity,
    selectedCategory,
    selectedSubcategory,
    isSearchActive,
    showOrders,
    tableName,
    isModifierModalOpen,
    isDrinksModifierModalOpen,
    selectedMenuItem,
    showCategories,
    
    // Redux state
    brand,
    cartItems,
    menuItems,
    foodItems,
    drinksItems,
    loading,
    showMenuItems,
    currentMenuType,
    orders,
    orderHistoryState,
    
    // Setters
    setSelectedProduct,
    setIsProductDetailsOpen,
    setQuantity,
    setIsSearchActive,
    setShowOrders,
    setIsModifierModalOpen,
    setIsDrinksModifierModalOpen,
    setSelectedMenuItem,
    
    // Handlers
    getCategoriesWithImages,
    handleCategoryClick,
    handleNavbarClick,
    handlePlaceOrder,
    resetOrder,
    handleMenuTypeSelection
  };
};
