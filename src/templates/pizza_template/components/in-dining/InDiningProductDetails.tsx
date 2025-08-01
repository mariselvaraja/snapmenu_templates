import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus, ArrowLeft, Heart, ShoppingCart, Check, Activity, ChevronDown, ChevronUp, Box, AlertTriangle, ClipboardList } from 'lucide-react';
import { FaPepperHot } from "react-icons/fa";
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';
import { CiWheat } from 'react-icons/ci';
import { GoDotFill } from 'react-icons/go';
import InDiningModifierModal from './InDiningModifierModal';

// Nutritional Information Section Component
const NutritionalInfoSection: React.FC<{ product: any }> = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Check if there's any nutritional information to display
  const hasNutritionalInfo = product.Calories || product.Nutrients || 
    product.calories || product.protein || product.carbs || product.fat || 
    (product.nutrients && Object.values(product.nutrients).some(value => value !== undefined && value !== ''));
  
  if (!hasNutritionalInfo) {
    return null;
  }

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <button 
        className="w-full text-left px-4 py-3 bg-gray-50 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-base font-semibold flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Nutritional Information
        </h2>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4">
          {/* Display Calories and Nutrients if they exist in the product */}
          {(product.Calories || product.Nutrients) ? (
            <div className="flex flex-wrap gap-2">
              {product.Calories && (
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100">
                  Calories: {product.Calories}
                </span>
              )}
              {product.Nutrients && (
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100">
                  {product.Nutrients}
                </span>
              )}
            </div>
          ) : (
            /* Display detailed nutritional info if available */
            <div className="grid grid-cols-2 gap-2">
              {(product.calories || product.nutrients?.calories) && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-xs text-gray-500">Calories</span>
                  <p className="font-medium">{product.calories || product.nutrients?.calories || '450'} kcal</p>
                </div>
              )}
              {(product.protein || product.nutrients?.protein) && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-xs text-gray-500">Protein</span>
                  <p className="font-medium">{product.protein || product.nutrients?.protein || '12'}g</p>
                </div>
              )}
              {(product.carbs || product.nutrients?.carbs) && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-xs text-gray-500">Carbs</span>
                  <p className="font-medium">{product.carbs || product.nutrients?.carbs || '45'}g</p>
                </div>
              )}
              {(product.fat || product.nutrients?.fat) && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-xs text-gray-500">Fat</span>
                  <p className="font-medium">{product.fat || product.nutrients?.fat || '18'}g</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Ingredients Section Component
const IngredientsSection: React.FC<{ product: any }> = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!product.ingredients || product.ingredients.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <button 
        className="w-full text-left px-4 py-3 bg-gray-50 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-base font-semibold flex items-center">
          <Box className="h-4 w-4 mr-2" />
          Ingredients
        </h2>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {product.ingredients.map((ingredient: string, index: number) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Allergens Section Component
const AllergensSection: React.FC<{ product: any }> = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!product.allergens || product.allergens.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <button 
        className="w-full text-left px-4 py-3 bg-gray-50 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-base font-semibold flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Allergens
        </h2>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {product.allergens.map((allergen: string, index: number) => (
              <span
                key={index}
                className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs"
              >
                {allergen}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../common/store';
import { addItem, toggleDrawer, setTableId } from '../../../../common/redux/slices/inDiningCartSlice';
import InDiningDrinksModifierModal from './InDiningDrinksModifierModal';
import { formatCurrency } from '../../utils';

interface InDiningProductDetailsProps {
  product: any;
  onClose: () => void;
  menuItems: any[];
  onProductSelect?: (product: any) => void;
  onViewOrders?: () => void;
  currentMenuType : any
}

const InDiningProductDetails: React.FC<InDiningProductDetailsProps> = ({ 
  product, 
  onClose,
  menuItems,
  onProductSelect,
  onViewOrders,
  currentMenuType
}) => {
  const [isModifierModalOpen, setIsModifierModalOpen] = useState<boolean>(false);
   const [isDrinksModifierModalOpen, setIsDrinksModifierModalOpen] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.inDiningCart.items);
  
  // Get table number from URL
  const location = useLocation();
  const tableNumber = sessionStorage.getItem('Tablename');
  
  // Refs for URL bar hiding on mobile
  const isMobileRef = useRef(false);
  const isComponentMountedRef = useRef(false);
  
  // Function to hide URL bar on mobile
  const hideUrlBar = useRef(() => {
    if (isMobileRef.current && isComponentMountedRef.current) {
      // For fixed positioned elements, we need to temporarily change the body height
      // to allow scrolling and then hide the URL bar
      const originalHeight = document.body.style.height;
      const originalOverflow = document.body.style.overflow;
      
      // Temporarily make body scrollable
      document.body.style.height = '101vh';
      document.body.style.overflow = 'auto';
      
      // Scroll to hide URL bar
      window.scrollTo(0, 1);
      
      // Restore original styles after a short delay
      setTimeout(() => {
        document.body.style.height = originalHeight;
        document.body.style.overflow = originalOverflow;
      }, 100);
    }
  }).current;

  // Check if device is mobile and set up URL bar hiding
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth <= 768;
      if (isMobileRef.current) {
        hideUrlBar();
      }
    };
    
    // Handle scroll events to hide URL bar
    const handleScroll = () => {
      if (isMobileRef.current && isComponentMountedRef.current) {
        hideUrlBar();
      }
    };
    
    // Check on mount
    checkMobile();
    
    // Set up event listeners
    window.addEventListener('resize', checkMobile);
    window.addEventListener('load', hideUrlBar);
    window.addEventListener('resize', hideUrlBar);
    window.addEventListener('orientationchange', hideUrlBar);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    
    // Get the scrollable container and add scroll listeners
    const scrollContainer = document.querySelector('.product-details-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      scrollContainer.addEventListener('touchmove', handleScroll, { passive: true });
    }
    
    // Initial attempts to hide URL bar with different timing
    setTimeout(hideUrlBar, 100);
    setTimeout(hideUrlBar, 300);
    setTimeout(hideUrlBar, 1000);
    
    return () => {
      isComponentMountedRef.current = false;
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('load', hideUrlBar);
      window.removeEventListener('resize', hideUrlBar);
      window.removeEventListener('orientationchange', hideUrlBar);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.removeEventListener('touchmove', handleScroll);
      }
    };
  }, [hideUrlBar]);


  // Helper function to check if spice level should be shown based on is_spice_applicable
  const shouldShowSpiceLevel = () => {
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
  const hasModifiers = () => {
    return product?.modifiers_list && product.modifiers_list.length > 0;
  };

  // Helper function to check if product needs customization (has modifiers or spice level)
  const needsCustomization = () => {
    return hasModifiers() || shouldShowSpiceLevel();
  };

  // Add item directly to cart without opening modifier modal
  const addDirectlyToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: Number(product.indining_price || product.price || 0),
      image: product.image || '',
      quantity: 1,
      selectedModifiers: []
    };

    dispatch(addItem(cartItem));
    dispatch(toggleDrawer(true));
    onClose();
  };

  // Handle add to order button click
  const handleAddToOrder = () => {
    const productWithQuantity = {
      ...product,
      quantity: 1
    };
    setSelectedMenuItem(productWithQuantity);

    // For drinks menu, open drinks modifier modal if it has prices array
    if (currentMenuType === "drinks" && product?.prices && Array.isArray(product.prices) && product.prices.length > 0) {
      setIsDrinksModifierModalOpen(true);
    } else if (needsCustomization()) {
      // Open regular modifier modal if product has modifiers or spice level
      setIsModifierModalOpen(true);
    } else {
      // Add directly to cart if no customization needed
      addDirectlyToCart();
    }
  };
  

  
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
    
    // Use table from query parameter first, then fall back to path parameter
 
  }, [location]);

  if (!product) return null;

  // Add styles to prevent body scroll when modal is open
  useEffect(() => {
    // Save current body overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Restore body scroll on unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full h-full flex flex-col relative overflow-hidden"
      >
        {/* Fixed Title Bar - Visible on all screen sizes */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm shadow-md px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="p-1 mr-3"
              >
                <ArrowLeft className="h-6 w-6 text-red-500" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-white truncate">{product.name}</h2>
              </div>
            </div>
            
            {/* Cart Icon */}
            <button 
              onClick={() => dispatch(toggleDrawer())}
              className="p-2 rounded-full hover:bg-black hover:bg-opacity-50 relative"
            >
              <ShoppingCart className="h-6 w-6 text-red-500" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((total:any, item:any) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

        {/* Scrollable Content Container - with padding top for fixed header */}
        <div className="flex-1 overflow-y-auto pt-[60px]">
          {/* Product Image with Dietary Information */}
          <div className="h-56 sm:h-64 md:h-80 relative flex-shrink-0">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-red-100 flex items-center justify-center">
                <span className="text-6xl font-bold text-red-500">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Dietary Information Icons - Top Left */}
            {product.dietary && (
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {product.dietary.isVegetarian && (
                  <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                    <IoLeafOutline className="w-5 h-5" />
                  </div>
                )}
                {product.dietary.isVegan && (
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
                    <LuVegan className="w-5 h-5" />
                  </div>
                )}
                {product.dietary.isGlutenFree && (
                  <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                    <CiWheat className="w-5 h-5" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 pb-28 md:pb-20">
            {/* Product Details - Left Side */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                {/* Food Type Icons - Veg/Non-Veg */}
                {product.dietary && (product.dietary.isVegetarian || product.dietary.isVegan) ? (
                  <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-green-600 flex-shrink-0">
                    <GoDotFill className="w-2 h-2 text-green-600" />
                  </div>
                ) : (
                  <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-red-600 flex-shrink-0">
                    <GoDotFill className="w-2 h-2 text-red-600" />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              </div>
              <p className="text-xl font-bold text-red-500 mb-2">
              ${formatCurrency(
  Array.isArray(product?.prices) && product.prices.length > 0
    ? Number(product.prices[0].price) || 0
    : Number(product?.indining_price || product?.price || 0)
)}

              </p>

              {/* Show spice level indicator if applicable */}
              {shouldShowSpiceLevel() && (
                <div className="flex items-center mb-2">
                  <FaPepperHot className="text-red-500 h-4 w-4 mr-2" />
                  <span className="text-sm text-gray-600">Spice level customizable</span>
                </div>
              )}

              {/* Show modifiers indicator if available */}
              {hasModifiers() && (
                <div className="flex items-center mb-2">
                  <Check className="text-green-500 h-4 w-4 mr-2" />
                  <span className="text-sm text-gray-600">Customization options available</span>
                </div>
              )}
              
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Nutritional Information, Ingredients, and Allergens in collapsible sections */}
              <NutritionalInfoSection product={product} />
              <IngredientsSection product={product} />
              <AllergensSection product={product} />
              
              {/* Add to Order Button - Only visible on desktop */}
              <div className="hidden md:flex justify-end mt-6">
                {product.inventory_status === false ? (
                  <div className="px-6 py-2 rounded-full bg-gray-200 text-gray-600 font-medium">
                    Out of Stock
                  </div>
                ) : (
                  <button
                    onClick={handleAddToOrder}
                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors font-medium"
                  >
                    {needsCustomization() ? 'Customize & Add' : 'Add to Order'}
                  </button>
                )}
              </div>
            </div>
            
            
            {/* Right Side - You May Also Like */}
            <div className="flex flex-col">
              {/* You May Also Like - Only visible on desktop for right side */}
              <div className="p-6 border-t border-gray-100 mt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
                  <Heart className="h-4 w-4 text-red-500 mr-2" /> You May Also Like
                </h3>
                <div className="space-y-3">
                  {(() => {
                    // Extract best combo SKU IDs from the product
                    let recommendedSkuIds: string[] = [];
                    
                    if (product.best_combo && typeof product.best_combo === 'string') {
                      try {
                        const bestCombo = JSON.parse(product.best_combo);
                        if (bestCombo.best_combo_ids) {
                          recommendedSkuIds = bestCombo.best_combo_ids
                            .split(',')
                            .map((id: string) => id.trim());
                        }
                      } catch (e) {
                        // If parsing fails, use empty array
                        recommendedSkuIds = [];
                      }
                    }
                    
                    // Find items matching the recommended SKU IDs
                    let recommendedItems = menuItems.filter((item: any) => 
                      item.sku_id && recommendedSkuIds.includes(item.sku_id)
                    );
                    
                    // If no recommended items found, show random items
                    if (recommendedItems.length === 0) {
                      recommendedItems = menuItems
                        .filter((item: any) => item.id.toString() !== product.id.toString())
                        .slice(0, 3);
                    }
                    
                    return recommendedItems.map((item: any) => (
                      <div 
                        key={item.id} 
                        className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center"
                        onClick={() => {
                          if (onProductSelect) {
                            onProductSelect(item);
                          }
                        }}
                      >
                        <div className="w-16 h-16 flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-red-100 flex items-center justify-center">
                              <span className="text-xl font-bold text-red-500">
                                {item.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-red-500 text-xs">
                            ${(() => {
                              // For drinks menu, use 0th index price from prices array
                              if (currentMenuType === "drinks" && item?.prices && Array.isArray(item.prices) && item.prices.length > 0) {
                                return parseFloat(item.prices[0].price) || 0;
                              }
                              // For food menu or fallback, use indining_price or regular price as fallback
                              return Number(item?.indining_price || item?.price || 0);
                            })()}
                          </p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
        {/* Fixed Bottom Bar with Two Buttons - Only visible on mobile */}
        <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
          <div className="flex gap-3">
            {/* Customize & Add Button or Out of Stock */}
            {product.inventory_status === false ? (
              <div className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-full font-medium text-center">
                Out of Stock
              </div>
            ) : (
              <button
                onClick={handleAddToOrder}
                className="flex-1 bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors font-medium"
              >
                {needsCustomization() ? 'Customize & Add' : 'Add to Order'}
              </button>
            )}
            
            {/* View Orders Button */}
            {onViewOrders && (
              <button
                onClick={() => {
                  onViewOrders();
                  onClose();
                }}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-full hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ClipboardList className="h-4 w-4" />
                View Orders
              </button>
            )}
          </div>
        </div>
      </motion.div>
      
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
    </div>
  );
};

export default InDiningProductDetails;
