import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';
import { CiWheat } from 'react-icons/ci';
import { GoDotFill } from 'react-icons/go';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  indining_price?: number;
  image?: string;
  dietary?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
  };
}

interface MenuItemCardProps {
  item: MenuItem;
  onProductClick: (item: MenuItem) => void;
  onAddToOrder: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onProductClick,
  onAddToOrder
}) => {
  return (
    <motion.div
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
        {/* Product name with left-right alignment on mobile */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {/* Food Type Icons - Veg/Non-Veg */}
            {item.dietary && (item.dietary.isVegetarian || item.dietary.isVegan) ? (
                <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-green-600 flex-shrink-0">
                <GoDotFill className="w-2 h-2 text-green-600" />
              </div>
            ) : (
              <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-red-600 flex-shrink-0">
                <GoDotFill className="w-2 h-2 text-red-600" />
              </div>
            )}
            <h3 
              className="text-lg sm:text-xl font-semibold cursor-pointer hover:text-red-500"
              onClick={() => onProductClick(item)}
            >
              {item.name}
            </h3>
          </div>
        </div>
        
        {/* Description with line clamp */}
        <p 
          className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 overflow-hidden cursor-pointer hover:text-gray-800"
          onClick={() => onProductClick(item)}
        >
          {item.description}
        </p>
        
        {/* Price on bottom left and Add to Order on bottom right */}
        <div className="flex justify-between items-center mt-auto">
          <p className="text-lg font-bold text-red-500">${(item.indining_price || item.price)?.toFixed(2)}</p>
          <button 
            onClick={() => onAddToOrder(item)}
            className="flex items-center gap-2 bg-red-500 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base"
          >
            Add <Plus/>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
