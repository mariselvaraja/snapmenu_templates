import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterDrawer({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  subcategories,
  selectedSubcategory,
  setSelectedSubcategory
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Filter Menu</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            {/* Drawer Content */}
            <div className="p-4">
              {/* Categories Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
                <div className="space-y-2">
                  {/* All Category */}
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedSubcategory('All');
                      onClose();
                    }}
                    className={`w-full px-4 py-2 rounded-lg text-left ${
                      selectedCategory === 'All'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    All Categories
                  </button>
                  
                  {/* Other Categories */}
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedSubcategory('All');
                        onClose();
                      }}
                      className={`w-full px-4 py-2 rounded-lg text-left ${
                        selectedCategory === category
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Subcategories Section (only show if a main category is selected) */}
              {selectedCategory !== 'All' && subcategories.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Subcategories</h3>
                  <div className="space-y-2">
                    {/* All Subcategory */}
                    <button
                      onClick={() => {
                        setSelectedSubcategory('All');
                        onClose();
                      }}
                      className={`w-full px-4 py-2 rounded-lg text-left ${
                        selectedSubcategory === 'All'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      All {selectedCategory}
                    </button>
                    
                    {/* Other Subcategories */}
                    {subcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => {
                          setSelectedSubcategory(subcategory);
                          onClose();
                        }}
                        className={`w-full px-4 py-2 rounded-lg text-left ${
                          selectedSubcategory === subcategory
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
