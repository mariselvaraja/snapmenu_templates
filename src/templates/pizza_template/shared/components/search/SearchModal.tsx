import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { closeSearchModal, setSearchQuery, setSearchResults, setSearchState } from '../../redux/slices/searchSlice';
import { searchService, SearchState } from '../../services';

// Format price to display with currency symbol
const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Get search state from Redux
  const { query, results, searchState, error } = useAppSelector((state) => state.search);
  
  // Local state
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchProgress, setSearchProgress] = useState(0);
  
  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Listen for search service state changes
  useEffect(() => {
    const handleStateChange = (state: SearchState, error: string | null, progress: number) => {
      dispatch(setSearchState({ state, error, progress }));
      setSearchProgress(progress);
    };

    searchService.addStateListener(handleStateChange);
    
    // Add a timeout to automatically transition to ready state if stuck in loading
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (searchState === SearchState.LOADING || searchState === SearchState.UNINITIALIZED) {
      timeoutId = setTimeout(() => {
        console.log('Search initialization timeout - forcing ready state');
        dispatch(setSearchState({ 
          state: SearchState.READY, 
          error: null, 
          progress: 100 
        }));
      }, 5000); // 5 second timeout
    }
    
    return () => {
      searchService.removeStateListener(handleStateChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [dispatch, searchState]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Perform search with debounce
  useEffect(() => {
    if (!query) {
      dispatch(setSearchResults({ results: [], grouped: {} }));
      setIsSearching(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (searchState !== SearchState.READY) {
        return;
      }

      setIsSearching(true);
      try {
        const searchResults = await searchService.search(query);
        dispatch(setSearchResults(searchResults));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, searchState, dispatch]);

  // Handle close
  const handleClose = () => {
    onClose();
  };

  // Handle item select
  const handleItemSelect = (result: any) => {
    handleClose();
    navigate(`/product/${result.item.id}`);
  };

  // Get flattened list of all items for keyboard navigation
  const allItems = React.useMemo(() => {
    if (!results.grouped) return [];
    return Object.values(results.grouped)
      .flat()
      .sort((a, b) => b.similarity - a.similarity);
  }, [results.grouped]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < allItems.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && allItems[selectedIndex]) {
            handleItemSelect(allItems[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allItems, selectedIndex, navigate]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      // Find all item elements
      const itemElements = resultsRef.current.querySelectorAll('[data-result-item]');
      const selectedElement = itemElements[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(-1);
      // Add a small delay to ensure the input is focused after render
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
    setSelectedIndex(-1);
  };

  // Get menu data from Redux store
  const menuItems = useAppSelector((state) => state.menu.items);
  const menuCategories = useAppSelector((state) => state.menu.categories);

  // Dispatch action to fetch menu data if not already loaded
  useEffect(() => {
    // If menu items are empty, dispatch action to fetch menu data
    if ((!menuItems || menuItems.length === 0) && 
        (!menuCategories || menuCategories.length === 0)) {
      dispatch({ type: 'menu/fetchMenuRequest' });
    }
  }, [dispatch, menuItems, menuCategories]);
  
  // Generate quick links from menu categories
  const quickLinks = React.useMemo(() => {
    // First try to use menu categories from Redux
    if (menuCategories && menuCategories.length > 0) {
      return menuCategories.map(category => ({
        text: category.name,
        query: category.name.toLowerCase()
      }));
    }
    
    // If no categories in Redux, extract unique categories from menu items
    if (menuItems && menuItems.length > 0) {
      const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
      return uniqueCategories.map(category => ({
        text: category.charAt(0).toUpperCase() + category.slice(1),
        query: category.toLowerCase()
      }));
    }
    
    // Default fallback if API data isn't loaded yet
    return [
      { text: 'Starters', query: 'starters' },
      { text: 'Mains', query: 'mains' },
      { text: 'Desserts', query: 'desserts' },
      { text: 'Drinks', query: 'drinks' }
    ];
  }, [menuCategories, menuItems]);

  // Handle quick link click
  const handleQuickLinkClick = (quickLink: { text: string, query: string }) => {
    dispatch(setSearchQuery(quickLink.query));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Render highlighted text
  const renderHighlightedText = (text: string, searchQuery: string) => {
    if (!text || !searchQuery) return text || '';
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={i} className="bg-gray-700 text-white">{part}</span> : part
    );
  };

  // Render loading state
  const renderLoadingState = () => {
    let message = 'Initializing search...';
    if (searchState === SearchState.LOADING) {
      message = 'Loading search index...';
    }

    return (
      <div className="p-8 text-center text-gray-400">
        <Loader className="w-6 h-6 animate-spin mx-auto mb-4" />
        <p>{message}</p>
      </div>
    );
  };

  // Render results by category
  const renderResultsByCategory = () => {
    if (!results?.grouped || typeof results.grouped !== 'object') {
      return (
        <div className="p-4 text-center text-gray-400">
          No results found
        </div>
      );
    }

    const categories = Object.entries(results.grouped)
      .filter(([_, items]) => items && items.length > 0)
      .sort(([a], [b]) => a.localeCompare(b));

    if (categories.length === 0) {
      return (
        <div className="p-4 text-center text-gray-400">
          No results found. Try searching for something else.
        </div>
      );
    }

    return categories.map(([category, items]) => {
      // Only render category if it has items
      if (!items || items.length === 0) {
        return null;
      }

      // Sort items by score within each category
      const sortedItems = [...items].sort((a, b) => b.similarity - a.similarity);

      return (
        <div key={category} className="mb-4">
          <h3 className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800/50">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h3>
          <div className="divide-y divide-gray-700">
            {sortedItems.map((result, index) => {
              // Ensure we have valid item data
              if (!result?.item?.name) {
                return null;
              }

              const item = result.item;
              return (
                <div
                  key={item.id || `result-${index}`}
                  onClick={() => handleItemSelect(result)}
                  data-result-item
                  className={`px-4 py-3 hover:bg-gray-800 cursor-pointer ${
                    allItems.findIndex(i => i.item.id === item.id) === selectedIndex ? 'bg-gray-800' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white">
                          {renderHighlightedText(item.name, query)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {renderHighlightedText(item.description || 'No description available', query)}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-300 ml-4">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-1 flex items-center gap-2">
                        {item.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-100 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }).filter(Boolean); // Remove null categories
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <div
          ref={searchRef}
          className="inline-block w-full max-w-2xl my-16 text-left align-middle transition-all transform bg-gray-900 shadow-xl rounded-xl relative"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search menu..."
              className="w-full p-4 pl-12 text-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none rounded-t-xl"
              disabled={searchState !== SearchState.READY}
            />
          </div>

          {/* Quick links */}
          {!query && searchState === SearchState.READY && (
            <div className="p-4 border-b border-gray-700">
              <div className="text-sm font-medium text-gray-400 mb-2">Quick Links</div>
              <div className="flex flex-wrap gap-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.query}
                    onClick={() => handleQuickLinkClick(link)}
                    className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    {link.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {searchState !== SearchState.READY ? (
              renderLoadingState()
            ) : error ? (
              <div className="p-4 text-center text-red-400">
                Error: {error}
              </div>
            ) : isSearching ? (
              <div className="p-4 text-center text-gray-400">
                Searching...
              </div>
            ) : query ? (
              <div ref={resultsRef}>
                {renderResultsByCategory()}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 text-sm text-gray-400 border-t border-gray-700">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">⌘K</kbd> to search
            •{' '}
            <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">ESC</kbd> to close
            •{' '}
            <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">↑↓</kbd> to navigate
            •{' '}
            <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">↵</kbd> to select
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
