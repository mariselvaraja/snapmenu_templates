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
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onCategoryClick(category.name)}
            className="cursor-pointer group"
          >
            <div className="bg-white rounded-lg border-2 border-red-500 p-4 text-center hover:bg-red-50 hover:shadow-lg transition-all duration-200 h-full flex flex-col justify-center min-h-[100px]">
              {/* Category Name */}
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors mb-1">
                {category.name}
              </h3>
              
              {/* Item Count */}
              <p className="text-sm text-gray-600">
                {category.itemCount} items
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
