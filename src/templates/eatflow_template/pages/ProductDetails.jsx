import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowRight, ArrowLeft, ShoppingCart, Info, Tag, Box, Utensils, AlertTriangle, Heart, Minus, Plus } from 'lucide-react';
import { useAppSelector } from '../../../redux/hooks';

// Define our own interface to avoid conflicts with imported types
function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity, toggleCart } = useCart();
  
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  const { items: menuItems, loading, error } = useAppSelector(state => state.menu);
  
  // Find if product is already in cart
  const cartItem = cart.find(item => item.id === productId);
  
  // Initialize quantity state with cart quantity if product is in cart, otherwise 1
  const [quantity, setQuantity] = useState(cartItem ? Number(cartItem.quantity) : 1);
  const [isMobile, setIsMobile] = useState(false);
  const [isInDining, setIsInDining] = useState(false);
  const location = useLocation();
  
  // Check if we're in in-dining context
  useEffect(() => {
    setIsInDining(location.pathname.includes('placeindiningorder'));
  }, [location]);
  
  // Function to hide URL bar on mobile
  const hideUrlBar = () => {
    if (isMobile && isInDining) {
      window.scrollTo(0, 1);
    }
  };

  // Check if device is mobile and hide URL bar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Hide URL bar on load and resize
    window.addEventListener('load', hideUrlBar);
    window.addEventListener('resize', hideUrlBar);
    window.addEventListener('orientationchange', hideUrlBar);
    
    // Initial attempt to hide URL bar
    setTimeout(hideUrlBar, 100);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('load', hideUrlBar);
      window.removeEventListener('resize', hideUrlBar);
      window.removeEventListener('orientationchange', hideUrlBar);
    };
  }, [isInDining]);
  
  // Hide URL bar when component mounts and when orientation changes
  useEffect(() => {
    if (isMobile && isInDining) {
      hideUrlBar();
      // Try again after a short delay to ensure it works
      setTimeout(hideUrlBar, 300);
    }
  }, [isMobile, isInDining]);
  
  // Update quantity if cart changes
  useEffect(() => {
    const updatedCartItem = cart.find(item => item.id === productId);
    if (updatedCartItem) {
      setQuantity(Number(updatedCartItem.quantity));
    }
  }, [cart, productId]);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};

  // Find the product in the menu data
  const menuItem = menuItems?.find((item) => item.id.toString() === productId);
  
  // Cast to our ProductItem interface to access our custom properties
  const product = menuItem;

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // First add the item to the cart (this will set quantity to 1)
      addToCart({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'number' ? product.price?.toFixed(2) : product.price.toString(),
        imageUrl: product.image,
      });
      
      // Then update the quantity if it's more than 1
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
      
      toggleCart();
    }
  };
  
  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Back button skeleton */}
          <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* You May Also Like skeleton on LHS */}
            <div className="md:col-span-1">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <div className="flex items-center p-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 animate-pulse"></div>
                      <div>
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details skeleton on RHS */}
            <div className="md:col-span-3">
              {/* Product Header with Image on Right */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                <div className="md:pr-8 md:w-1/2">
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-6"></div>
                  
                  {/* Add to cart button skeleton */}
                  <div className="w-full h-12 bg-gray-200 rounded-full animate-pulse mb-6"></div>
                </div>
                <div className="md:w-1/2 mt-4 md:mt-0">
                  <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Product Details section skeleton */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b border-gray-200 pb-3">
                      <div className="flex items-center mb-1">
                        <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse ml-6"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Product</h1>
          <p className="text-xl text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Reload Page
          </button>
        </div>
      </div>
    );
  }
  
  // Handle product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-white text-gray-800 py-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Product Not Found</h2>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/menu" className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition">
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 py-[120px]">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={() => navigate('/menu')}
          className="inline-flex items-center mb-8 bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* You May Also Like section on LHS */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-green-500" />
              You May Also Like
            </h2>
            <div className="space-y-4">
              {(() => {
                // Extract best combo SKU IDs from the product
                let recommendedSkuIds = [];
                
                if (product.best_combo && typeof product.best_combo === 'string') {
                  try {
                    const bestCombo = JSON.parse(product.best_combo);
                    if (bestCombo.best_combo_ids) {
                      recommendedSkuIds = bestCombo.best_combo_ids
                        .split(',')
                        .map((id) => id.trim());
                    }
                  } catch (e) {
                    // If parsing fails, use empty array
                    recommendedSkuIds = [];
                  }
                }
                
                // Find items matching the recommended SKU IDs
                let recommendedItems = menuItems.filter((item) => 
                  item.sku_id && recommendedSkuIds.includes(item.sku_id)
                );
                
                // If no recommended items found, show random items
                if (recommendedItems.length === 0) {
                  recommendedItems = menuItems
                    .filter((item) => item.id.toString() !== productId)
                    .slice(0, 5);
                }
                
                return recommendedItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <div className="flex items-center p-2">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-md mr-3"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md mr-3">
                          <span className="text-xl font-bold text-green-500">
                            {item.name && item.name.length > 0 
                              ? item.name.charAt(0).toUpperCase() 
                              : 'M'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-green-500 text-xs">${typeof item.price === 'number' ? item.price?.toFixed(2) : item.price}</p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Product Details on RHS */}
          <div className="md:col-span-3">
            {/* Product Header with Image on Right */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div className="md:pr-8 md:w-1/2">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.dietary?.isVegetarian && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      Vegetarian
                    </div>
                  )}
                  {product.dietary?.isVegan && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      Vegan
                    </div>
                  )}
                  {product.dietary?.isGlutenFree && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      GF
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{product.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-green-500">${typeof product.price === 'number' ? product.price?.toFixed(2) : product.price}</div>
                  
                  {/* Dietary Information Badges */}
                  <div className="flex flex-wrap gap-2">
                    {product.dietary?.isVegetarian && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Vegetarian
                      </div>
                    )}
                    {product.dietary?.isVegan && (
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        Vegan
                      </div>
                    )}
                    {product.dietary?.isGlutenFree && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                        GF
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  {/* Add button or quantity controls */}
                  {!cartItem || Number(cartItem.quantity) === 0 ? (
                    <button
                      className="inline-flex items-center bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition-colors text-base font-medium"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors"
                        onClick={() => {
                          if (quantity > 1) {
                            updateQuantity(product.id, quantity - 1);
                            setQuantity(quantity - 1);
                          } else {
                            // Remove from cart if quantity becomes 0
                            updateQuantity(product.id, 0);
                            setQuantity(0);
                          }
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="mx-3 text-base font-semibold">{cartItem.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                        onClick={() => {
                          updateQuantity(product.id, quantity + 1);
                          setQuantity(quantity + 1);
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:w-1/2 mt-4 md:mt-0">
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-6xl font-bold text-green-500">
                        {product.name && product.name.length > 0 
                          ? product.name.charAt(0).toUpperCase() 
                          : 'M'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details section */}
            {(product.category || product.subCategory || product.supplier || product.brand || 
              product.unit || product.external_id || product.bar_code || product.appearance || 
              product.serving || product.flavors || product.variations || product.comment) && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-green-500" />
                  Product Details
                </h2>
                <div className="space-y-4">
                  {product.category && (
                    <div className="border-b border-gray-200 pb-3">
                      <div className="flex items-center mb-1">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700">Category</span>
                      </div>
                      <div className="text-gray-800 pl-6">{product.category}</div>
                    </div>
                  )}
                  {product.subCategory && (
                    <div className="border-b border-gray-200 pb-3">
                      <div className="flex items-center mb-1">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700">Subcategory</span>
                      </div>
                      <div className="text-gray-800 pl-6">{product.subCategory}</div>
                    </div>
                  )}
                  {product.supplier && (
                    <div className="border-b border-gray-200 pb-3">
                      <div className="flex items-center mb-1">
                        <Box className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700">Supplier</span>
                      </div>
                      <div className="text-gray-800 pl-6">{product.supplier}</div>
                    </div>
                  )}
                  {product.brand && (
                    <div className="border-b border-gray-200 pb-3">
                      <div className="flex items-center mb-1">
                        <Box className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700">Brand</span>
                      </div>
                      <div className="text-gray-800 pl-6">{product.brand}</div>
                    </div>
                  )}
                  {product.unit && (
                    <div className="border-b border-gray-200 pb-3">
                      <div className="flex items-center mb-1">
                        <Box className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700">Unit</span>
                      </div>
                      <div className="text-gray-800 pl-6">{product.unit}</div>
                    </div>
                  )}
                  {product.serving && (
                    <div className="border-b border-gray-200 pb-3">
                      <div className="flex items-center mb-1">
                        <Utensils className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700">Serving</span>
                      </div>
                      <div className="text-gray-800 pl-6">{product.serving}</div>
                    </div>
                  )}
                  {product.flavors && (
                    <div className="border-b border-gray-200 pb-3">
                      <div className="flex items-center mb-1">
                        <Heart className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700">Flavors</span>
                      </div>
                      <div className="text-gray-800 pl-6">{product.flavors}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Nutritional information section - Only show if nutritional data exists */}
            {(product.calories || 
              (product.nutrients && Object.values(product.nutrients).some(value => value !== undefined && value !== ''))) && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Utensils className="h-5 w-5 mr-2 text-green-500" />
                  Nutritional Information
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {product.calories && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500">Calories</span>
                      <p className="font-medium">{product.calories.toString()} kcal</p>
                    </div>
                  )}
                  {product.nutrients?.protein && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500">Protein</span>
                      <p className="font-medium">{product.nutrients.protein}</p>
                    </div>
                  )}
                  {product.nutrients?.carbs && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500">Carbs</span>
                      <p className="font-medium">{product.nutrients.carbs}</p>
                    </div>
                  )}
                  {product.nutrients?.fat && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500">Fat</span>
                      <p className="font-medium">{product.nutrients.fat}</p>
                    </div>
                  )}
                  {product.nutrients?.fiber && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500">Fiber</span>
                      <p className="font-medium">{product.nutrients.fiber}</p>
                    </div>
                  )}
                  {product.nutrients?.sugar && (
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-500">Sugar</span>
                      <p className="font-medium">{product.nutrients.sugar}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ingredients section */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Box className="h-5 w-5 mr-2 text-green-500" />
                  Ingredients
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens section */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-green-500" />
                  Allergens
                </h2>
                <div className="flex flex-wrap gap-2 pl-6">
                  {product.allergens.map((allergen, index) => (
                    <span 
                      key={index} 
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pairings section */}
            {product.pairings && product.pairings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-green-500" />
                  Perfect Pairings
                </h2>
                <ul className="space-y-3 pl-6">
                  {product.pairings.map((pairing, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-gray-700">{pairing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
