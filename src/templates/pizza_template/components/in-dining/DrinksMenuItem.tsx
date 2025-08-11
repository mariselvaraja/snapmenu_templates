import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Wine } from 'lucide-react';

interface DrinksMenuItemProps {
  item: any;
  onProductClick: (product: any) => void;
  onAddClick: (product: any) => void;
}

const DrinksMenuItem: React.FC<DrinksMenuItemProps> = ({ item, onProductClick, onAddClick }) => {
  const handleAddToCart = () => {
    onAddClick(item);
  };

  // Get the first price option for display
  const displayPrice = item?.prices && Array.isArray(item.prices) && item.prices.length > 0
    ? parseFloat(item.prices[0].price) || 0
    : parseFloat(String(item?.indining_price || item?.price || 0)) || 0;

  const displaySize = item?.prices && Array.isArray(item.prices) && item.prices.length > 0
    ? item.prices[0].name
    : 'Regular';

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      className="bg-white p-2 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50 transition-all m-0"
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
            <Wine className="w-8 h-8 text-red-500" />
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
          ${displayPrice.toFixed(2)}
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

export default DrinksMenuItem;
