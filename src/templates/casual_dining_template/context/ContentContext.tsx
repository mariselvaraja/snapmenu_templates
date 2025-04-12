import React, { createContext, useContext } from 'react';
import siteContent from '../data/siteContent.json';

export interface ContentContextType {
  siteContent: typeof siteContent;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: React.ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  return (
    <ContentContext.Provider value={{ siteContent }}>
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
