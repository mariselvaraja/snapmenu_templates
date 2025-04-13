import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMenu } from './MenuContext';
import searchService from '../../services/searchService';

// Create a context for search functionality
export const SearchContext = createContext();

// This hook provides search functionality using the menu data
export function useSearch() {
  const { menu, menuData } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ results: [], grouped: {} });
  const [isSearching, setIsSearching] = useState(false);
  const [searchState, setSearchState] = useState(searchService.SEARCH_STATES.UNINITIALIZED);
  const [searchError, setSearchError] = useState(null);

  // Listen for search service state changes
  useEffect(() => {
    const handleStateChange = (state, error) => {
      console.log('Search state changed:', state, error);
      setSearchState(state);
      setSearchError(error);
    };

    searchService.addStateListener(handleStateChange);

    return () => {
      searchService.removeStateListener(handleStateChange);
    };
  }, []);

  // Function to perform search
  const search = async (query) => {
    if (!query?.trim()) {
      setSearchResults({ results: [], grouped: {} });
      return { results: [], grouped: {} };
    }

    if (searchState !== searchService.SEARCH_STATES.READY) {
      console.warn('Search not ready yet');
      return { results: [], grouped: {} };
    }

    try {
      setIsSearching(true);
      setSearchQuery(query);
      
      console.log('Performing search for:', query);
      const results = await searchService.search(query);
      
      console.log('Search results:', results);
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error.message);
      return { results: [], grouped: {} };
    } finally {
      setIsSearching(false);
    }
  };

  // Function to clear search results
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ results: [], grouped: {} });
  };

  return {
    search,
    clearSearch,
    searchQuery,
    searchResults,
    isSearching,
    searchState,
    searchError,
    isSearchInitialized: searchState === searchService.SEARCH_STATES.READY,
    // Also provide menu data for convenience
    menu,
    menuData
  };
}

// SearchProvider component
export function SearchProvider({ children }) {
  const searchContext = useSearch();
  
  return (
    <SearchContext.Provider value={searchContext}>
      {children}
    </SearchContext.Provider>
  );
}
