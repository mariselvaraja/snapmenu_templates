import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../../../common/redux';
import _ from 'lodash';

export function MenuCategories() {
  // Get menu data from Redux store instead of useMenu hook
  const { items, categories, loading, error } = useAppSelector(state => state.menu);

  const getCategory = () => {
    const category = items.map((item, index) => ({
      id: index,
      name: item.level1_category,
    }));
    return _.uniqBy(category, 'name');
  };

  const getSubcategory = (item_category)=>{
    const subCategory = _.map(
      _.filter(items, item => _.toLower(item?.level1_category) === _.toLower(item_category)),
      'level2_category'
    );
    return _.uniq(subCategory);
  }

  // Transform Redux menu data to match the expected format
  const menuData = {
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
    if (!menuData.menu[item.category]) {
      menuData.menu[item.category] = [];
    }
    menuData.menu[item.category].push(item);
  });

  // Early return if menu is not loaded
  if (loading || !menuData?.categories || menuData.categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Loading menu categories...</div>
      </div>
    );
  }

  // Show error if there was a problem loading the menu
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Error loading menu: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif mb-6 text-white">Our Menu</h1>
        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg blur opacity-25"></div>
          <div className="relative bg-gray-900 px-8 py-6 rounded-lg border border-gray-800">
            <p className="text-xl font-serif text-gray-300 italic max-w-3xl mx-auto leading-relaxed">
              Explore our carefully curated selection of dishes, where traditional techniques meet contemporary innovation
            </p>
            <div className="absolute left-1/2 -bottom-3 w-24 h-1 bg-orange-500 transform -translate-x-1/2"></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {getCategory().map((category) => (
          <Link
            key={category.id}
            to={`/menu/${category.id}`}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-[16/9] overflow-hidden bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center">
              <span className="text-8xl font-serif text-white opacity-80">
                {category.name.charAt(0)}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl font-serif mb-2 group-hover:text-orange-400 transition-colors">
                {category.name}
              </h2>
              {/* Container for subcategory badges */}
              <div className="flex flex-row flex-wrap gap-2 mt-2">
                {getSubcategory(category.name).map((sub) => (
                  <div
                    key={sub} // Use sub directly as key since it's a unique string
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation if clicking badge
                      window.location.href = `/menu/${category?.id}?subCategory=${sub}`;
                    }}
                    className="text-sm px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
                    role="button"
                    tabIndex={0} // Keep focusable
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault(); // Prevent link navigation/default space behavior
                        window.location.href = `/menu/${category?.id}?subCategory=${sub}`;
                      }
                    }}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
