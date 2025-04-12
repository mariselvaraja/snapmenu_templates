import React, { createContext, useContext } from 'react';
import menuData from '../data/menu.json';

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
  const menu = menuData.menu as { [category: string]: MenuItem[] };

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
