import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus, ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { addItem, toggleDrawer } from '../../../../common/redux/slices/cartSlice';

const InDiningProductDetails = ({ product, onClose, menuItems }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(product.price);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  
  // Get table number from URL
  const location = useLocation();
  const [tableNumber, setTableNumber] = useState(null);
  
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
    if (tableFromQuery && !isNaN(Number(tableFromQuery))) {
      setTableNumber(tableFromQuery);
    } else if (tableFromPath) {
      setTableNumber(tableFromPath);
    } else {
      setTableNumber(null);
    }
  }, [location]);

  // Initialize selected options
  useEffect(() => {
    if (product.options) {
      const initialOptions = {};
      Object.keys(product.options).forEach(optionGroup => {
        // For radio buttons, select the first option by default
        if (product.options[optionGroup].type === 'radio' && product.options[optionGroup].items.length > 0) {
          initialOptions[optionGroup] = product.options[optionGroup].items[0].id;
        }
        // For checkboxes, initialize with empty array
        else if (product.options[optionGroup].type === 'checkbox') {
          initialOptions[optionGroup] = [];
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  // Calculate total price based on selected options and quantity
  useEffect(() => {
    let basePrice = product.price;
    
    // Add option prices
    if (product.options) {
      Object.keys(selectedOptions).forEach(optionGroup => {
        const options = product.options[optionGroup];
        
        // For radio buttons
        if (options.type === 'radio') {
          const selectedOption = options.items.find(item => item.id === selectedOptions[optionGroup]);
          if (selectedOption && selectedOption.price) {
            basePrice += selectedOption.price;
          }
        }
        // For checkboxes
        else if (options.type === 'checkbox') {
          selectedOptions[optionGroup].forEach(selectedId => {
            const selectedOption = options.items.find(item => item.id === selectedId);
            if (selectedOption && selectedOption.price) {
              basePrice += selectedOption.price;
            }
          });
        }
      });
    }
    
    setTotalPrice(basePrice * quantity);
  }, [selectedOptions, quantity, product]);

  // Handle radio button change
  const handleRadioChange = (optionGroup, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [optionGroup]: optionId
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (optionGroup, optionId) => {
    const currentSelections = selectedOptions[optionGroup] || [];
    let newSelections;
    
    if (currentSelections.includes(optionId)) {
      newSelections = currentSelections.filter(id => id !== optionId);
    } else {
      newSelections = [...currentSelections, optionId];
    }
    
    setSelectedOptions({
      ...selectedOptions,
      [optionGroup]: newSelections
    });
  };

  // Format selected options for cart
  const formatSelectedOptions = () => {
    const selectedOptionsFormatted = {};
    
    if (product.options) {
      Object.keys(selectedOptions).forEach(optionGroup => {
        const options = product.options[optionGroup];
        
        // For radio buttons
        if (options.type === 'radio') {
          const selectedOption = options.items.find(item => item.id === selectedOptions[optionGroup]);
          if (selectedOption) {
            selectedOptionsFormatted[optionGroup] = selectedOption.name;
          }
        }
        // For checkboxes
        else if (options.type === 'checkbox') {
          const selectedItems = selectedOptions[optionGroup].map(selectedId => {
            const option = options.items.find(item => item.id === selectedId);
            return option ? option.name : '';
          }).filter(Boolean);
          
          if (selectedItems.length > 0) {
            selectedOptionsFormatted[optionGroup] = selectedItems;
          }
        }
      });
    }
    
    return selectedOptionsFormatted;
  };

  // Add to cart
  const handleAddToCart = () => {
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: totalPrice / quantity, // Price per item with options
      quantity: quantity,
      image: product.image || '',
      options: formatSelectedOptions()
    }));
    
    onClose();
  };

  // Find related products
  const relatedProducts = menuItems
    .filter(item => 
      item.id !== product.id && 
      (item.category === product.category || item.tags?.some(tag => product.tags?.includes(tag)))
    )
    .slice(0, 3);

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
                <ArrowLeft className="h-6 w-6 text-orange-600" />
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
              <ShoppingCart className="h-6 w-6 text-orange-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
              <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                <span className="text-6xl font-bold text-orange-600">
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
              <p className="text-xl font-bold text-orange-600 mb-2">${product.price.toFixed(2)}</p>
              
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

              {/* Category */}
              {product.category && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Category</h3>
                  <p className="text-gray-700">{product.category}</p>
                </div>
              )}
              
              {/* Subcategory */}
              {product.subCategory && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Subcategory</h3>
                  <p className="text-gray-700">{product.subCategory}</p>
                </div>
              )}

              {/* Options */}
              {product.options && Object.keys(product.options).map(optionGroup => (
                <div key={optionGroup} className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    {product.options[optionGroup].name}
                    {product.options[optionGroup].required && (
                      <span className="text-orange-600 ml-1">*</span>
                    )}
                  </h3>
                  
                  <div className="space-y-2">
                    {product.options[optionGroup].type === 'radio' ? (
                      // Radio buttons
                      product.options[optionGroup].items.map(option => (
                        <div key={option.id} className="flex items-center">
                          <input
                            type="radio"
                            id={`${optionGroup}-${option.id}`}
                            name={optionGroup}
                            checked={selectedOptions[optionGroup] === option.id}
                            onChange={() => handleRadioChange(optionGroup, option.id)}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-400"
                          />
                          <label htmlFor={`${optionGroup}-${option.id}`} className="ml-2 text-gray-700">
                            {option.name}
                            {option.price > 0 && ` (+$${option.price.toFixed(2)})`}
                          </label>
                        </div>
                      ))
                    ) : (
                      // Checkboxes
                      product.options[optionGroup].items.map(option => (
                        <div key={option.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${optionGroup}-${option.id}`}
                            checked={selectedOptions[optionGroup]?.includes(option.id)}
                            onChange={() => handleCheckboxChange(optionGroup, option.id)}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-400 rounded"
                          />
                          <label htmlFor={`${optionGroup}-${option.id}`} className="ml-2 text-gray-700">
                            {option.name}
                            {option.price > 0 && ` (+$${option.price.toFixed(2)})`}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
              
              {/* Price, Quantity Controls, and Add to Cart - Only visible on desktop */}
              <div className="hidden md:flex justify-between items-center mt-6">
                <div className="flex items-center">
                  <p className="font-bold text-xl text-orange-600 mr-4">
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
                  onClick={handleAddToCart}
                  className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors font-medium"
                >
                  Add to Order
                </button>
              </div>
            </div>
            
            {/* Right Side - You May Also Like */}
            <div className="flex flex-col">
              {/* You May Also Like - Only visible on desktop for right side */}
              <div className="p-6 border-t border-gray-100 mt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
                  <Heart className="h-4 w-4 text-orange-600 mr-2" /> You May Also Like
                </h3>
                <div className="space-y-3">
                  {relatedProducts.map(item => (
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
                          <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                            <span className="text-xl font-bold text-orange-600">
                              {item.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-orange-600 text-xs">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                      </div>
                    </div>
                  ))}
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
            <p className="font-bold text-xl text-orange-600">
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
            onClick={handleAddToCart}
            className="w-full bg-orange-600 text-white py-3 rounded-full hover:bg-orange-700 transition-colors font-medium"
          >
            Add to Order
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InDiningProductDetails;
