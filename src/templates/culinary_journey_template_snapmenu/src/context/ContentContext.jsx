import React, { createContext, useContext } from 'react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';
import { useRootMenu } from '../../../../context/RootMenuContext';
import defaultSiteContent from '../../src/data/site-content.json';

export const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  // Get data from root contexts
  const { siteContent: rootSiteContent, loading: siteContentLoading, error: siteContentError } = useRootSiteContent();
  const { menu, loading: menuLoading, error: menuError } = useRootMenu();
  
  // Transform the site content structure if needed
  const transformedSiteContent = rootSiteContent ? {
    // Use navigationBar properties if available, otherwise use top-level properties or defaults
    brand: rootSiteContent.navigationBar?.brand || rootSiteContent.brand || defaultSiteContent.brand,
    hero: rootSiteContent.navigationBar?.hero || rootSiteContent.hero || defaultSiteContent.hero,
    experience: rootSiteContent.navigationBar?.experience || rootSiteContent.experience || defaultSiteContent.experience,
    story: rootSiteContent.story || defaultSiteContent.story,
    blog: rootSiteContent.blog || defaultSiteContent.blog,
    gallery: rootSiteContent.gallery || defaultSiteContent.gallery,
    events: rootSiteContent.events || defaultSiteContent.events,
    contact: rootSiteContent.contact || defaultSiteContent.contact,
    footer: rootSiteContent.footer || defaultSiteContent.footer,
    reservation: rootSiteContent.reservation || defaultSiteContent.reservation
  } : defaultSiteContent;
  
  // Combine loading and error states
  const loading = siteContentLoading || menuLoading;
  const error = siteContentError || menuError;

  const value = {
    siteContent: transformedSiteContent,
    content: defaultSiteContent, // Keep the original content for backward compatibility
    menu,
    loading,
    error,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
