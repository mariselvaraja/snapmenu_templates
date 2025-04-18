import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Search } from 'lucide-react';

// Sample location data - this would typically come from an API or props
const locations = [
  {
    id: 1,
    name: "Downtown Location",
    address: "123 Main Street",
   
  },
  {
    id: 2,
    name: "Uptown Location",
    address: "456 Park Avenue",
  },
  {
    id: 3,
    name: "Riverside Location",
    address: "789 River Road",
  },
  {
    id: 3,
    name: "Riverside Location",
    address: "789 River Road",
  },
  {
    id: 3,
    name: "Riverside Location",
    address: "789 River Road",
  },
  {
    id: 3,
    name: "Riverside Location",
    address: "789 River Road",
  },
  {
    id: 3,
    name: "Riverside Location",
    address: "789 River Road",
  }
];

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: any) => void;
  locations?: Array<{
    id: number;
    name: string;
    address: string;
    phone?: string;
    hours?: string;
    image: string;
  }>;
  // Optional prop to determine if the close button should be shown
  showCloseButton?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSelectLocation,
  locations: propLocations,
  showCloseButton = true // Default to true for backward compatibility
}) => {
  // Use provided locations or default to sample data
  const allLocations = propLocations || locations;
  
  // State to track selected location and search query
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Focus search input when component opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Filter locations based on search query
  const displayLocations = searchQuery.trim() === '' 
    ? allLocations 
    : allLocations.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Handle location selection
  const handleSelectLocation = (location: any) => {
    setSelectedLocation(location.id);
    // Save selected location to localStorage
    localStorage.setItem('selectedLocation', JSON.stringify(location));
    // Call the parent callback
    onSelectLocation(location);
    // Close the modal after selection
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Elegant fixed header and search bar */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 shadow-sm">
              <div className="px-5 pt-5 pb-3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-orange-600 tracking-tight">Select Your Location</h2>
                  {showCloseButton && (
                    <motion.button 
                      onClick={onClose}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-400 hover:text-orange-500 transition-colors rounded-full p-1 hover:bg-orange-50"
                    >
                      <X size={18} />
                    </motion.button>
                  )}
                </div>
                
                {/* Refined Search Bar with bottom border only */}
                <div className="relative mb-2">
                  <div className="flex items-center border-b border-gray-200 pb-1 group focus-within:border-orange-300 transition-colors">
                    <div className="pl-1 pr-2">
                      <Search className="h-4 w-4 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search locations..."
                      className="w-full py-2 px-1 focus:outline-none text-gray-700 text-sm placeholder-gray-400"
                    />
                    {searchQuery && (
                      <motion.button
                        onClick={() => setSearchQuery('')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="pr-1 text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scrollable content area with elegant styling */}
            <div className="overflow-y-auto flex-1 px-2">
              <div className="flex flex-col">
                {displayLocations.length > 0 ? (
                  displayLocations.map((location) => (
                  <motion.div
                    key={location.id}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    className={`cursor-pointer border-b border-gray-100 transition-all
                      ${selectedLocation === location.id ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="flex py-4 px-3">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-sm">
                        <MapPin className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium text-gray-800 leading-tight">{location.name}</h3>
                        <div className="flex items-center text-gray-500 mt-1">
                          <span className="text-sm">{location.address}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: selectedLocation === location.id ? 1 : 0 }}
                          className="text-orange-500"
                        >
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 mb-4 shadow-sm"
                    >
                      <MapPin className="h-8 w-8 text-orange-500" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No locations found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Try a different search term or browse all locations.</p>
                    {searchQuery && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSearchQuery('')}
                        className="mt-5 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full transition-all shadow-sm hover:shadow text-sm font-medium"
                      >
                        Show All Locations
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LocationSelector;
