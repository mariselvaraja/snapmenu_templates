import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  selectedSubcategory: string;
  uniqueCategories: string[];
  uniqueSubcategories: string[];
  filteredItemsCount: number;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  selectedSubcategory,
  uniqueCategories,
  uniqueSubcategories,
  filteredItemsCount,
  onCategoryChange,
  onSubcategoryChange
}) => {
  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    onSubcategoryChange('All');
  };

  const handleSubcategoryClick = (subcategory: string) => {
    onSubcategoryChange(subcategory);
  };

  return (
    <div className="sticky top-16 z-30">
      <div className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop View */}
          <div className="hidden sm:flex py-3 justify-between items-center">
            <div className="text-sm font-medium text-gray-700">
              Showing {filteredItemsCount} menu items
            </div>
            <div className="overflow-x-auto">
              <div className="flex space-x-2">
                {selectedCategory === 'All' ? (
                  <>
                    {/* All Category */}
                    <button
                      key="All"
                      onClick={() => handleCategoryClick('All')}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                        selectedCategory === 'All'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                      }`}
                    >
                      All
                    </button>
                    
                    {/* Main categories */}
                    {uniqueCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
                          selectedCategory === category
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        }`}
                      >
                        {category}
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {/* Show All Categories button */}
                    <button
                      onClick={() => handleCategoryClick('All')}
                      className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center bg-gray-300 text-gray-800 hover:bg-gray-400"
                    >
                      All
                    </button>
                    
                    {/* All Subcategories for selected category */}
                    <button
                      onClick={() => handleSubcategoryClick('All')}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                        selectedSubcategory === 'All'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                      }`}
                    >
                      All {selectedCategory}
                    </button>
                    
                    {/* Subcategories for selected category */}
                    {uniqueSubcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => handleSubcategoryClick(subcategory)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                          selectedSubcategory === subcategory
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile View */}
          <div className="sm:hidden py-2">
            <div className="overflow-x-auto">
              <div className="flex space-x-2">
                {selectedCategory === 'All' ? (
                  <>
                    {/* All Category */}
                    <button
                      key="All"
                      onClick={() => handleCategoryClick('All')}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                        selectedCategory === 'All'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                      }`}
                    >
                      All
                    </button>
                    
                    {/* Main categories - show all in mobile */}
                    {uniqueCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
                          selectedCategory === category
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        }`}
                      >
                        {category}
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {/* Show All Categories button */}
                    <button
                      onClick={() => handleCategoryClick('All')}
                      className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center bg-gray-300 text-gray-800 hover:bg-gray-400"
                    >
                       All 
                    </button>
                    
                    {/* All Subcategories for selected category */}
                    <button
                      onClick={() => handleSubcategoryClick('All')}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                        selectedSubcategory === 'All'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                      }`}
                    >
                      All {selectedCategory}
                    </button>
                    
                    {/* Subcategories for selected category */}
                    {uniqueSubcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => handleSubcategoryClick(subcategory)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
                          selectedSubcategory === subcategory
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
