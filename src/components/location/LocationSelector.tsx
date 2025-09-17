import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../common/redux/hooks';
import { useSelector } from 'react-redux';
import { fetchSiteContentRequest } from '../../common/redux/slices/siteContentSlice';
import { fetchMenuRequest } from '../../common/redux/slices/menuSlice';
import { fetchTpnConfigRequest } from '@/redux/slices/tpnSlice';


// Define location interface
interface Location {
  id: string;
  name: string;
  address: string;
  phone?: string;
  hours?: string;
  image?: string;
  customer_care_number?: string;
}

// Default location data in case Redux data is not available
const defaultLocations: Location[] = [];

interface LocationSelectorProps {
  onSelectLocation: (location: Location) => void;
  locations?: Location[];
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onSelectLocation,
  locations: propLocations,
  className = ''
}) => {
  // Get dispatch function
  const dispatch = useAppDispatch();
  
  // Get navigate function for routing
  const navigate = useNavigate();
  
  // Get restaurant data from Redux
  const restaurantState = useSelector((state: any) => state.restaurant);

  console.log("restaurantState", restaurantState)
  
  // Transform restaurant data to location format if available
  const reduxLocations: any[] = Array.isArray(restaurantState.info) 
    ? restaurantState.info.map((restaurant: any) => ({
        id: restaurant.restaurant_id || 'default-id',
        name: restaurant.restaurant_name || 'Restaurant Location',
        address: restaurant.restaurant_address || restaurant.address || '',
        phone: restaurant.phone || '',
        image: restaurant.logo && restaurant.logo.length > 0 ? restaurant.logo[0] : '',
        customer_care_number: restaurant.customer_care_number
      }))
    : [];
  
  // Use provided locations, or Redux locations, or default to empty array
  const allLocations = propLocations || reduxLocations || defaultLocations;
  
  // State to track selected location and search query
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Focus search input when component mounts
  useEffect(() => {
    sessionStorage.removeItem("franchise_id")
    sessionStorage.removeItem('customer_care_number')
    
    if (searchInputRef.current) {
      searchInputRef.current?.focus();
    }
  }, []);
  
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
    // Save selected location to localStorage and sessionStorage
    sessionStorage.setItem('franchise_id', location.id);
    sessionStorage.setItem('customer_care_number', location.customer_care_number)
    
    // After location is selected, fetch site content and menu data
    dispatch(fetchTpnConfigRequest())
    dispatch(fetchSiteContentRequest());
    dispatch(fetchMenuRequest('website'));

    // Call the parent callback
    onSelectLocation(location);
    
    // Navigate to franchise-specific home page after location selection
    navigate(`/${location.id}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background with blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
          filter: 'blur(12px)',
          transform: 'scale(1.1)' // Prevent blur edges
        }}
      ></div>
      
      {/* Content container */}
      <div className={`relative w-full h-full flex flex-col items-center justify-center ${className}`}>
        {/* Title above the location selector with pin icon */}
        <div className="text-center mb-6">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-orange-500 mb-3">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Select Your Location</h1>
        </div>
        
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-2xl mx-auto flex flex-col rounded-lg shadow-lg border border-gray-200 overflow-x-hidden"
      >
        {/* Header and search bar */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="px-8 pt-8 pb-6">
            {/* <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-orange-500">Select Your Location</h2>
            </div> */}
            
            {/* Search Bar */}
            <div className="relative mb-2">
              <div className="flex items-center border-b border-gray-300 pb-2 focus-within:border-orange-400 transition-colors">
                <div className="pl-1 pr-2">
                  <Search className="h-4 w-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locations..."
                  className="w-full py-2 px-1 focus:outline-none bg-transparent text-gray-700 text-sm placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="pr-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Locations list with overflow-y */}
        <div className="overflow-y-auto overflow-x-hidden max-h-[400px]">
          {displayLocations.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {displayLocations.map((location) => (
                <motion.div
                  key={location.id}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  className={`cursor-pointer transition-colors ${
                    selectedLocation === location.id ? 'bg-orange-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectLocation(location)}
                >
                  <div className="flex items-center p-4">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                      {location.image ? (
                        <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold text-orange-500">
                          {location.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="font-medium text-gray-900">{location.name}</h3>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 text-orange-500 mr-1 flex-shrink-0" />
                        <span className="text-sm">{location.address}</span>
                      </div>
                    </div>
                    {selectedLocation === location.id && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4"
              >
                <MapPin className="h-8 w-8 text-orange-500" />
              </motion.div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Try a different search term or browse all locations.</p>
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSearchQuery('')}
                  className="mt-5 px-5 py-2 bg-orange-500 text-white rounded-full transition-all shadow-sm hover:shadow text-sm font-medium"
                >
                  Show All Locations
                </motion.button>
              )}
            </div>
          )}
        </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LocationSelector;
