import React, { createContext, useContext, ReactNode } from 'react';
import { useRootMenu } from '../../../../context/RootMenuContext';

// Define types for menu structure
export interface MenuItem {
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

export interface MenuData {
  menu: {
    starters: MenuItem[];
    mains: MenuItem[];
    desserts: MenuItem[];
    drinks: MenuItem[];
    [key: string]: MenuItem[]; // Index signature to allow string indexing
  };
}

// Create the context with default undefined value
export interface CategoryType {
  id: string;
  name: string;
  type: string;
}

export interface SubCategoryType {
  id: string;
  name: string;
}

export interface MenuContextType {
  menuData: MenuData;
  categories: CategoryType[];
  subCategories: SubCategoryType[];
}


export const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Props for the provider component
interface MenuProviderProps {
  children: ReactNode;
}

// Provider component that will wrap the app
export function MenuProvider({ children }: MenuProviderProps) {
  // Get data from root context
  const { menu, loading, error } = useRootMenu();
  console.log("Root Menu Context in Pizza Template:", { menu, loading, error });
  
  // Initialize with empty arrays to prevent errors
  let initialCategoryList: CategoryType[] = [];
  let categoryList: CategoryType[] = [{ id: 'all', name: 'All Items', type: 'all' }];
  let subCategoryList: SubCategoryType[] = [];
  let menuData: MenuData = { menu: {} as any };
  
  // Only process menu data if it exists
  if (menu) {
    console.log("Processing menu:", typeof menu, menu);
    
    try {
      // Determine if menu is the direct menu object or contains a menu property
      if (typeof menu === 'object') {
        if ('menu' in menu) {
          // If menu has a menu property
          console.log("menu has menu property");
          menuData = menu as MenuData;
        } else {
          // If menu is directly the menu object
          console.log("menu is directly the menu object");
          menuData = { menu: menu as any };
        }
        
        // Generate category list from menu keys
        initialCategoryList = Object.keys(menuData.menu).map(key => ({
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          type: key
        }));

        categoryList = [
          { id: 'all', name: 'All Items', type: 'all' },
          ...initialCategoryList
        ];

        // Check if mains category exists before processing
        if (menuData.menu.mains) {
          const mainsSubcategories = Array.from(new Set(menuData.menu.mains.map(item => item.subCategory)))
            .filter(subCategory => subCategory)
            .map(subCategory => ({
              id: subCategory,
              name: subCategory.charAt(0).toUpperCase() + subCategory.slice(1)
            }));
          subCategoryList.push(...mainsSubcategories);
        }
      } else {
        console.log("menu is not an object, using empty default");
        // Import local menu data as fallback
        const localMenuData = require('../data/menu.json');
        menuData = localMenuData;
      }
    } catch (error) {
      console.error("Error processing menu data:", error);
      // Import local menu data as fallback
      const localMenuData = require('../data/menu.json');
      menuData = localMenuData;
    }
  } else {
    console.log("No menu data, using empty default or fallback");
    try {
      // Import local menu data as fallback
      const localMenuData = require('../data/menu.json');
      menuData = localMenuData;
      
      // Generate category list from fallback menu
      initialCategoryList = Object.keys(menuData.menu).map(key => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        type: key
      }));

      categoryList = [
        { id: 'all', name: 'All Items', type: 'all' },
        ...initialCategoryList
      ];

      if (menuData.menu.mains) {
        const mainsSubcategories = Array.from(new Set(menuData.menu.mains.map(item => item.subCategory)))
          .filter(subCategory => subCategory)
          .map(subCategory => ({
            id: subCategory,
            name: subCategory.charAt(0).toUpperCase() + subCategory.slice(1)
          }));
        subCategoryList.push(...mainsSubcategories);
      }
    } catch (fallbackError) {
      console.error("Error loading fallback menu data:", fallbackError);
    }
  }
  
  console.log("Final menuData:", menuData);

  const contextValue: MenuContextType = {
    menuData,
    categories: categoryList,
    subCategories: subCategoryList
  };

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
}

// Custom hook to use the menu context
// Custom hook to use the menu context
export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }

  return context;
}
