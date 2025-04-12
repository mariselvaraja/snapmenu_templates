import { createContext, useContext, ReactNode } from 'react';
import menuData from '../data/menu.json';

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
  const initialCategoryList: CategoryType[] = Object.keys(menuData.menu).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    type: key
  }));

  const categoryList: CategoryType[] = [
    { id: 'all', name: 'All Items', type: 'all' },
    ...initialCategoryList
  ];


  const subCategoryList: SubCategoryType[] = [];
  if (menuData.menu.mains) {
    const mainsSubcategories = Array.from(new Set(menuData.menu.mains.map(item => item.subCategory)))
      .filter(subCategory => subCategory)
      .map(subCategory => ({
        id: subCategory,
        name: subCategory.charAt(0).toUpperCase() + subCategory.slice(1)
      }));
    subCategoryList.push(...mainsSubcategories);
  }


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
