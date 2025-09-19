import React, { useState, useEffect, createContext, useContext } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
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
const TemplateContent = ({ franchiseId }) => {
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
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle redirect from query parameters to path parameters for placeindiningorder route
  useEffect(() => {
    if (location.pathname === '/placeindiningorder' && location.search) {
      const searchParams = new URLSearchParams(location.search);
      const restaurant = searchParams.get('restaurant');
      const franchise = searchParams.get('franchise');
      const table = searchParams.get('table');

      // If all required parameters are present, redirect to path parameter format
      if (restaurant && franchise && table) {
        const newPath = `/placeindiningorder/${restaurant}/${franchise}/${table}`;
        console.log('Template.jsx - Redirecting from query params to path params:', {
          from: `${location.pathname}${location.search}`,
          to: newPath
        });
        
        // Replace the current history entry to avoid back button issues
        navigate(newPath, { replace: true });
        return; // Exit early to prevent further processing
      }
    }
  }, [location, navigate]);
  
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

  const isPlaceInDiningOrderRoute = window.location.pathname.includes('placeindiningorder');
  const isPaymentRoute = window.location.pathname.includes('payment');

  // Extract parameters based on route type
  let parent_id, franchise_id, table_number;
  
  if (isPlaceInDiningOrderRoute) {
    // Extract from path parameters for placeindiningorder route
    // URL format: /placeindiningorder/:restaurantId/:franchiseId/:tableId
    const pathParts = location.pathname.split('/');
    const placeOrderIndex = pathParts.findIndex(part => part === 'placeindiningorder');
    
    if (placeOrderIndex !== -1 && pathParts.length > placeOrderIndex + 3) {
      parent_id = pathParts[placeOrderIndex + 1]; // restaurantId
      franchise_id = pathParts[placeOrderIndex + 2]; // franchiseId  
      table_number = pathParts[placeOrderIndex + 3]; // tableId
      
      // Debug logging
      console.log('Template.jsx - Extracted path parameters:');
      console.log('parent_id (restaurantId):', parent_id);
      console.log('franchise_id:', franchise_id);
      console.log('table_number (tableId):', table_number);
    }
  } else {
    // Extract from query parameters for other routes
    parent_id = searchParams.get("restaurant");
    franchise_id = searchParams.get("franchise");
    table_number = searchParams.get("table");
  }
  // Auto-select restaurant if there's only one in the list or if franchiseId is provided in URL
  useEffect(() => {
    // Check if franchiseId is provided in the URL path (new franchise-based routes)
    const pathParts = location.pathname.split('/');
    const urlFranchiseId = pathParts[1]; // First part after domain should be franchise ID
    
    // If franchiseId is provided in the URL path or as prop, automatically select that franchise
    const targetFranchiseId = urlFranchiseId || franchiseId;
    
    if (targetFranchiseId && restaurantState.info) {
      const selectedFranchise = restaurantState.info.find(restaurant => restaurant.restaurant_id === targetFranchiseId);
      if (selectedFranchise) {
        sessionStorage.setItem("restaurant_id", selectedFranchise.restaurant_parent_id);
        sessionStorage.setItem("franchise_id", selectedFranchise.restaurant_id);
        sessionStorage.setItem('customer_care_number', selectedFranchise.customer_care_number);
        
        setLocationSelected(true);
        // Fetch required data
        dispatch(fetchTpnConfigRequest());
        dispatch(fetchSiteContentRequest());
        dispatch(fetchMenuRequest('website'));
        return;
      }
    }

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
        
        // If we're on the root path without franchise ID, redirect to franchise-specific path
        if (location.pathname === '/' || location.pathname === '') {
          window.location.replace(`/${singleRestaurant.restaurant_id}`);
          return;
        }
        
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
  }, [restaurantState.info, dispatch, franchiseId, location.pathname]);

  // Check if current URL includes placeindiningorder
  

  // Check if a location has been selected and show location selector when the website finishes loading
  useEffect(() => {
    // Only proceed when the site is fully loaded
    if (!isLoading) {
      // Check if there's only one franchise - if so, don't show location selector
      if (restaurantState.info && restaurantState.info.length === 1) {
        return; // Don't show location selector for single franchise
      }
      
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
  }, [isLoading, isPlaceInDiningOrderRoute, isPaymentRoute, restaurantState.info]); // Re-run when loading state changes or route changes

  // Make sure the location selector is always shown if no location is selected (but not for single franchise)
  useEffect(() => {
    // Don't show location selector if there's only one franchise
    if (restaurantState.info && restaurantState.info.length === 1) {
      return;
    }
    
    if (!locationSelected && !isLoading && !showLocationSelector && !isPlaceInDiningOrderRoute && !isPaymentRoute) {
      setShowLocationSelector(true);
    }
  }, [locationSelected, isLoading, showLocationSelector, isPlaceInDiningOrderRoute, isPaymentRoute, restaurantState.info]);

  // Template context value
  const templateContextValue = {
    theme,
    toggleTheme,
    templateConfig,
    updateTemplateConfig,
    isLoading
  };

   // Get template_id from restaurant data or use default

  // Only show TemplateNotFound if there's an actual API error, not just missing data
  const restaurantApiError = restaurantState.error && restaurantState.error !== null;
  
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
  
  // If restaurant API returned an actual error, show TemplateNotFound
  if (restaurantApiError) {
    return <TemplateNotFound />;
  }

  const getTemplateId = () => {
    const franchise = restaurantState.info;
    const selectedFranchiseId = sessionStorage.getItem("franchise_id");
    const franchiseInfo = _.find(franchise, (franchise) => franchise.restaurant_id == selectedFranchiseId);
    
    // For in-dining routes, ensure we get the correct template
    if (isPlaceInDiningOrderRoute && franchiseInfo) {
      return _.get(franchiseInfo, 'template_id', 'pizza');
    }
    
    return _.get(franchiseInfo, 'template_id', 'pizza');
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
  const template_id = getTemplateId(); // Options: "pizza", "casual_dining", "eatflow", "culinary_journey"
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

  // Check if we should show LocationSelector - don't show for single franchise
  const shouldShowLocationSelector = !locationSelected && 
    !isPlaceInDiningOrderRoute && 
    !isPaymentRoute && 
    restaurantState.info && 
    restaurantState.info.length > 1; // Only show for multiple franchises

  return (
    <TemplateContext.Provider value={templateContextValue}>
      {/* Conditionally render either the template or the location selector screen */}
      {locationSelected ? (
        renderTemplate()
      ) : shouldShowLocationSelector ? (
        <div className="min-h-screen bg-white">
          <LocationSelector 
            isOpen={true}
            onClose={() => setShowLocationSelector(false)}
            onSelectLocation={handleSelectLocation}
            showCloseButton={false}
          />
        </div>
      ) : (
        // Show loading or nothing for single franchise while processing
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-700 font-medium">Loading your website...</p>
          </div>
        </div>
      )}
    </TemplateContext.Provider>
  );
};

/**
 * Template component that provides template-specific functionality
 * and integrates with the Redux store and application components
 */
const Template = ({ store, franchiseId }) => {
  return (
    <Provider store={store}>
      <TemplateContent franchiseId={franchiseId} />
    </Provider>
  );
};

export default Template;
