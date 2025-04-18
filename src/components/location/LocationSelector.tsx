import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

// Sample location data - this would typically come from an API or props
const locations = [
  {
    id: 1,
    name: "Downtown Location",
    address: "123 Main Street",
    phone: "(555) 123-4567",
    hours: "Mon-Sun: 11am - 11pm",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Uptown Location",
    address: "456 Park Avenue",
    phone: "(555) 234-5678",
    hours: "Mon-Sun: 11am - 12am",
    image: "https://images.unsplash.com/photo-1567967455389-e778e3b2c5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Riverside Location",
    address: "789 River Road",
    phone: "(555) 345-6789",
    hours: "Mon-Sun: 10am - 10pm",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
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
  const displayLocations = propLocations || locations;
  
  // State to track selected location
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

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
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-600">Select Your Location</h2>
                {showCloseButton && (
                  <button 
                    onClick={onClose}
                    className="text-gray-500 hover:text-orange-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
              
              <p className="text-gray-600 mb-8">
                Please select a location to continue to our menu and services.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayLocations.map((location) => (
                  <motion.div
                    key={location.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-lg overflow-hidden shadow-md transition-all
                      ${selectedLocation === location.id ? 'ring-2 ring-orange-500' : 'hover:shadow-lg'}`}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="relative h-40">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="text-white font-bold text-lg">{location.name}</h3>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-orange-500" />
                        <span className="text-sm">{location.address}</span>
                      </div>
                      <button 
                        className="mt-2 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLocation(location);
                        }}
                      >
                        Select Location
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LocationSelector;
