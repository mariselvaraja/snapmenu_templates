import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';

interface FoodMenuItemProps {
  item: any;
  onProductClick: (product: any) => void;
  onAddClick: (product: any) => void;
}

const FoodMenuItem: React.FC<FoodMenuItemProps> = ({ item, onProductClick, onAddClick }) => {
  const handleAddToCart = () => {
    onAddClick(item);
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      className="bg-white p-2 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50 transition-all"
    >
      {/* Image */}
      <div 
        className="relative w-16 h-16 flex-shrink-0 cursor-pointer"
        onClick={() => onProductClick(item)}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <div className="w-full h-full bg-red-100 flex items-center justify-center rounded-2xl">
            <span className="text-2xl font-bold text-red-500">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Dietary Icons */}
        {item.dietary && (
          <div className="absolute -top-1 -right-1 flex gap-0.5">
            {item.dietary.isVegetarian && (
              <div className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                <IoLeafOutline className="w-3 h-3" />
              </div>
            )}
            {item.dietary.isVegan && (
              <div className="bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                <LuVegan className="w-3 h-3" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 
          className="font-semibold text-gray-900 text-base cursor-pointer hover:text-red-500 truncate"
          onClick={() => onProductClick(item)}
        >
          {item.name}
        </h3>
        <p className="text-sm font-semibold text-red-500 mt-1">
          ${(parseFloat(item?.indining_price) || 0).toFixed(2)}
        </p>
      </div>

      {/* Add Button */}
      <div className="flex items-center">
        {(item?.out_of_stock == "true" || item?.inventory_status === false) ? (
          <div className="text-sm text-gray-500">Out of Stock</div>
        ) : (
          <button 
            onClick={handleAddToCart}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Add <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default FoodMenuItem;
