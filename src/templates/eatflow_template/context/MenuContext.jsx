import React, { createContext, useState, useEffect } from 'react';

export const MenuContext = createContext(null);

export const MenuProvider = ({ children, restaurant_id, isPreview }) => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuData = await import(`../data/${restaurant_id}/v1/menu.json`);
        setMenu(menuData);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurant_id]);

  return (
    <MenuContext.Provider value={{ menu, loading, error, restaurant_id, isPreview }}>
      {children}
    </MenuContext.Provider>
  );
};

import { useContext } from 'react';

export const useMenu = () => {
  return useContext(MenuContext);
};
