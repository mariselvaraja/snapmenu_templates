import React, { useState, useEffect, createContext, useContext } from 'react';
import { Provider } from 'react-redux';
import PizzaApp from './pizza_template/App';

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
 * Template component that provides template-specific functionality
 * and integrates with the Redux store and application components
 */
const Template = ({ store }) => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);
  const [templateConfig, setTemplateConfig] = useState({
    name: 'Pizza Template',
    version: '1.0.0',
    features: {
      onlineOrdering: true,
      tableReservation: true,
      loyaltyProgram: false
    }
  });

  // Simulate loading template configuration
  useEffect(() => {
    const loadTemplateConfig = async () => {
      try {
        // In a real application, this could fetch from an API
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set loading to false when done
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load template configuration:', error);
        setIsLoading(false);
      }
    };

    loadTemplateConfig();
  }, []);

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

  // If still loading, show a loading indicator with spinner
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-gray-700 font-medium">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <TemplateContext.Provider value={templateContextValue}>
      <div className={`template-wrapper theme-${theme}`}>
        <Provider store={store}>
          <PizzaApp />
        </Provider>
      </div>
    </TemplateContext.Provider>
  );
};

export default Template;
