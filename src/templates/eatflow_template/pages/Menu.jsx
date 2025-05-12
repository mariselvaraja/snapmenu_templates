import React, { useState, useEffect, useMemo } from 'react';
import { UtensilsCrossed, Search, ChevronDown, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { motion } from 'framer-motion';

const MenuItem = ({ item }) => {
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  
  const cartItem = cart.find(cartItem => cartItem.id === item.id);
  
  const handleViewDetails = () => {
    // Navigate to product details page with the correct ID
    navigate(`/product/${item.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name,
      price: typeof item.price === 'number' ? item.price?.toFixed(2) : item.price.toString(),
      imageUrl: item.image,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div 
        className="relative cursor-pointer" 
        onClick={handleViewDetails}
      >
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-6xl font-bold text-green-500">
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
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-xl font-bold cursor-pointer hover:text-green-600 transition"
            onClick={handleViewDetails}
          >
            {item.name}
          </h3>
          <span className="text-lg font-bold text-green-600">${typeof item.price === 'number' ? item.price?.toFixed(2) : item.price}</span>
        </div>
        <p 
          className="text-gray-600 mb-4 line-clamp-2 cursor-pointer hover:text-gray-800 transition"
          onClick={handleViewDetails}
        >
          {item.description}
        </p>
        <div className="flex items-center justify-end">
          {!cartItem || Number(cartItem.quantity) === 0 ? (
            <button
              className="inline-flex items-center bg-green-500 text-white px-5 py-2 hover:bg-green-600 transition text-base font-medium"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
          ) : (
            <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
              <button
                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  if (Number(cartItem.quantity) > 1) {
                    updateQuantity(item.id, Number(cartItem.quantity) - 1);
                  } else {
                    removeFromCart(item.id);
                  }
                }}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="mx-3 text-base font-semibold">{cartItem.quantity}</span>
              <button
                className="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(item.id, Number(cartItem.quantity) + 1);
                }}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function Menu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Get menu items from Redux
  const { items: menuItems, loading, error } = useAppSelector(state => state.menu);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false
  });
  const [filteredItems, setFilteredItems] = useState([]);

  // Transform menu data into categories format with subcategories
  const processMenuData = () => {
    // Group menu items by category
    const categoriesMap = {};
    
    menuItems.forEach(item => {
      const category = item.category || 'other';
      if (!categoriesMap[category]) {
        categoriesMap[category] = {
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          items: []
        };
      }
      categoriesMap[category].items.push(item);
    });
    
    // Convert map to array
    const categories = Object.values(categoriesMap);

    // Extract subcategories for each category
    categories.forEach(category => {
      const subcategories = new Set();
      category.items.forEach(item => {
        if (item.subCategory) {
          subcategories.add(item.subCategory);
        }
      });
      category.subcategories = Array.from(subcategories).map(subCat => ({
        id: subCat,
        name: subCat.charAt(0).toUpperCase() + subCat.slice(1).replace('-', ' ')
      }));
    });

    return categories;
  };
  
  const categories = useMemo(() => processMenuData(), [menuItems]);

  // Apply filters to menu items
  useEffect(() => {
    let items = [];
    
    // Get items based on category selection
    if (activeCategory === 'all') {
      // Get all items from all categories
      categories.forEach(category => {
        items = [...items, ...category.items];
      });
    } else {
      // Get items from selected category
      const category = categories.find(cat => cat.id === activeCategory);
      if (category) {
        items = [...category.items];
      }
    }
    
    // Filter by subcategory if not 'all'
    if (activeSubCategory !== 'all') {
      items = items.filter(item => item.subCategory === activeSubCategory);
    }
    
    // Apply search term filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term) ||
        (item.ingredients && item.ingredients.some(ing => ing.toLowerCase().includes(term)))
      );
    }
    
    // Apply dietary filters
    if (dietaryFilters.vegetarian) {
      items = items.filter(item => item.dietary?.isVegetarian);
    }
    if (dietaryFilters.vegan) {
      items = items.filter(item => item.dietary?.isVegan);
    }
    if (dietaryFilters.glutenFree) {
      items = items.filter(item => item.dietary?.isGlutenFree);
    }
    
    // Sort items
    if (sortBy === 'price-asc') {
      items.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      items.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return priceB - priceA;
      });
    }
    
    setFilteredItems(items);
  }, [activeCategory, activeSubCategory, searchTerm, dietaryFilters, sortBy, menuItems, categories]);
  
  // Reset subcategory when category changes
  useEffect(() => {
    setActiveSubCategory('all');
  }, [activeCategory]);
  
  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsNavSticky(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Toggle dietary filter
  const toggleDietaryFilter = (filter) => {
    setDietaryFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    menuSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Menu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1543352634-99a5d50ae78e?auto=format&fit=crop&q=80"
            alt="Menu background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center text-center"
        >
          <div>
            <div className="flex justify-center mb-6">
              <UtensilsCrossed className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
              Our Menu
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover our selection of healthy and delicious meals
            </p>
            <button 
              onClick={scrollToMenu}
              className="mt-8 p-4 rounded-full bg-green-500/20 hover:bg-green-500/30 transition group"
            >
              <ChevronDown className="w-8 h-8 text-green-400 animate-bounce" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Sticky Navigation with Categories */}
      <div className={`sticky top-0 z-20 transition-all duration-300 ${
        isNavSticky ? 'bg-white shadow-lg' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-6 py-4">
          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 shadow-md border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-shadow duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex overflow-x-auto space-x-4 py-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1 text-sm font-medium transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-1 text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'text-green-500 border-b-2 border-green-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Subcategory and Dietary Filters */}
      {(activeCategory !== 'all' && categories.find(cat => cat.id === activeCategory)?.subcategories?.length > 0) || true ? (
        <div className="bg-white border-t border-gray-200 py-3 z-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-3 items-center">
              {/* Subcategory Filters - Only show if a specific category is selected */}
              {activeCategory !== 'all' && categories.find(cat => cat.id === activeCategory)?.subcategories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mr-4">
                  <span className="text-sm font-medium text-gray-500">Subcategory:</span>
                  <button
                    onClick={() => setActiveSubCategory('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeSubCategory === 'all'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    All
                  </button>
                  {categories.find(cat => cat.id === activeCategory)?.subcategories.map((subCat) => (
                    <button
                      key={subCat.id}
                      onClick={() => setActiveSubCategory(subCat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeSubCategory === subCat.id
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {subCat.name}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Dietary Filters */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-500">Dietary:</span>
                <button
                  onClick={() => toggleDietaryFilter('vegetarian')}
                  className={`flex items-center px-3 py-1 rounded-full text-xs ${
                    dietaryFilters.vegetarian
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  Vegetarian
                </button>
                <button
                  onClick={() => toggleDietaryFilter('vegan')}
                  className={`flex items-center px-3 py-1 rounded-full text-xs ${
                    dietaryFilters.vegan
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  Vegan
                </button>
                <button
                  onClick={() => toggleDietaryFilter('glutenFree')}
                  className={`flex items-center px-3 py-1 rounded-full text-xs ${
                    dietaryFilters.glutenFree
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  Gluten-Free
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Menu Items */}
      <section id="menu-section" className="py-16">
        <div className="container mx-auto px-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-500">No menu items match your filters</p>
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setActiveSubCategory('all');
                  setSearchTerm('');
                  setDietaryFilters({vegetarian: false, vegan: false, glutenFree: false});
                }}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : activeCategory === 'all' && activeSubCategory === 'all' && !searchTerm && 
             !dietaryFilters.vegetarian && !dietaryFilters.vegan && !dietaryFilters.glutenFree ? (
            // Display all categories with their items (no filters active)
            <div className="space-y-20">
              {categories.map((category) => (
                <div key={category.id}>
                  <h2 className="text-4xl font-bold mb-12 text-center">{category.name}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.items.map((item) => (
                      <MenuItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Display filtered items
            <div>
              <h2 className="text-4xl font-bold mb-12 text-center">
                {activeCategory !== 'all' 
                  ? categories.find(cat => cat.id === activeCategory)?.name 
                  : 'Menu Items'}
                {activeSubCategory !== 'all' && activeCategory !== 'all' && (
                  <span className="text-green-500"> - {categories.find(cat => cat.id === activeCategory)
                    ?.subcategories.find(sub => sub.id === activeSubCategory)?.name}</span>
                )}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <div className="relative py-32 bg-gray-900">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80"
            alt="CTA background"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto text-center px-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Order?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Visit one of our locations or order online for pickup. Experience the authentic taste of healthy eating today.
          </p>
          <button className="bg-green-500 text-white px-8 py-4 hover:bg-green-600 transition text-lg font-semibold">
            Order Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}
