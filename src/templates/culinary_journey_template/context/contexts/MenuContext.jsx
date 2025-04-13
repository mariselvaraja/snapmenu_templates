import React, { createContext, useContext, useEffect, useState } from 'react';
import searchService from '../../services/searchService';

// Define fallback menu data
const defaultMenu = {
  appetizers: [
    {
      id: "bruschetta",
      name: "Bruschetta",
      description: "Grilled bread rubbed with garlic and topped with diced tomatoes, fresh basil, and olive oil",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80",
      dietary: { isVegetarian: true, isVegan: false, isGlutenFree: false },
      ingredients: ["bread", "garlic", "tomatoes", "basil", "olive oil"],
      allergens: ["gluten"],
      category: "appetizers"
    },
    {
      id: "calamari",
      name: "Crispy Calamari",
      description: "Tender calamari lightly fried and served with lemon aioli",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80",
      dietary: { isVegetarian: false, isVegan: false, isGlutenFree: false },
      ingredients: ["calamari", "flour", "lemon", "garlic", "mayonnaise"],
      allergens: ["gluten", "seafood", "eggs"],
      category: "appetizers"
    }
  ],
  mains: [
    {
      id: "salmon",
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with lemon butter sauce, served with seasonal vegetables",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80",
      dietary: { isVegetarian: false, isVegan: false, isGlutenFree: true },
      ingredients: ["salmon", "butter", "lemon", "seasonal vegetables"],
      allergens: ["fish", "dairy"],
      category: "mains"
    },
    {
      id: "steak",
      name: "Filet Mignon",
      description: "8oz prime beef tenderloin, cooked to perfection with truffle mashed potatoes",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80",
      dietary: { isVegetarian: false, isVegan: false, isGlutenFree: true },
      ingredients: ["beef tenderloin", "potatoes", "truffle oil", "butter", "herbs"],
      allergens: ["dairy"],
      category: "mains"
    },
    {
      id: "risotto",
      name: "Truffle Risotto",
      description: "Creamy Arborio rice with wild mushrooms and truffle oil",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80",
      dietary: { isVegetarian: true, isVegan: false, isGlutenFree: true },
      ingredients: ["arborio rice", "mushrooms", "truffle oil", "parmesan", "butter"],
      allergens: ["dairy"],
      category: "mains"
    }
  ],
  desserts: [
    {
      id: "tiramisu",
      name: "Tiramisu",
      description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80",
      dietary: { isVegetarian: true, isVegan: false, isGlutenFree: false },
      ingredients: ["ladyfingers", "mascarpone", "coffee", "cocoa", "eggs"],
      allergens: ["gluten", "dairy", "eggs"],
      category: "desserts"
    },
    {
      id: "cheesecake",
      name: "New York Cheesecake",
      description: "Rich and creamy cheesecake with a graham cracker crust and berry compote",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80",
      dietary: { isVegetarian: true, isVegan: false, isGlutenFree: false },
      ingredients: ["cream cheese", "sugar", "eggs", "graham crackers", "berries"],
      allergens: ["gluten", "dairy", "eggs"],
      category: "desserts"
    }
  ]
};


// Create a context for backward compatibility
export const MenuContext = createContext();

const VERSION_HISTORY_KEY = 'menu_version_history';

