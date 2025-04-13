import React, { createContext, useState, useEffect } from 'react';

// Create SiteContentContext
export const SiteContentContext = createContext(null);

// SiteContentProvider Component
export const SiteContentProvider = ({ children, restaurant_id, isPreview }) => {
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSiteContent = async () => {
      try {
        // Import siteContent.json
        console.log(`restaurant_id: ${restaurant_id}`);
        console.log(`isPreview: ${isPreview}`);
        const data = await import(`../data/${restaurant_id}/v1/siteContent.json`);
        setSiteContent(data.default);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    loadSiteContent();
  }, [restaurant_id, isPreview]);

  const value = {
    siteContent,
    loading,
    error,
    restaurant_id,
    isPreview,
  };

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

import { useContext } from 'react';

// useSiteContent Hook
export const useSiteContent = () => {
  return useContext(SiteContentContext);
};
