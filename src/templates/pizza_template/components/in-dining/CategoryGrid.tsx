import React from 'react';
import { motion } from 'framer-motion';

interface CategoryGridProps {
  categories: Array<{
    name: string;
    image: string;
    itemCount: number;
  }>;
  onCategoryClick: (category: string) => void;
}

export default function CategoryGrid({ categories, onCategoryClick }: CategoryGridProps) {
  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose your favorite category</h2>
      
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onCategoryClick(category.name)}
            className="cursor-pointer group"
          >
            <div className="flex flex-col items-center">
              {/* Circular Image Container */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-3">
                <div className="absolute inset-0 bg-gray-100 rounded-full overflow-hidden group-hover:ring-4 group-hover:ring-red-100 transition-all duration-200">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-50">
                      <span className="text-2xl sm:text-3xl font-bold text-red-400">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Category Name */}
              <h3 className="text-sm sm:text-base font-medium text-gray-800 text-center group-hover:text-red-500 transition-colors">
                {category.name}
              </h3>
              
              {/* Item Count (optional) */}
              <p className="text-xs text-gray-500 mt-1">
                {category.itemCount} items
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
