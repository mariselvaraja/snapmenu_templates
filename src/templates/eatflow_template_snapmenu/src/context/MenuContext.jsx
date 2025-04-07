import React, { createContext, useContext } from 'react';
import { useRootMenu } from '../../../../context/RootMenuContext';

export const MenuContext = createContext(null);

export const MenuProvider = ({ children, restaurant_id, isPreview }) => {
  // Get data from root context
  const { menu: rootMenu, loading: rootLoading, error: rootError } = useRootMenu();

  // Process menu data to handle different structures
  let processedMenu = null;
  
  try {
    if (rootMenu) {
      if (typeof rootMenu === 'object') {
        if ('menu' in rootMenu) {
          // If rootMenu has a menu property
          processedMenu = rootMenu;
        } else {
          // If rootMenu is directly the menu object
          processedMenu = { menu: rootMenu };
        }
      } else {
        processedMenu = rootMenu;
      }
    }
  } catch (error) {
    console.error("Error processing menu data:", error);
    processedMenu = { menu: {} };
  }

  // Default menu structure if no menu is available
  const defaultMenu = { 
    menu: {
      starters: [],
      mains: [],
      desserts: [],
      drinks: []
    }
  };

  return (
    <MenuContext.Provider value={{ 
      menu: processedMenu || defaultMenu, 
      loading: rootLoading, 
      error: rootError, 
      restaurant_id, 
      isPreview 
    }}>
      {children}
    </MenuContext.Provider>
  );
};


export const useMenu = () => {
  return useContext(MenuContext);
};
