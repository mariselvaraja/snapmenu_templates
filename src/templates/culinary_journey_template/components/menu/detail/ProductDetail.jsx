import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Leaf, AlertTriangle } from 'lucide-react';
import { AddToCart } from '../../cart/AddToCart';
import { useAppSelector } from '../../../../../common/redux';

export function ProductDetail() {
  const { categoryId, itemId } = useParams();
  const navigate = useNavigate();
  
  // Get menu data from Redux store instead of useMenu hook
  const { items, categories, loading, error } = useAppSelector(state => state.menu);
  
  // Transform Redux menu data to match the expected format
  const menuData = useMemo(() => {
    const result = {
      menu: {},
      categories: categories.map(category => {
        // Handle case where category might be an object or a string
        if (typeof category === 'string') {
          return {
            id: category,
            name: category.charAt(0).toUpperCase() + category.slice(1)
          };
        } else if (typeof category === 'object' && category !== null) {
          // If category is already an object with id and name
          return {
            id: category.id || category.name || 'unknown',
            name: category.name || category.id || 'Unknown'
          };
        } else {
          // Fallback for unexpected category format
          return {
            id: 'unknown',
            name: 'Unknown'
          };
        }
      })
    };
    
    // Group items by category
    items.forEach(item => {
      if (!result.menu[item.category]) {
        result.menu[item.category] = [];
      }
      result.menu[item.category].push(item);
    });
    
    return result;
  }, [items, categories]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Loading product details...</div>
      </div>
    );
  }

  // Show error if there was a problem loading the menu
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Error loading product details: {error}</div>
      </div>
    );
  }
  
  const item = menuData.menu[categoryId]?.find(item => item.id === itemId);
  
  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-6">The item you're looking for doesn't exist.</p>
          <Link
            to={`/menu/${categoryId}`}
            className="inline-flex items-center text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  // Find paired items from the menu
  const pairedItems = item.pairings
    .map(pairingName => {
      for (const [catId, items] of Object.entries(menuData.menu)) {
        const found = items.find(menuItem => 
          menuItem.name.toLowerCase() === pairingName.toLowerCase()
        );
        if (found) return found;
      }
      return null;
    })
    .filter(Boolean);

  // Find similar items for "You May Also Like" section
  const similarItems = useMemo(() => {
    // First try to find items in the same category
    const categoryItems = menuData.menu[categoryId] || [];
    
    // Filter out the current item
    const sameCategoryItems = categoryItems
      .filter(menuItem => menuItem.id !== itemId);
    
    // If we have enough items in the same category, use those
    if (sameCategoryItems.length >= 3) {
      return sameCategoryItems.slice(0, 5);
    }
    
    // Otherwise, get items from all categories
    const allItems = [];
    for (const [catId, catItems] of Object.entries(menuData.menu)) {
      if (catId !== categoryId) {
        allItems.push(...catItems);
      }
    }
    
    // Combine items from the same category with random items from other categories
    const randomItems = allItems
      .sort(() => 0.5 - Math.random()) // Shuffle array
      .slice(0, 5 - sameCategoryItems.length);
    
    return [...sameCategoryItems, ...randomItems].slice(0, 5);
  }, [menuData.menu, categoryId, itemId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[100px]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Menu
      </button>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* You May Also Like section on LHS */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-serif mb-4 flex items-center">
            <span className="text-orange-500 mr-2">♥</span>
            You May Also Like
          </h2>
          <div className="space-y-4">
            {similarItems.length > 0 ? (
              similarItems.map(similarItem => (
                <div 
                  key={similarItem.id} 
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/menu/${similarItem.category}/${similarItem.id}`)}
                >
                  <div className="flex items-center p-2">
                    {similarItem.image ? (
                      <img 
                        src={similarItem.image} 
                        alt={similarItem.name} 
                        className="w-16 h-16 object-cover rounded-md mr-3"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-orange-100 flex items-center justify-center rounded-md mr-3">
                        <span className="text-xl font-bold text-orange-500">
                          {similarItem.name && similarItem.name.length > 0 
                            ? similarItem.name.charAt(0).toUpperCase() 
                            : 'P'}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif text-sm">{similarItem.name}</h3>
                      <p className="text-orange-600 text-xs">{similarItem.price}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm italic">
                No similar items found
              </div>
            )}
          </div>
        </div>

        {/* Product Details on RHS */}
        <div className="md:col-span-3">
          {/* Product Header with Image on Right */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div className="md:pr-8 md:w-1/2">
              <h1 className="text-4xl font-serif mb-2">{item.name}</h1>
              <p className="text-2xl text-orange-600 font-serif mb-4">{item.price}</p>
              {/* Dietary Information Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.dietary?.isVegetarian && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Leaf className="h-4 w-4 mr-1" />
                    Vegetarian
                  </div>
                )}
                {item.dietary?.isVegan && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Leaf className="h-4 w-4 mr-1" />
                    Vegan
                  </div>
                )}
                {item.dietary?.isGlutenFree && (
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    Gluten Free
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-6">{item.description}</p>
              <AddToCart item={item} />
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-orange-100 flex items-center justify-center">
                    <span className="text-6xl font-bold text-orange-500">
                      {item.name && item.name.length > 0 
                        ? item.name.charAt(0).toUpperCase() 
                        : 'P'}
                    </span>
                  </div>
                )}
                {(item.dietary?.isVegetarian || item.dietary?.isVegan) && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center">
                    <Leaf className="h-4 w-4 mr-1" />
                    {item.dietary.isVegan ? 'Vegan' : 'Vegetarian'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details section */}
          <div className="mb-8">
            <h2 className="text-xl font-serif mb-4 flex items-center">
              <span className="text-orange-500 mr-2">ℹ</span>
              Product Details
            </h2>
            <div className="space-y-4">
              {item.category && (
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-gray-700">Category</span>
                  </div>
                  <div className="text-gray-900 pl-6">{item.category}</div>
                </div>
              )}
              {item.subCategory && (
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-gray-700">Subcategory</span>
                  </div>
                  <div className="text-gray-900 pl-6">{item.subCategory}</div>
                </div>
              )}
              {item.supplier && (
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-gray-700">Supplier</span>
                  </div>
                  <div className="text-gray-900 pl-6">{item.supplier}</div>
                </div>
              )}
              {item.brand && (
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-gray-700">Brand</span>
                  </div>
                  <div className="text-gray-900 pl-6">{item.brand}</div>
                </div>
              )}
            </div>
          </div>

          {/* Nutritional information section - Only show if nutritional data exists */}
          {(item.calories || 
            (item.nutrients && Object.values(item.nutrients).some(value => value !== undefined && value !== ''))) && (
            <div className="mb-8">
              <h2 className="text-xl font-serif mb-4 flex items-center">
                <span className="text-orange-500 mr-2">🍽️</span>
                Nutritional Information
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {item.calories && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500">Calories</span>
                    <p className="font-medium">{item.calories} kcal</p>
                  </div>
                )}
                {item.nutrients?.protein && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500">Protein</span>
                    <p className="font-medium">{item.nutrients.protein}</p>
                  </div>
                )}
                {item.nutrients?.carbs && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500">Carbs</span>
                    <p className="font-medium">{item.nutrients.carbs}</p>
                  </div>
                )}
                {item.nutrients?.fat && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500">Fat</span>
                    <p className="font-medium">{item.nutrients.fat}</p>
                  </div>
                )}
                {item.nutrients?.fiber && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500">Fiber</span>
                    <p className="font-medium">{item.nutrients.fiber}</p>
                  </div>
                )}
                {item.nutrients?.sugar && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500">Sugar</span>
                    <p className="font-medium">{item.nutrients.sugar}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ingredients section */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-serif mb-4 flex items-center">
                <span className="text-orange-500 mr-2">🥗</span>
                Ingredients
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient, index) => (
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
          {item.allergens && item.allergens.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-serif mb-2 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Allergens
              </h2>
              <div className="flex flex-wrap gap-2 pl-6">
                {item.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pairings section */}
          {pairedItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-serif mb-6 flex items-center">
                <span className="text-orange-500 mr-2">♥</span>
                Perfect Pairings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pairedItems.map((pairedItem) => (
                  pairedItem && (
                    <div key={pairedItem.id} className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative flex items-center gap-4 bg-white p-4 rounded-lg border border-orange-100/50">
                        <Link
                          to={`/menu/${pairedItem.category}/${pairedItem.id}`}
                          className="flex items-center gap-4 flex-1"
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden">
                            <img
                              src={pairedItem.image}
                              alt={pairedItem.name}
                              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-serif group-hover:text-orange-600 transition-colors">
                              {pairedItem.name}
                            </h3>
                            <p className="text-sm text-gray-600">{pairedItem.price}</p>
                          </div>
                        </Link>
                        <AddToCart item={pairedItem} variant="compact" />
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