// This hook provides menu data and related functionality
export function useMenu() {
  // Use fallback data directly instead of fetching from RootMenuContext
  const rootMenu = defaultMenu;
  const loading = false;
  const error = null;
  
  // Process menu data to handle different structures and extract categories
  const getProcessedMenu = () => {
    if (!rootMenu) return { menu: {}, categories: [], menuItems: [] };
    
    try {
      let menuObj;
      if (typeof rootMenu === 'object') {
        if ('menu' in rootMenu) {
          // If rootMenu has a menu property
          menuObj = rootMenu.menu;
        } else {
          // If rootMenu is directly the menu object
          menuObj = rootMenu;
        }
      } else {
        menuObj = {};
      }
      
      // Extract categories from menu object
      const categories = Object.keys(menuObj).map(categoryId => {
        // Convert category ID to a more readable name (e.g., 'main_courses' -> 'Main Courses')
        const categoryName = categoryId
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        return { id: categoryId, name: categoryName };
      });
      
      return {
        menu: menuObj,
        categories,
        menuItems: []
      };
    } catch (error) {
      console.error("Error processing menu data:", error);
      return { menu: {}, categories: [], menuItems: [] };
    }
  };
  
  const [menuData, setMenuData] = useState(getProcessedMenu());
  const [searchState, setSearchState] = useState(searchService.SEARCH_STATES.UNINITIALIZED);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchError, setSearchError] = useState(null);
  const [versionHistory, setVersionHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(VERSION_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load version history:', error);
      return [];
    }
  });
  
  // Update menuData when rootMenu changes
  useEffect(() => {
    setMenuData(getProcessedMenu());
  }, [rootMenu]);

  // Initialize search index when menu data is available
  useEffect(() => {
    console.log('MenuContext effect running, menu data:', menuData);

    const handleStateChange = (state, error, progress) => {
      console.log('Search state changed:', state, error, progress);
      setSearchState(state);
      setSearchError(error);
      setSearchProgress(progress);
    };

    searchService.addStateListener(handleStateChange);

    let mounted = true;

    const initializeSearch = async () => {
      if (!mounted || !menuData?.menu || searchState !== searchService.SEARCH_STATES.UNINITIALIZED) {
        return;
      }

      console.log('Starting search initialization with menu:', menuData.menu);
      
      // Ensure menu data is valid
      if (typeof menuData.menu !== 'object') {
        console.error('Invalid menu data:', menuData.menu);
        setSearchError('Invalid menu data structure');
        return;
      }

      try {
        // Clean up old search index if it exists
        await searchService.cleanup();
        
        // Flatten menu data into a single array
        const flattenedMenu = [];
        
        // Process each category
        for (const [category, items] of Object.entries(menuData.menu)) {
          console.log(`Processing category ${category}:`, items);
          
          if (!Array.isArray(items)) {
            console.warn(`Skipping invalid category ${category}:`, items);
            continue;
          }

          // Process items in this category
          for (const item of items) {
            if (!item || !item.id || !item.name) {
              console.warn(`Skipping invalid item in ${category}:`, item);
              continue;
            }

            // Add item with validated fields
            const processedItem = {
              ...item, // Keep all original fields
              id: item.id,
              name: item.name,
              description: item.description || '',
              price: parseFloat(item.price) || 0,
              category: category,
              subCategory: item.subCategory || '',
              dietary: item.dietary || {},
              ingredients: item.ingredients || [],
              allergens: item.allergens || [],
              pairings: item.pairings || [],
              image: item.image || '',
              nutrients: item.nutrients || {},
              calories: item.calories || 0
            };

            console.log(`Adding processed item:`, processedItem);
            flattenedMenu.push(processedItem);
          }
        }

        console.log('Processed menu items:', flattenedMenu.length);

        if (flattenedMenu.length === 0) {
          throw new Error('No valid menu items found');
        }

        // Initialize search with validated data
        if (mounted && flattenedMenu.length > 0) {
          // Transform menu data into expected format
          const searchData = {
            items: flattenedMenu.map(item => ({
              ...item,
              // Ensure all fields are present and properly formatted
              id: item.id,
              name: item.name,
              description: item.description || '',
              price: typeof item.price === 'string' ? parseFloat(item.price) : item.price || 0,
              category: item.category,
              subCategory: item.subCategory || '',
              dietary: {
                isVegetarian: item.dietary?.isVegetarian || false,
                isVegan: item.dietary?.isVegan || false,
                isGlutenFree: item.dietary?.isGlutenFree || false
              },
              ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
              allergens: Array.isArray(item.allergens) ? item.allergens : [],
              pairings: Array.isArray(item.pairings) ? item.pairings : [],
              image: item.image || '',
              nutrients: item.nutrients || {},
              calories: typeof item.calories === 'number' ? item.calories : 0
            }))
          };

          console.log('Initializing search with data:', searchData);
          await searchService.initializeIndex(searchData);
        } else {
          console.warn('No menu items to initialize search with');
        }
      } catch (error) {
        if (mounted) {
          console.error('Failed to initialize search:', error);
          setSearchError(error.message);
        }
      }
    };

    // Start initialization
    initializeSearch().catch(error => {
      if (mounted) {
        console.error('Search initialization failed:', error);
        setSearchError(error.message);
      }
    });

    return () => {
      console.log('Cleaning up search listener');
      mounted = false;
      searchService.removeStateListener(handleStateChange);
    };
  }, [menuData, searchState]);

  // Save version history whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(VERSION_HISTORY_KEY, JSON.stringify(versionHistory));
    } catch (error) {
      console.error('Failed to save version history:', error);
    }
  }, [versionHistory]);

  // Function to update menu data
  const updateMenu = async (newMenuData) => {
    setMenuData(newMenuData);
    // Reset search state to trigger re-initialization
    setSearchState(searchService.SEARCH_STATES.UNINITIALIZED);
    // Clean up old search index
    await searchService.cleanup();
  };

  // Function to save a new menu version
  const saveNewVersion = (version) => {
    const newVersion = {
      ...version,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };
    setVersionHistory(prev => [newVersion, ...prev]);
  };

  // Function to get version history
  const getVersionHistory = () => {
    return versionHistory;
  };

  // Function to restore a specific version
  const restoreVersion = async (versionId) => {
    const version = versionHistory.find(v => v.id === versionId);
    if (version) {
      await updateMenu(version.transformed);
      return true;
    }
    return false;
  };

  // Function to delete a version
  const deleteVersion = (versionId) => {
    setVersionHistory(prev => prev.filter(v => v.id !== versionId));
  };

  return { 
    menu: menuData.menu,
    menuData, // Keep original property for backward compatibility
    updateMenu, 
    searchState, 
    searchProgress, 
    searchError,
    isSearchInitialized: searchState === searchService.SEARCH_STATES.READY,
    saveNewVersion,
    getVersionHistory,
    restoreVersion,
    deleteVersion
  };
}

// For backward compatibility, keep the MenuProvider but make it a pass-through
export function MenuProvider({ children }) {
  const menuContext = useMenu();
  
  return (
    <MenuContext.Provider value={menuContext}>
      {children}
    </MenuContext.Provider>
  );
}
