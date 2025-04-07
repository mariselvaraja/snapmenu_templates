import React, { createContext, useContext } from 'react';
import { useRootMenu } from '../../../../context/RootMenuContext';
// Import the type from the root context
type RootMenuContextType = {
  menu: {
    menu: {
      [category: string]: any[];
    };
  };
  loading: boolean;
  error: Error | null;
};

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  subCategory: string;
  calories: number;
  nutrients: {
    protein: string;
    carbs: string;
    fat: string;
    sat: string;
    unsat: string;
    trans: string;
    sugar: string;
    fiber: string;
  };
  dietary: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
  };
  allergens: string[];
  ingredients: string[];
  pairings: string[];
}

interface MenuContextType {
  menu: {
    [category: string]: MenuItem[];
  };
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

interface MenuProviderProps {
  children: React.ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  // Create a default empty menu structure
  const defaultMenu: { [category: string]: MenuItem[] } = {};
  
  // Get the root menu context and use type assertion
  const rootMenuContext = useRootMenu() as unknown as RootMenuContextType;
  
  // Extract menu data or use default
  let menu = defaultMenu;
  if (rootMenuContext && rootMenuContext.menu) {
    try {
      // Handle different menu structures
      if (typeof rootMenuContext.menu === 'object') {
        if ('menu' in rootMenuContext.menu) {
          // If menu has a nested menu property
          menu = rootMenuContext.menu.menu as unknown as { [category: string]: MenuItem[] };
        } else {
          // If menu is directly the categories object
          menu = rootMenuContext.menu as unknown as { [category: string]: MenuItem[] };
        }
      }
    } catch (error) {
      console.error("Error processing menu data:", error);
    }
  }
  
  return (
    <MenuContext.Provider value={{ menu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export { MenuContext };
