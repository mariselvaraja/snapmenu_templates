import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext, CartContextType, useCart } from '../context/CartContext';
import { ArrowRight, ArrowLeft, ShoppingCart, Info, Tag, Box, Utensils, AlertTriangle, Heart, Minus, Plus } from 'lucide-react';
import { useAppSelector } from '../../../redux/hooks';
import { motion } from 'framer-motion';
import { TbCategory2 } from 'react-icons/tb';

// Define our own interface to avoid conflicts with imported types
interface ProductItem {
  id: string;
  name: string;
  price: string | number;
  image: string;
  description: string;
  category?: string;
  subCategory?: string;
  supplier?: string;
  brand?: string;
  unit?: string;
  external_id?: string;
  bar_code?: string;
  appearance?: string;
  serving?: string;
  flavors?: string;
  variations?: string;
  comment?: string;
  calories?: string | number;
  nutrients?: {
    protein?: string;
    carbs?: string;
    fat?: string;
    sat?: string;
    unsat?: string;
    trans?: string;
    sugar?: string;
    fiber?: string;
    [key: string]: string | undefined;
  };
  dietary?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
  };
  allergens?: string[];
  ingredients?: string[];
  pairings?: string[];
  best_combo?: string;
  tags?: string[];
}

function ProductDetails() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity } = useContext(CartContext) as CartContextType;
  const { toggleCart } = useCart();
  
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  const { items: menuItems, loading, error } = useAppSelector(state => state.menu);
  
  // Find if product is already in cart
  const cartItem = cart.find(item => item.id === itemId);
  
  // Initialize quantity state with cart quantity if product is in cart, otherwise 1
  const [quantity, setQuantity] = useState(cartItem ? Number(cartItem.quantity) : 1);
  
  // Update quantity if cart changes
  useEffect(() => {
    const updatedCartItem = cart.find(item => item.id === itemId);
    if (updatedCartItem) {
      setQuantity(Number(updatedCartItem.quantity));
    }
  }, [cart, itemId]);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};

  // Find the product in the menu data
  const menuItem = menuItems?.find((item: any) => item.id.toString() === itemId);
  
  // Cast to our ProductItem interface to access our custom properties
  const product = menuItem as unknown as ProductItem;

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
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Back button skeleton */}
          <div className="h-10 w-32 bg-zinc-800 rounded-full animate-pulse mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* You May Also Like skeleton on LHS */}
            <div className="md:col-span-1">
              <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden shadow-sm">
                    <div className="flex items-center p-2">
                      <div className="w-16 h-16 bg-zinc-800 rounded-md mr-3 animate-pulse"></div>
                      <div>
                        <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse mb-2"></div>
                        <div className="h-3 w-12 bg-zinc-800 rounded animate-pulse"></div>
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
                  <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-2"></div>
                  <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 w-20 bg-zinc-800 rounded-full animate-pulse"></div>
                    <div className="h-6 w-16 bg-zinc-800 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-4 w-full bg-zinc-800 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-full bg-zinc-800 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse mb-6"></div>
                  
                  {/* Add to cart button skeleton */}
                  <div className="w-full h-12 bg-zinc-800 rounded-full animate-pulse mb-6"></div>
                </div>
                <div className="md:w-1/2 mt-4 md:mt-0">
                  <div className="w-full h-64 bg-zinc-800 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Product Details section skeleton */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="h-6 w-6 bg-zinc-800 rounded-full animate-pulse mr-2"></div>
                  <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b border-zinc-800 pb-3">
                      <div className="flex items-center mb-1">
                        <div className="h-4 w-4 bg-zinc-800 rounded-full animate-pulse mr-2"></div>
                        <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
                      </div>
                      <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse ml-6"></div>
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
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Product</h1>
          <p className="text-xl text-yellow-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-300 transition-colors"
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
      <div className="min-h-screen bg-black text-white py-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Product Not Found</h2>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/menu" className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-[120px]">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={() => navigate('/menu')}
          className="inline-flex items-center mb-8 bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* You May Also Like section on LHS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-yellow-400" />
              You May Also Like
            </h2>
            <div className="space-y-4">
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
                    .filter((item: any) => item.id.toString() !== itemId)
                    .slice(0, 5);
                }
                
                return recommendedItems.map((item: any) => (
                  <div 
                    key={item.id} 
                    className="bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
                        <div className="w-16 h-16 bg-zinc-800 flex items-center justify-center rounded-md mr-3">
                          <span className="text-xl font-bold text-yellow-400">
                            {item.name && item.name.length > 0 
                              ? item.name.charAt(0).toUpperCase() 
                              : 'M'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-yellow-400 text-xs">${typeof item.price === 'number' ? item.price?.toFixed(2) : item.price}</p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </motion.div>

          {/* Product Details on RHS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-3"
          >
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
                <p className="text-gray-300 mb-6">{product.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-yellow-400">${typeof product.price === 'number' ? product.price?.toFixed(2) : product.price}</div>
                  
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
                      className="inline-flex items-center bg-yellow-400 text-black px-5 py-2 rounded-full hover:bg-yellow-300 transition-colors text-base font-medium"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="inline-flex items-center bg-zinc-900 rounded-full px-2 py-1">
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"
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
                        className="w-8 h-8 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black rounded-full transition-colors"
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
                    <div className="w-full h-64 bg-zinc-800 flex items-center justify-center">
                      <span className="text-6xl font-bold text-yellow-400">
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
                  <Info className="h-5 w-5 mr-2 text-yellow-400" />
                  Product Details
                </h2>
                <div className="space-y-4">
                  {product.category && (
                    <div className="border-b border-zinc-800 pb-3">
                      <div className="flex items-center mb-1">
                        <Tag className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-300">Category</span>
                      </div>
                      <div className="text-white pl-6">{product.category}</div>
                    </div>
                  )}
                  {product.subCategory && (
                    <div className="border-b border-zinc-800 pb-3">
                      <div className="flex items-center mb-1">
                        <TbCategory2 className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-300">Subcategory</span>
                      </div>
                      <div className="text-white pl-6">{product.subCategory}</div>
                    </div>
                  )}
                  {product.supplier && (
                    <div className="border-b border-zinc-800 pb-3">
                      <div className="flex items-center mb-1">
                        <Box className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-300">Supplier</span>
                      </div>
                      <div className="text-white pl-6">{product.supplier}</div>
                    </div>
                  )}
                  {product.brand && (
                    <div className="border-b border-zinc-800 pb-3">
                      <div className="flex items-center mb-1">
                        <Box className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-300">Brand</span>
                      </div>
                      <div className="text-white pl-6">{product.brand}</div>
                    </div>
                  )}
                  {product.unit && (
                    <div className="border-b border-zinc-800 pb-3">
                      <div className="flex items-center mb-1">
                        <Box className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-300">Unit</span>
                      </div>
                      <div className="text-white pl-6">{product.unit}</div>
                    </div>
                  )}
                  {product.serving && (
                    <div className="border-b border-zinc-800 pb-3">
                      <div className="flex items-center mb-1">
                        <Utensils className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-300">Serving</span>
                      </div>
                      <div className="text-white pl-6">{product.serving}</div>
                    </div>
                  )}
                  {product.flavors && (
                    <div className="border-b border-zinc-800 pb-3">
                      <div className="flex items-center mb-1">
                        <Heart className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-300">Flavors</span>
                      </div>
                      <div className="text-white pl-6">{product.flavors}</div>
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
                  <Utensils className="h-5 w-5 mr-2 text-yellow-400" />
                  Nutritional Information
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {product.calories && (
                    <div className="bg-zinc-800 p-2 rounded">
                      <span className="text-xs text-gray-400">Calories</span>
                      <p className="font-medium">{product.calories.toString()} kcal</p>
                    </div>
                  )}
                  {product.nutrients?.protein && (
                    <div className="bg-zinc-800 p-2 rounded">
                      <span className="text-xs text-gray-400">Protein</span>
                      <p className="font-medium">{product.nutrients.protein}</p>
                    </div>
                  )}
                  {product.nutrients?.carbs && (
                    <div className="bg-zinc-800 p-2 rounded">
                      <span className="text-xs text-gray-400">Carbs</span>
                      <p className="font-medium">{product.nutrients.carbs}</p>
                    </div>
                  )}
                  {product.nutrients?.fat && (
                    <div className="bg-zinc-800 p-2 rounded">
                      <span className="text-xs text-gray-400">Fat</span>
                      <p className="font-medium">{product.nutrients.fat}</p>
                    </div>
                  )}
                  {product.nutrients?.fiber && (
                    <div className="bg-zinc-800 p-2 rounded">
                      <span className="text-xs text-gray-400">Fiber</span>
                      <p className="font-medium">{product.nutrients.fiber}</p>
                    </div>
                  )}
                  {product.nutrients?.sugar && (
                    <div className="bg-zinc-800 p-2 rounded">
                      <span className="text-xs text-gray-400">Sugar</span>
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
                  <Box className="h-5 w-5 mr-2 text-yellow-400" />
                  Ingredients
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span 
                      key={index} 
                      className="bg-zinc-800 text-white px-2 py-1 rounded-full text-xs"
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
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                  Allergens
                </h2>
                <div className="flex flex-wrap gap-2 pl-6">
                  {product.allergens.map((allergen, index) => (
                    <span 
                      key={index} 
                      className="bg-red-900/50 text-white px-3 py-1 rounded-full text-sm"
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
                  <Heart className="h-5 w-5 mr-2 text-yellow-400" />
                  Perfect Pairings
                </h2>
                <ul className="space-y-3 pl-6">
                  {product.pairings.map((pairing, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      <span className="text-gray-300">{pairing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
