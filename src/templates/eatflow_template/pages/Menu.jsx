import React, { useState, useEffect, useMemo } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { UtensilsCrossed, Search, ChevronDown, ChevronUp, AlertCircle, Leaf, Wheat, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';

const MenuItem = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg group">
      <div className="flex">
        <div className="w-1/2 relative overflow-hidden" style={{ width: '200px', height: '200px' }}>
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition duration-500"></div>
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-semibold mb-2">{item.name}</h3>
              <div className="flex space-x-1">
                {item.dietary?.isVegetarian && <Leaf className="w-5 h-5 text-green-600" title="Vegetarian" />}
                {item.dietary?.isVegan && <Leaf className="w-5 h-5 text-green-800" title="Vegan" />}
                {item.dietary?.isGlutenFree && <Wheat className="w-5 h-5 text-amber-600" title="Gluten-Free" />}
              </div>
            </div>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>{item.calories} cal</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{item.subCategory}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold text-green-600">${item.price}</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-600 hover:text-green-600 transition flex items-center"
              >
                {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                <span className="ml-1">{showDetails ? 'Less' : 'More'}</span>
              </button>
              <button 
                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition text-sm font-medium"
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expandable details section */}
      {showDetails && (
        <div className="p-6 border-t border-gray-100 bg-gray-50 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Allergens */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                Allergens
              </h4>
              {item.allergens && item.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {item.allergens.map((allergen, index) => (
                    <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                      {allergen}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No allergens listed</p>
              )}
            </div>
            
            {/* Ingredients */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Ingredients</h4>
              {item.ingredients && item.ingredients.length > 0 ? (
                <ul className="text-sm text-gray-600 list-disc pl-5">
                  {item.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No ingredients listed</p>
              )}
            </div>
            
            {/* Pairings */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Pairs Well With</h4>
              {item.pairings && item.pairings.length > 0 ? (
                <ul className="text-sm text-gray-600 list-disc pl-5">
                  {item.pairings.map((pairing, index) => (
                    <li key={index}>{pairing}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No pairings listed</p>
              )}
            </div>
          </div>
          
          {/* Nutritional Information */}
          {item.nutrients && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Nutritional Information</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(item.nutrients).map(([key, value]) => 
                  value !== "0g" && (
                    <div key={key} className="text-center p-2 bg-white rounded-lg shadow-sm">
                      <span className="block text-xs text-gray-500">{key.toUpperCase()}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function Menu() {
  const { menu } = useMenu();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false
  });
  const [filteredItems, setFilteredItems] = useState([]);

  // Transform menu data into categories format with subcategories
  const processMenuData = () => {
    const categories = [];
    if (menu && menu.menu) {
      for (const categoryId in menu.menu) {
        if (menu.menu.hasOwnProperty(categoryId)) {
          const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
          categories.push({
            id: categoryId,
            name: categoryName,
            items: menu.menu[categoryId] || []
          });
        }
      }
    }

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
  
  const categories = useMemo(() => processMenuData(), [menu]);

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
    
    setFilteredItems(items);
  }, [activeCategory, activeSubCategory, searchTerm, dietaryFilters, menu, categories]);
  
  // Reset subcategory when category changes
  useEffect(() => {
    setActiveSubCategory('all');
  }, [activeCategory]);
  
  // Toggle dietary filter
  const toggleDietaryFilter = (filter) => {
    setDietaryFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

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
        
        <Navigation />

        <div className="relative z-10 container mx-auto px-6 h-[calc(50vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <UtensilsCrossed className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-8">
              Our Menu
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover our selection of healthy and delicious meals
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-0 z-30 bg-white ">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

            {/* Dietary Filters */}
            <div className="flex space-x-2">
              <button
                onClick={() => toggleDietaryFilter('vegetarian')}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  dietaryFilters.vegetarian
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <Leaf className="w-4 h-4 mr-1" />
                Vegetarian
              </button>
              <button
                onClick={() => toggleDietaryFilter('vegan')}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  dietaryFilters.vegan
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <Leaf className="w-4 h-4 mr-1" />
                Vegan
              </button>
              <button
                onClick={() => toggleDietaryFilter('glutenFree')}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  dietaryFilters.glutenFree
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <Wheat className="w-4 h-4 mr-1" />
                Gluten-Free
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-[70px] z-20 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto space-x-8 py-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`text-xl font-semibold whitespace-nowrap px-4 py-2 rounded-full transition-colors ${
                activeCategory === 'all'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-green-500'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`text-xl font-semibold whitespace-nowrap px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category.id
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Subcategory Tabs - Only show if a specific category is selected */}
      {activeCategory !== 'all' && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-6">
            <div className="flex overflow-x-auto space-x-4 py-3">
              <button
                onClick={() => setActiveSubCategory('all')}
                className={`text-sm font-medium whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
                  activeSubCategory === 'all'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                All {categories.find(cat => cat.id === activeCategory)?.name}
              </button>
              {categories.find(cat => cat.id === activeCategory)?.subcategories.map((subCat) => (
                <button
                  key={subCat.id}
                  onClick={() => setActiveSubCategory(subCat.id)}
                  className={`text-sm font-medium whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
                    activeSubCategory === subCat.id
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {subCat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <section className="py-16">
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
                  <div className="grid md:grid-cols-2 gap-8">
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
              <div className="grid md:grid-cols-2 gap-8">
                {filteredItems.map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
