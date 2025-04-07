import { createContext, useContext } from 'react';
import { useRootMenu } from '../../../../context/RootMenuContext';

/**
 * @typedef {Object} MenuItem
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} price
 * @property {string} image
 * @property {string} category
 * @property {string} subCategory
 * @property {number} calories
 * @property {Object} nutrients
 * @property {string} nutrients.protein
 * @property {string} nutrients.carbs
 * @property {string} nutrients.fat
 * @property {string} nutrients.sat
 * @property {string} nutrients.unsat
 * @property {string} nutrients.trans
 * @property {string} nutrients.sugar
 * @property {string} nutrients.fiber
 * @property {Object} dietary
 * @property {boolean} dietary.isVegetarian
 * @property {boolean} dietary.isVegan
 * @property {boolean} dietary.isGlutenFree
 * @property {string[]} allergens
 * @property {string[]} ingredients
 * @property {string[]} pairings
 */

/**
 * @typedef {Object} MenuData
 * @property {Object} menu
 * @property {MenuItem[]} menu.starters
 * @property {MenuItem[]} menu.mains
 * @property {MenuItem[]} menu.desserts
 * @property {MenuItem[]} menu.drinks
 */

/**
 * @typedef {Object} CategoryType
 * @property {string} id
 * @property {string} name
 * @property {string} type
 */

/**
 * @typedef {Object} SubCategoryType
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} MenuContextType
 * @property {MenuData} menuData
 * @property {CategoryType[]} categories
 * @property {SubCategoryType[]} subCategories
 */

export const MenuContext = createContext();

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function MenuProvider({ children }) {
  const { menu, loading, error } = useRootMenu();
  
  // Initialize with empty arrays to prevent errors
  let initialCategoryList = [];
  let categoryList = [{ id: 'all', name: 'All Items', type: 'all' }];
  let subCategoryList = [];
  
  // Only process menu data if it exists
  if (menu) {
    initialCategoryList = Object.keys(menu).map(key => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      type: key
    }));

    categoryList = [
      { id: 'all', name: 'All Items', type: 'all' },
      ...initialCategoryList
    ];

    // Check if mains category exists before processing
    if (menu.mains) {
      const mainsSubcategories = Array.from(new Set(menu.mains.map(item => item.subCategory)))
        .filter(subCategory => subCategory)
        .map(subCategory => ({
          id: subCategory,
          name: subCategory.charAt(0).toUpperCase() + subCategory.slice(1)
        }));
      subCategoryList.push(...mainsSubcategories);
    }
  }


  const contextValue = {
    menuData: { menu },
    categories: categoryList,
    subCategories: subCategoryList,
    loading,
    error
  };



  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
}

// Custom hook to use the menu context
export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }

  return context;
}
