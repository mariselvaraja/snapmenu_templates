import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Filter } from 'lucide-react';

const FilterDrawer = ({ isOpen, onClose, onApplyFilters }) => {
  // Filter categories
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten Free' },
    { id: 'dairy-free', label: 'Dairy Free' },
    { id: 'nut-free', label: 'Nut Free' }
  ];
  
  const spiceLevelOptions = [
    { id: 'mild', label: 'Mild' },
    { id: 'medium', label: 'Medium' },
    { id: 'spicy', label: 'Spicy' },
    { id: 'very-spicy', label: 'Very Spicy' }
  ];
  
  const priceRangeOptions = [
    { id: 'under-10', label: 'Under $10' },
    { id: '10-20', label: '$10 - $20' },
    { id: '20-30', label: '$20 - $30' },
    { id: 'over-30', label: 'Over $30' }
  ];
  
  // State for selected filters
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  
  // Toggle selection for a filter option
  const toggleDietaryOption = (id) => {
    if (selectedDietary.includes(id)) {
      setSelectedDietary(selectedDietary.filter(item => item !== id));
    } else {
      setSelectedDietary([...selectedDietary, id]);
    }
  };
  
  const toggleSpiceLevelOption = (id) => {
    if (selectedSpiceLevel.includes(id)) {
      setSelectedSpiceLevel(selectedSpiceLevel.filter(item => item !== id));
    } else {
      setSelectedSpiceLevel([...selectedSpiceLevel, id]);
    }
  };
  
  const togglePriceRangeOption = (id) => {
    if (selectedPriceRange.includes(id)) {
      setSelectedPriceRange(selectedPriceRange.filter(item => item !== id));
    } else {
      setSelectedPriceRange([...selectedPriceRange, id]);
    }
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    onApplyFilters({
      dietary: selectedDietary,
      spiceLevel: selectedSpiceLevel,
      priceRange: selectedPriceRange
    });
    onClose();
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setSelectedDietary([]);
    setSelectedSpiceLevel([]);
    setSelectedPriceRange([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-orange-600 mr-2" />
                  <h2 className="text-xl font-semibold">Filters</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Filter Options */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Dietary Restrictions */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Dietary Restrictions</h3>
                <div className="space-y-2">
                  {dietaryOptions.map(option => (
                    <div 
                      key={option.id}
                      className="flex items-center"
                    >
                      <button
                        onClick={() => toggleDietaryOption(option.id)}
                        className={`w-5 h-5 rounded-sm mr-3 flex items-center justify-center ${
                          selectedDietary.includes(option.id) 
                            ? 'bg-orange-600' 
                            : 'border border-gray-300'
                        }`}
                      >
                        {selectedDietary.includes(option.id) && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Spice Level */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Spice Level</h3>
                <div className="space-y-2">
                  {spiceLevelOptions.map(option => (
                    <div 
                      key={option.id}
                      className="flex items-center"
                    >
                      <button
                        onClick={() => toggleSpiceLevelOption(option.id)}
                        className={`w-5 h-5 rounded-sm mr-3 flex items-center justify-center ${
                          selectedSpiceLevel.includes(option.id) 
                            ? 'bg-orange-600' 
                            : 'border border-gray-300'
                        }`}
                      >
                        {selectedSpiceLevel.includes(option.id) && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRangeOptions.map(option => (
                    <div 
                      key={option.id}
                      className="flex items-center"
                    >
                      <button
                        onClick={() => togglePriceRangeOption(option.id)}
                        className={`w-5 h-5 rounded-sm mr-3 flex items-center justify-center ${
                          selectedPriceRange.includes(option.id) 
                            ? 'bg-orange-600' 
                            : 'border border-gray-300'
                        }`}
                      >
                        {selectedPriceRange.includes(option.id) && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
