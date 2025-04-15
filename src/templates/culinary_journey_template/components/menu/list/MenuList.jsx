import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MenuHeader } from '../common';
import { MenuItemCard } from './MenuItemCard';
import { getCategoryDescription } from '../../../utils/menuHelpers';
import { useAppSelector } from '../../../../../common/redux';

export function MenuList() {
  const { categoryId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subCategoryId = searchParams.get('subCategory');
  
  // Get menu data from Redux store instead of useMenu hook
  const { items, categories, loading, error } = useAppSelector(state => state.menu);
  
  // Transform Redux menu data to match the expected format
  const menuData = React.useMemo(() => {
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
        <div className="text-white">Loading menu items...</div>
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

  const category = menuData.categories.find(cat => cat.id === categoryId);
  
  // Get subcategories from menu items
  const subCategories = React.useMemo(() => {
    if (!categoryId || !menuData.menu[categoryId]) return [];
    
    // Extract unique subcategories from menu items
    const uniqueSubCategories = new Set();
    menuData.menu[categoryId].forEach(item => {
      if (item.subCategory) {
        uniqueSubCategories.add(item.subCategory);
      }
    });
    
    // Convert to array of objects
    return Array.from(uniqueSubCategories).map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')
    }));
  }, [categoryId, menuData.menu]);
  
  const subCategory = subCategories.find(sub => sub.id === subCategoryId);

  // Get items for the current category
  const categoryItems = menuData.menu[categoryId] || [];
  const filteredItems = subCategoryId
    ? categoryItems.filter(item => item.subCategory === subCategoryId)
    : categoryItems;

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Category not found</h2>
      </div>
    );
  }

  const title = subCategory ? `${category.name} - ${subCategory.name}` : category.name;
  const description = getCategoryDescription(categoryId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <MenuHeader
        title={title}
        description={description}
      />

      {/* Category navigation - only show if there are subcategories */}
      {subCategories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {subCategories.map((sub) => (
              <a
                key={sub.id}
                href={`/menu/${categoryId}?subCategory=${sub.id}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  sub.id === subCategoryId
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {sub.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Menu items grouped by subcategory */}
      {subCategoryId ? (
        // If a subcategory is selected, just show those items in a grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              categoryId={categoryId}
            />
          ))}
        </div>
      ) : (
        // If no subcategory is selected, group items by subcategory
        <div className="space-y-12">
          {(() => {
            // Group items by subcategory
            const groupedItems = {};
            
            // First, handle items without a subcategory
            const uncategorizedItems = categoryItems.filter(item => !item.subCategory);
            if (uncategorizedItems.length > 0) {
              groupedItems['uncategorized'] = uncategorizedItems;
            }
            
            // Then group the rest by subcategory
            categoryItems.forEach(item => {
              if (item.subCategory) {
                if (!groupedItems[item.subCategory]) {
                  groupedItems[item.subCategory] = [];
                }
                groupedItems[item.subCategory].push(item);
              }
            });
            
            // Render each subcategory group
            return Object.entries(groupedItems).map(([subCat, items]) => (
              <div key={subCat} className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-serif text-white">
                    {subCat === 'uncategorized' 
                      ? 'Other Items' 
                      : subCat.charAt(0).toUpperCase() + subCat.slice(1).replace(/-/g, ' ')}
                  </h2>
                  <div className="ml-4 h-px bg-orange-500 flex-grow"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      categoryId={categoryId}
                    />
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* No items message */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No items found in this category</p>
        </div>
      )}
    </div>
  );
}
