import React, { useState, useEffect, createContext, useContext } from 'react';
import { Provider, useSelector } from 'react-redux';
import PizzaApp from './pizza_template/App';
import TemplateNotFound from './TemplateNotFound';

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

  // Template context value
  const templateContextValue = {
    theme,
    toggleTheme,
    templateConfig,
    updateTemplateConfig,
    isLoading
  };

   const template_id = "pizza_template";
  // Check if restaurant API returned an error or empty data
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

  // Determine which template to render based on the template name
  const renderTemplate = () => {
    switch (template_id) {
      case 'pizza_template':
        return <PizzaApp />;
      default:
        return <TemplateNotFound />;
    }
  };

  return (
    <TemplateContext.Provider value={templateContextValue}>
      {renderTemplate()}
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
