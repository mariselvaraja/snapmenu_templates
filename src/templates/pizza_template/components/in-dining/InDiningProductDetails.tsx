import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus, ArrowLeft, Heart, ShoppingCart, Check } from 'lucide-react';
import { FaPepperHot } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../common/store';
import { addItem, toggleDrawer } from '../../../../common/redux/slices/cartSlice';

interface InDiningProductDetailsProps {
  product: any;
  onClose: () => void;
  menuItems: any[];
}

const InDiningProductDetails: React.FC<InDiningProductDetailsProps> = ({ 
  product, 
  onClose,
  menuItems
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [showModifiersPopup, setShowModifiersPopup] = useState<boolean>(false);
  const [selectedModifierOptions, setSelectedModifierOptions] = useState<any[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<string | null>('Medium');
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Get table number from URL
  const location = useLocation();
  const tableNumber =  sessionStorage.getItem('Tablename');

  
  // Handle adding item with modifiers to cart
  const handleAddToCart = () => {
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
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image || '',
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
    onClose();
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
          price: option.price || 0
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
  
  // Reset spice level to Medium when showing modifiers popup
  useEffect(() => {
    if (showModifiersPopup) {
      setSpiceLevel('Medium');
    }
  }, [showModifiersPopup]);
  
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full h-[100vh] overflow-y-auto relative"
      >
        <div className="relative">
          {/* Title Bar - Visible on all screen sizes */}
          <div className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm shadow-md px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="p-1 mr-3"
              >
                <ArrowLeft className="h-6 w-6 text-red-500" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-white truncate">{product.name}</h2>
                <p className="text-xs text-gray-300">
                  Table Number: {tableNumber ? `#${tableNumber}` : 'No Table'}
                </p>
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
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Product Image with Dietary Information */}
          <div className="h-56 sm:h-64 md:h-80 relative">
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
            
            {/* Dietary Information Badges - Top Left */}
            {product.dietary && (
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.dietary.isVegetarian && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Vegetarian
                  </div>
                )}
                {product.dietary.isVegan && (
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Vegan
                  </div>
                )}
                {product.dietary.isGlutenFree && (
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Gluten Free
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 pb-28 md:pb-0">
            {/* Product Details - Left Side */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
              <p className="text-xl font-bold text-red-500 mb-2">${product.price.toFixed(2)}</p>
              
              {/* Dietary Information Badges */}
              {product.dietary && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.dietary.isVegetarian && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Vegetarian
                    </div>
                  )}
                  {product.dietary.isVegan && (
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Vegan
                    </div>
                  )}
                  {product.dietary.isGlutenFree && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Gluten Free
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-gray-600 mb-6">{product.description}</p>


              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Ingredients</h3>
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

              {/* Allergens */}
              {product.allergens && product.allergens.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Allergens</h3>
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
              
              {/* Nutritional Information - Only show if nutritional data exists */}
              {(product.calories || product.protein || product.carbs || product.fat || 
                (product.nutrients && Object.values(product.nutrients).some(value => value !== undefined && value !== ''))) && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Nutritional Information</h3>
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
                </div>
              )}
              
              {/* Preparation Time */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Preparation Time</h3>
                <p className="text-gray-700">{product.prepTime || '15-20 minutes'}</p>
              </div>
              
              {/* Price, Quantity Controls, and Add to Cart - Only visible on desktop */}
              <div className="hidden md:flex justify-between items-center mt-6">
                <div className="flex items-center">
                  <p className="font-bold text-xl text-red-500 mr-4">
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                  
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="mx-3 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowModifiersPopup(true)}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors font-medium"
                >
                  Add to Order
                </button>
              </div>
            </div>
            
            {/* Spice Level Selection */}
            <div className="p-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
                <FaPepperHot className="h-5 w-5 text-red-500 mr-2" /> Spice Level
              </h3>
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setSpiceLevel('Mild')}
                  className={`flex items-center px-4 py-2 rounded-full border ${
                    spiceLevel === 'Mild' 
                      ? 'border-red-500 bg-red-50 text-red-500' 
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <FaPepperHot className="h-4 w-4 mr-2 text-yellow-500" />
                  
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
                  
                  {spiceLevel === 'Hot' && <Check className="h-4 w-4 ml-2" />}
                </button>
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
                          onClose();
                          setTimeout(() => {
                            // This would be handled by the parent component
                          }, 100);
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
                          <p className="text-red-500 text-xs">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
        {/* Fixed Bottom Bar with Full-Width Add Button - Only visible on mobile */}
        <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex flex-col z-50 shadow-lg">
          {/* Price and Quantity Controls Row */}
          <div className="flex justify-between items-center mb-3">
            {/* Price on LHS */}
            <p className="font-bold text-xl text-red-500">
              ${(product.price * quantity).toFixed(2)}
            </p>
            
            {/* Quantity Controls on RHS */}
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="mx-4 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Full-Width Add Button */}
          <button
            onClick={() => setShowModifiersPopup(true)}
            className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors font-medium"
          >
            Add to Order
          </button>
        </div>
      </motion.div>
      
      {/* Modifiers Popup */}
      {showModifiersPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Select Options for {product.name}</h3>
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
                    Mild
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
                    Medium
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
                    Hot
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
                  if (product.modifiers_list && product.modifiers_list.length > 0) {
                    product.modifiers_list.forEach((modifier: any) => {
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
                              {option.price > 0 ? `+$${option.price.toFixed(2)}` : '$0.00'}
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
              
              <div className="mt-6">
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
};

export default InDiningProductDetails;
