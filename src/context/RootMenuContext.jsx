import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const RootMenuContext = createContext(null);

export const RootMenuProvider = ({ children, restaurant_id, isPreview = false }) => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        // Check if restaurant_id is provided
        if (restaurant_id) {
          // Construct the API URL
          const folderPath = isPreview ? 'preview' : 'v1';
          const apiUrl = `https://appliance.genaiembed.ai/p5093/content_management/get_menu_content?restaurant_id=${restaurant_id}`;
          
          // Make the API call
          const response = await axios.get(apiUrl);
          
          // Check if the response contains data
          if (response.data && response.data.menu) {
            // Check if response.data.menu is a string that needs to be parsed
            if (typeof response.data.menu === 'string') {
              try {
                console.log("Parsing menu string:", response.data.menu);
                const parsedMenu = JSON.parse(response.data.menu);
                
                // Check if parsedMenu is an array of menu items
                if (Array.isArray(parsedMenu)) {
                  console.log("Menu data is an array, transforming to categorized object");
                  // Transform the array into a categorized object
                  const categorizedMenu = {};
                  
                  // Group items by category
                  parsedMenu.forEach(item => {
                    const category = item.category || 'uncategorized';
                    // Convert category to lowercase and replace spaces with underscores for consistency
                    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '_');
                    
                    if (!categorizedMenu[normalizedCategory]) {
                      categorizedMenu[normalizedCategory] = [];
                    }
                    
                    // Transform the item to match expected structure
                    const transformedItem = {
                      ...item,
                      // Ensure these properties exist and are in the expected format
                      id: item.id || item.sku_id || `item-${Math.random().toString(36).substr(2, 9)}`,
                      name: item.name || '',
                      description: item.description || '',
                      price: item.price ? item.price.replace('$', '') : '0',
                      image: item.image || '',
                      category: normalizedCategory,
                      subCategory: item.subCategory || '',
                      calories: item.calories || 0,
                      nutrients: item.nutrients || {},
                      dietary: item.dietary || {
                        isVegetarian: item.is_vegan === 'yes',
                        isVegan: item.is_vegan === 'yes',
                        isGlutenFree: false
                      },
                      allergens: item.allergens || [],
                      ingredients: item.ingredients || [],
                      pairings: item.pairings || []
                    };
                    
                    categorizedMenu[normalizedCategory].push(transformedItem);
                  });
                  
                  console.log("Transformed menu:", categorizedMenu);
                  setMenu({ menu: categorizedMenu });
                } else {
                  // If it's already in the expected format
                  console.log("Menu data is already in expected format");
                  setMenu(parsedMenu);
                }
              } catch (parseError) {
                console.error("Error parsing menu JSON:", parseError);
                console.log("Using raw menu data");
                setMenu(response.data.menu);
              }
            } else {
              // If it's already an object, use it directly
              console.log("Menu data is already an object");
              setMenu(response.data.menu);
            }
          } else if (response.data) {
            // If response.data exists but doesn't have a menu property,
            // it might be the menu object itself
            setMenu(response.data);
          } else {
            throw new Error('Invalid response format from API');
          }

        } else {
          // Fallback to static content if restaurant_id is not provided
          const menuModule = await import('../data/menu.json');
          setMenu(menuModule.default);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading menu data:", error);
        
        // Fallback to static content in case of error
        try {
          const menuModule = await import('../data/menu.json');
          setMenu(menuModule.default);
          console.warn("Falling back to static menu content due to API error");
        } catch (fallbackError) {
          console.error("Error loading fallback menu content:", fallbackError);
          setError(error);
        }
        
        setLoading(false);
      }
    };

    loadMenu();
  }, [restaurant_id, isPreview]);

  return (
    <RootMenuContext.Provider value={{ menu, loading, error }}>
      {children}
    </RootMenuContext.Provider>
  );
};

export const useRootMenu = () => {
  const context = useContext(RootMenuContext);
  if (!context) {
    throw new Error('useRootMenu must be used within a RootMenuProvider');
  }
  return context;
};
