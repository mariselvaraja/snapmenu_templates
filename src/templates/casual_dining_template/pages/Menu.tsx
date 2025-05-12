import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { motion } from 'framer-motion';
import { addItem } from '../../../redux/slices/cartSlice';
import { useCart } from '../context/CartContext';

interface MenuItem {
  id: string | number;
  name: string;
  description: string;
  price: string | number;
  image: string;
  category: string;
  subCategory?: string;
  calories?: number;
  nutrients?: {
    protein?: string;
    carbs?: string;
    fat?: string;
    sat?: string;
    unsat?: string;
    trans?: string;
    sugar?: string;
    fiber?: string;
  };
  dietary?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
  };
  allergens?: string[];
  ingredients?: string[];
  pairings?: string[];
  tags?: string[];
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Define types for category and subcategory
interface CategoryType {
  id: string;
  name: string;
  type: string;
}

interface SubCategoryType {
  id: string;
  name: string;
}

export function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [isNavSticky, setIsNavSticky] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToCart, toggleCart, cart, updateQuantity, removeFromCart } = useCart();
  
  // Get menu items from Redux
  const { items: menuItems, loading, error } = useAppSelector(state => state.menu);
  
  // Create categories array
  const categories: CategoryType[] = [
    { id: 'all', name: 'All', type: 'All' },
    ...Array.from(new Set(menuItems.map(item => item.category)))
      .map(category => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        type: category
      }))
  ];
  
  // Extract subcategories if available
  const subCategories: SubCategoryType[] = menuItems
    .filter(item => item.category === activeCategory.toLowerCase() && item.tags && item.tags.length > 0)
    .flatMap(item => item.tags || [])
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .map(tag => ({
      id: tag,
      name: tag.charAt(0).toUpperCase() + tag.slice(1)
    }));

  // Filter items based on selected category and subcategory
  const filteredItems = menuItems.filter(item => {
    if (activeCategory !== "All" && item.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
    if (selectedSubCategory !== "all" && (!item.tags || !item.tags.includes(selectedSubCategory))) return false;
    return true;
  });

  // Sort items based on selected sort option
  const sortedItems = [...filteredItems].sort((a, b) => {
    const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
    const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
    
    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    return 0;
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsNavSticky(scrollPosition > window.innerHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    menuSection?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleAddToCart = (menuItem: MenuItem) => {
    try {
      // Format item for CartContext
      addToCart({
        id: menuItem.id.toString(),
        name: menuItem.name,
        price: typeof menuItem.price === 'string' ? menuItem.price : menuItem.price.toString(),
        imageUrl: menuItem.image
      });
      
      // Open the cart drawer to show the added item
      toggleCart();
      
      console.log(`${menuItem.name} added to cart!`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  
  // Handle loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
            <p className="text-xl text-gray-400">
              Explore our selection of dishes
            </p>
          </div>

          {/* Skeleton for category buttons */}
          <div className="flex flex-col space-y-4 mb-12">
            <div className="flex flex-wrap gap-4 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-24 bg-zinc-800 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Skeleton for menu items grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
                {/* Skeleton for image */}
                <div className="w-full h-64 bg-zinc-800 animate-pulse"></div>
                <div className="p-6">
                  {/* Skeleton for title and price */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-zinc-800 rounded animate-pulse"></div>
                  </div>
                  {/* Skeleton for description */}
                  <div className="h-4 w-full bg-zinc-800 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-zinc-800 rounded mb-4 animate-pulse"></div>
                  {/* Skeleton for button */}
                  <div className="flex items-center justify-end">
                    <div className="h-10 w-32 bg-zinc-800 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Error Loading Menu</h1>
          <p className="text-xl text-yellow-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-300 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80"
            alt="Menu hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-full flex flex-col items-center justify-center px-6 text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">Our Menu</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12">
            Authentic Mexican street food made with fresh ingredients and traditional recipes
          </p>
          <button 
            onClick={scrollToMenu}
            className="mt-8 p-4 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 transition group"
          >
            <ChevronDown className="w-8 h-8 text-yellow-400 animate-bounce" />
          </button>
        </motion.div>
      </div>

      {/* Sticky Category Navigation */}
      <div className={`sticky top-0 z-50 transition-all duration-300 ${
        isNavSticky ? 'bg-black/90 backdrop-blur-lg shadow-xl' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col space-y-4">
            {/* Main Categories */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.type);
                    setSelectedSubCategory("all");
                  }}
                  className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                    activeCategory === category.type
                      ? "bg-yellow-400 text-black"
                      : "bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Sub Categories (if available) */}
            {subCategories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setSelectedSubCategory("all")}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedSubCategory === "all"
                      ? "bg-yellow-400 text-black"
                      : "bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50"
                  }`}
                >
                  All {activeCategory}
                </button>
                {subCategories.map((subCategory) => (
                  <button
                    key={subCategory.id}
                    onClick={() => setSelectedSubCategory(subCategory.id)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      selectedSubCategory === subCategory.id
                        ? "bg-yellow-400 text-black"
                        : "bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50"
                    }`}
                  >
                    {subCategory.name}
                  </button>
                ))}
              </div>
            )}
            
            {/* Sort Options */}
            <div className="flex justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section - Grid Layout */}
      <div id="menu-section" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedItems.map((item: MenuItem, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
            >
              <div 
                className="relative cursor-pointer" 
                onClick={() => navigate(`/product/${item.id}`)}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-zinc-800 flex items-center justify-center">
                    <span className="text-6xl font-bold text-yellow-400">
                      {item.name && item.name.length > 0 
                        ? item.name.charAt(0).toUpperCase() 
                        : 'M'}
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  {item.dietary?.isVegetarian && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      Vegetarian
                    </div>
                  )}
                  {item.dietary?.isVegan && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      Vegan
                    </div>
                  )}
                  {item.dietary?.isGlutenFree && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      GF
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 
                    className="text-xl font-bold cursor-pointer hover:text-yellow-400 transition"
                    onClick={() => navigate(`/menu/${item.id}`)}
                  >
                    {item.name}
                  </h3>
                </div>
                <p 
                  className="text-gray-400 mb-4 line-clamp-2 cursor-pointer hover:text-gray-300 transition"
                  onClick={() => navigate(`/menu/${item.id}`)}
                >
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-yellow-400">${typeof item.price === 'string' ? item.price : item.price?.toFixed(2)}</span>
                  
                  {/* Add button or quantity controls */}
                  {!cart.find(cartItem => cartItem.id === item.id.toString() && Number(cartItem.quantity) > 0) ? (
                    <button
                      className="inline-flex items-center bg-yellow-400 text-black px-5 py-2 rounded-full hover:bg-yellow-300 transition text-base font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="inline-flex items-center bg-zinc-900 rounded-full px-2 py-1">
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          const cartItem = cart.find(cartItem => cartItem.id === item.id.toString());
                          if (cartItem) {
                            const newQuantity = Number(cartItem.quantity) - 1;
                            if (newQuantity > 0) {
                              updateQuantity(item.id.toString(), newQuantity);
                            } else {
                              removeFromCart(item.id.toString());
                            }
                          }
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="mx-3 text-base font-semibold">
                        {cart.find(cartItem => cartItem.id === item.id.toString())?.quantity || 0}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          const cartItem = cart.find(cartItem => cartItem.id === item.id.toString());
                          if (cartItem) {
                            updateQuantity(item.id.toString(), Number(cartItem.quantity) + 1);
                          } else {
                            handleAddToCart(item);
                          }
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-32">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80"
            alt="CTA background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto text-center px-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Visit one of our locations or order online for pickup. Experience the authentic taste of Mexico today.
          </p>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition">
            Order Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}
