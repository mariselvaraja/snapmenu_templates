import React from 'react';
import { motion } from 'framer-motion';
import { Plus, UtensilsCrossed, Wine } from 'lucide-react';
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';
import { CiWheat } from 'react-icons/ci';
import { GoDotFill } from 'react-icons/go';

interface MenuItemsListProps {
  items: any[];
  currentMenuType: string;
  loading: boolean;
  selectedCategory: string;
  onProductClick: (product: any) => void;
  onAddClick: (product: any) => void;
  onResetCategory: () => void;
}

export default function MenuItemsList({
  items,
  currentMenuType,
  loading,
  selectedCategory,
  onProductClick,
  onAddClick,
  onResetCategory
}: MenuItemsListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading menu items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <UtensilsCrossed className="h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Items Available</h3>
          <p className="text-gray-600 mb-8 px-4">
            There are no items available in the "{selectedCategory}" category at the moment.
          </p>
          <button
            onClick={onResetCategory}
            className="px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center mx-auto"
          >
            View All Menu Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {items.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-row"
        >
          <div className="relative w-1/3">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-[200px] w-full object-cover cursor-pointer"
                onClick={() => onProductClick(item)}
              />
            ) : (
              <div 
                className="w-full bg-red-100 flex items-center justify-center cursor-pointer h-[200px]"
                onClick={() => onProductClick(item)}
              >
                <span className="text-4xl font-bold text-red-500">
                  {item.name.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Dietary Information Icons */}
            {item.dietary && (
              <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
                {item.dietary.isVegetarian && (
                  <div className="bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center">
                    <IoLeafOutline className="w-4 h-4" />
                  </div>
                )}
                {item.dietary.isVegan && (
                  <div className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center">
                    <LuVegan className="w-4 h-4" />
                  </div>
                )}
                {item.dietary.isGlutenFree && (
                  <div className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center">
                    <CiWheat className="w-4 h-4" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
            {/* Product name */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {currentMenuType === "drinks" ? (
                  <Wine className='w-5 h-5 text-red-500' />
                ) : (
                  item.dietary && (item.dietary.isVegetarian || item.dietary.isVegan) ? (
                    <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-green-600 flex-shrink-0">
                      <GoDotFill className="w-2 h-2 text-green-600" />
                    </div>
                  ) : (
                    <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-red-600 flex-shrink-0">
                      <GoDotFill className="w-2 h-2 text-red-600" />
                    </div>
                  )
                )}
                <h3 
                  className="text-lg sm:text-xl font-semibold cursor-pointer hover:text-red-500"
                  onClick={() => onProductClick(item)}
                >
                  {item.name}
                </h3>
              </div>
            </div>
            
            {/* Description (for food items) */}
            {currentMenuType === "food" && (
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 overflow-hidden cursor-pointer hover:text-gray-800"
                onClick={() => onProductClick(item)}
              >
                {item.description}
              </p>
            )}
            
            {/* Price badges for drinks */}
            {currentMenuType === "drinks" && item?.prices && Array.isArray(item.prices) && item.prices.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {item.prices.map((priceOption: any, index: number) => (
                    <div 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-[8px] sm:text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                    >
                      <span className="font-semibold">{priceOption.name}</span>&nbsp;-
                      <span className="ml-1">${parseFloat(priceOption.price) || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Price and Add button */}
            <div className="flex justify-between items-center mt-auto">
              <p className="text-lg font-bold text-red-500">
                ${(() => {
                  if (currentMenuType === "drinks" && item?.prices && Array.isArray(item.prices) && item.prices.length > 0) {
                    return parseFloat(item.prices[0].price) || 0;
                  }
                  return item?.indining_price || 0.00;
                })()}
              </p>
             
              {(item?.out_of_stock === "true" || item?.inventory_status === false) ? (
                <div className="px-4 sm:px-6 py-2 rounded-full bg-gray-200 text-gray-600 text-sm sm:text-base font-medium">
                  Out of Stock
                </div>
              ) : (
                <button 
                  onClick={() => onAddClick(item)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base"
                >
                  Add <Plus className={currentMenuType === "drinks" ? 'w-5 h-5' : ''}/>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
