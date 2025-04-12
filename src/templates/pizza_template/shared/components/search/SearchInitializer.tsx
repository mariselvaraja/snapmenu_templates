import React from 'react';
import { useSearchInitializer } from '../../hooks';

/**
 * Component that initializes the search service
 * This component doesn't render anything, it just uses the useSearchInitializer hook
 */
const SearchInitializer: React.FC = () => {
  // Use the hook to initialize the search service
  useSearchInitializer();
  
  // This component doesn't render anything
  return null;
};

export default SearchInitializer;
