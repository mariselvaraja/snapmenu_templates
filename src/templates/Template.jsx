import React, { useState, useEffect, createContext, useContext } from 'react';
import { Provider, useSelector } from 'react-redux';
import PizzaApp from './pizza_template/App';
import CasualDiningApp from './casual_dining_template/App';
import EatflowApp from './eatflow_template/App';
import CulinaryJourneyApp from './culinary_journey_template/App';
import TemplateNotFound from './TemplateNotFound';
import { LocationSelector } from '../components';

// Create a context for template-specific settings
export const TemplateContext = createContext(null);

// Custom hook to use the template context
export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};

/**
 * TemplateContent component that checks API responses before rendering
 * This is wrapped by the Template component which provides the Redux store
 */
const TemplateContent = () => {
  const [theme, setTheme] = useState('light');
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [templateConfig, setTemplateConfig] = useState({
    name: 'Pizza Template',
    version: '1.0.0',
    features: {
      onlineOrdering: true,
      tableReservation: true,
      loyaltyProgram: false
    }
  });

  // Get loading and error states from Redux store
  const restaurantState = useSelector(state => state.restaurant);
  const menuState = useSelector(state => state.menu);
  const siteContentState = useSelector(state => state.siteContent);

  // Check if any of the required API calls are still loading
  const isLoading = restaurantState.loading || menuState.loading || siteContentState.loading;

  // Check if any of the required API calls have errors
  const hasErrors = restaurantState.error || menuState.error || siteContentState.error;

  // Check if all required data is loaded
  const allDataLoaded = 
    !isLoading && 
    !hasErrors && 
    restaurantState.info && 
    menuState.items.length > 0 && 
    siteContentState.content;

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Update template configuration
  const updateTemplateConfig = (newConfig) => {
    setTemplateConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig
    }));
  };

  // State to track if a location has been selected
  const [locationSelected, setLocationSelected] = useState(false);
  
  // Handle location selection
  const handleSelectLocation = (location) => {
    console.log('Selected location:', location);
    // Set the location selected state to true
    setLocationSelected(true);
    // You can add additional logic here if needed
  };

  // Check if current URL includes placeindiningorder
  const isPlaceInDiningOrderRoute = window.location.pathname.includes('placeindiningorder');

  // Check if a location has been selected and show location selector when the website finishes loading
  useEffect(() => {
    // Only proceed when the site is fully loaded
    if (!isLoading) {
      // Check if location is already selected in localStorage
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        // If a location is already saved, set locationSelected to true
        setLocationSelected(true);
      } else if (!isPlaceInDiningOrderRoute) {
        // If no location is selected and we're not on the placeindiningorder route, show the selector after a short delay
        const timer = setTimeout(() => {
          setShowLocationSelector(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, isPlaceInDiningOrderRoute]); // Re-run when loading state changes or route changes

  // Make sure the location selector is always shown if no location is selected
  useEffect(() => {
    if (!locationSelected && !isLoading && !showLocationSelector && !isPlaceInDiningOrderRoute) {
      setShowLocationSelector(true);
    }
  }, [locationSelected, isLoading, showLocationSelector, isPlaceInDiningOrderRoute]);

  // Template context value
  const templateContextValue = {
    theme,
    toggleTheme,
    templateConfig,
    updateTemplateConfig,
    isLoading
  };

   // Get template_id from restaurant data or use default

  const restaurantApiError = restaurantState.error || !restaurantState.info;
  
  // If still loading, show a loading indicator with spinner
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-gray-700 font-medium">Loading your website...</p>
        </div>
      </div>
    );
  }
  
  // If restaurant API returned an error or empty data, show TemplateNotFound
  if (restaurantApiError) {
    console.error('Restaurant API error or empty data:', restaurantState.error || 'No restaurant data');
    return <TemplateNotFound />;
  }
  
  // If other required data is not loaded, show TemplateNotFound
  if (!allDataLoaded) {
    console.error('Required data not loaded:', {
      menuLoaded: menuState.items.length > 0,
      siteContentLoaded: !!siteContentState.content
    });
    return <TemplateNotFound />;
  }

  // For testing purposes, you can change this value to "culinary_journey" to see the culinary journey template
  const template_id = "casual_dining"; // Options: "pizza", "casual_dining", "eatflow", "culinary_journey"
  // restaurantState?.info?.template_id
  // In production, this would come from the API: 
  console.log("restaurantState", restaurantState)
  // Check if restaurant API returned an error or empty data

  // Determine which template to render based on the template name
  const renderTemplate = () => {
    switch (template_id) {
      case 'pizza':
        return <PizzaApp />;
      case 'casual_dining':
        return <CasualDiningApp />;
      case 'eatflow':
        return <EatflowApp />;
      case 'culinary_journey':
        return <CulinaryJourneyApp />;
      default:
        return <TemplateNotFound />;
    }
  };

  return (
    <TemplateContext.Provider value={templateContextValue}>
      {/* Only render the template if a location has been selected */}
      {locationSelected ? (
        renderTemplate()
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          
        </div>
      )}
      
      {/* Location Selector Popup - Don't show for placeindiningorder route */}
      {!isPlaceInDiningOrderRoute && (
        <LocationSelector 
          isOpen={showLocationSelector}
          onClose={() => {
            // Only allow closing if a location has been selected
            if (locationSelected) {
              setShowLocationSelector(false);
            }
          }}
          onSelectLocation={handleSelectLocation}
          showCloseButton={locationSelected} // Only show close button if a location has been selected
        />
      )}
    </TemplateContext.Provider>
  );
};

/**
 * Template component that provides template-specific functionality
 * and integrates with the Redux store and application components
 */
const Template = ({ store }) => {
  return (
    <Provider store={store}>
      <TemplateContent />
    </Provider>
  );
};

export default Template;
