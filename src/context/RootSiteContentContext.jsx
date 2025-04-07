import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const RootSiteContentContext = createContext(null);

export const RootSiteContentProvider = ({ children, restaurant_id, isPreview = false }) => {
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSiteContent = async () => {
      try {
        // Check if restaurant_id is provided
        if (restaurant_id) {
          // Construct the API URL
          const folderPath = isPreview ? 'preview' : 'v1';
          const apiUrl = `https://appliance.genaiembed.ai/p5093/content_management/get_folder_content?restaurant_id=${restaurant_id}&folder_path=${folderPath}`;
          
          // Make the API call
          const response = await axios.get(apiUrl);
          
          // Check if the response contains data
          if (response.data && response.data.siteContent) {
            setSiteContent(JSON.parse(response.data.siteContent));
          } else {
            throw new Error('Invalid response format from API');
          }
        } else {
          // Fallback to static content if restaurant_id is not provided
          const siteContentModule = await import('../static/siteContent/siteContent.json');
          setSiteContent(siteContentModule.default);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading site content:", error);
        
        // Fallback to static content in case of error
        try {
          const siteContentModule = await import('../static/siteContent/siteContent.json');
          setSiteContent(siteContentModule.default);
          console.warn("Falling back to static content due to API error");
        } catch (fallbackError) {
          console.error("Error loading fallback content:", fallbackError);
          setError(error);
        }
        
        setLoading(false);
      }
    };

    loadSiteContent();
  }, [restaurant_id, isPreview]);

  return (
    <RootSiteContentContext.Provider value={{ siteContent, loading, error }}>
      {children}
    </RootSiteContentContext.Provider>
  );
};

export const useRootSiteContent = () => {
  const context = useContext(RootSiteContentContext);
  if (!context) {
    throw new Error('useRootSiteContent must be used within a RootSiteContentProvider');
  }
  return context;
};
