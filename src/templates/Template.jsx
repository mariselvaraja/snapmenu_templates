import React, { useState, useEffect, createContext, useContext } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import PizzaApp from './pizza_template/App';
import CasualDiningApp from './casual_dining_template/App';
import EatflowApp from './eatflow_template/App';
import CulinaryJourneyApp from './culinary_journey_template/App';
import TemplateNotFound from './TemplateNotFound';
import { LocationSelector } from '../components';
import { fetchSiteContentRequest } from '../common/redux/slices/siteContentSlice';
import { fetchMenuRequest } from '../common/redux/slices/menuSlice';
import { fetchTpnConfigRequest } from '../redux/slices/tpnSlice';

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

  const searchParams = new URLSearchParams(window.location.search);
  // Get Redux dispatch function
  const dispatch = useDispatch();
  
  // Get loading and error states from Redux store
  const restaurantState = useSelector(state => state.restaurant);
  const menuState = useSelector(state => state.menu);
  const siteContentState = useSelector(state => state.siteContent);

  // Check if any of the required API calls are still loading
  const isLoading = restaurantState.loading || menuState.loading || siteContentState.loading;


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
    // Set the location selected state to true
    setLocationSelected(true);
    // You can add additional logic here if needed
  };

  let parent_id = searchParams.get("restaurant");
  let franchise_id = searchParams.get("franchise");
  let table_number = searchParams.get("table");

  const isPlaceInDiningOrderRoute = window.location.pathname.includes('placeindiningorder');
  const isPaymentRoute = window.location.pathname.includes('payment');
  // Auto-select restaurant if there's only one in the list
  useEffect(() => {

    if (restaurantState.info && restaurantState.info.length === 1) {
      // Automatically select the only restaurant
      const singleRestaurant = restaurantState.info[0];
      if(isPlaceInDiningOrderRoute)
      {
        sessionStorage.removeItem("restaurant_id");
        sessionStorage.removeItem("franchise_id");
        sessionStorage.removeItem("table_number");

      
        
        sessionStorage.setItem("restaurant_id", parent_id);
        sessionStorage.setItem("franchise_id", franchise_id);
        sessionStorage.setItem("table_number", table_number);
              
      setLocationSelected(true);
      // Fetch required data
      dispatch(fetchTpnConfigRequest());
      dispatch(fetchSiteContentRequest());
      dispatch(fetchMenuRequest());
      }
      else
      {
        sessionStorage.setItem("restaurant_id", singleRestaurant.restaurant_parent_id);
        sessionStorage.setItem("franchise_id", singleRestaurant.restaurant_id);
        sessionStorage.setItem('customer_care_number', singleRestaurant.customer_care_number)
        
      setLocationSelected(true);
      // Fetch required data
      dispatch(fetchTpnConfigRequest());
      dispatch(fetchSiteContentRequest());
      dispatch(fetchMenuRequest('website'));
      }

      if(isPaymentRoute)
        {
          setLocationSelected(true);
        }
    }
    else
    {
      if(isPlaceInDiningOrderRoute)
        {
          sessionStorage.removeItem("restaurant_id");
          sessionStorage.removeItem("franchise_id");
          sessionStorage.removeItem("table_number");
          sessionStorage.removeItem('customer_care_number')
          
        
          
          sessionStorage.setItem("restaurant_id", parent_id);
          sessionStorage.setItem("franchise_id", franchise_id);
          sessionStorage.setItem("table_number", table_number);
                
      setLocationSelected(true);
      // Fetch required data
      dispatch(fetchTpnConfigRequest());
      dispatch(fetchSiteContentRequest());
      dispatch(fetchMenuRequest());
          
        }

        if(isPaymentRoute)
        {
          setLocationSelected(true);
        }
    }
  }, [restaurantState.info, dispatch]);

  // Check if current URL includes placeindiningorder
  

  // Check if a location has been selected and show location selector when the website finishes loading
  useEffect(() => {
    // Only proceed when the site is fully loaded
    if (!isLoading) {
      // Check if location is already selected in localStorage
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        // If a location is already saved, set locationSelected to true
        // setLocationSelected(true);
      } else if (!isPlaceInDiningOrderRoute && !isPaymentRoute) {
        // If no location is selected and we're not on the placeindiningorder or payment route, show the selector after a short delay
        const timer = setTimeout(() => {
          setShowLocationSelector(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, isPlaceInDiningOrderRoute, isPaymentRoute]); // Re-run when loading state changes or route changes

  // Make sure the location selector is always shown if no location is selected
  useEffect(() => {
    if (!locationSelected && !isLoading && !showLocationSelector && !isPlaceInDiningOrderRoute && !isPaymentRoute) {
      setShowLocationSelector(true);
    }
  }, [locationSelected, isLoading, showLocationSelector, isPlaceInDiningOrderRoute, isPaymentRoute]);

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
    
    return <TemplateNotFound />;
  }

  const getTemlateId = () => {
    const franchise = restaurantState.info;
    const selectedFranchiseId = sessionStorage.getItem("franchise_id");
    const franchiseInfo = _.find(franchise, (franchise) => franchise.restaurant_id == selectedFranchiseId);
    
    return _.get(franchiseInfo, 'template_id', 'casual_dining');
  }
  
  // If other required data is not loaded, show TemplateNotFound
  // if (!allDataLoaded) {
  //   console.error('Required data not loaded:', {
  //     menuLoaded: menuState.items.length > 0,
  //     siteContentLoaded: !!siteContentState.content
  //   });
  //   return <TemplateNotFound />;
  // }

  // For testing purposes, you can change this value to "culinary_journey" to see the culinary journey template
  const template_id = getTemlateId(); // Options: "pizza", "casual_dining", "eatflow", "culinary_journey"
  // 
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
      {/* Conditionally render either the template or the location selector screen */}
      {locationSelected ? (
        renderTemplate()
      ) : (
        !isPlaceInDiningOrderRoute && !isPaymentRoute && (
          <div className="min-h-screen bg-white">
            <LocationSelector 
              isOpen={true}
              onClose={() => setShowLocationSelector(false)}
              onSelectLocation={handleSelectLocation}
              showCloseButton={false}
            />
          </div>
        )
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
