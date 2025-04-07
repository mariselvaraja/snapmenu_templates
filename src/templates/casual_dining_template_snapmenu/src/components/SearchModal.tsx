import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuickLink {
  text: string;
  query: string;
}

const QUICK_LINKS: QuickLink[] = [
  { text: 'Vegan', query: 'vegan' },
  { text: 'Vegetarian', query: 'vegetarian' },
  { text: 'Gluten Free', query: 'gluten free' },
  { text: 'Healthy Options', query: 'healthy' },
  { text: 'Spicy', query: 'spicy' },
  { text: 'Salads', query: 'salad' },
  { text: 'Desserts', query: 'dessert' }
];

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({ results: [], grouped: {} });
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { search, isLoading, isSearchInitialized } = useSearch();

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

  // Perform search
  const performSearch = async (searchQuery: string) => {
    console.log('Starting search with query:', searchQuery);
    if (!searchQuery.trim()) {
      console.log('Empty query, clearing results');
      setResults({ results: [], grouped: {} });
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      if (!isSearchInitialized) {
        console.log('Search not ready');
        setError('Search is initializing, please try again in a moment');
        return;
      }

      console.log('Search service ready, performing search for:', searchQuery);
      const searchResults = await search(searchQuery);
      console.log('Raw search results:', searchResults);

      if (!searchResults) {
        console.error('No search results returned');
        setError('No results found');
        setResults({ results: [], grouped: {} });
        return;
      }

      if (!searchResults.results || !searchResults.grouped) {
        console.error('Invalid search results format:', searchResults);
        setError('Invalid search results format');
        setResults({ results: [], grouped: {} });
        return;
      }

      if (!searchResults.results || searchResults.results.length === 0) {
        setError('No results found. Try searching for something else.');
        setResults({ results: [], grouped: {} });
        return;
      }

      console.log('Setting search results:', {
        results: searchResults.results.length,
        categories: Object.keys(searchResults.grouped)
      });
      setResults(searchResults);
      setError(null);
    } catch (error: any) {
      console.error('Search error:', error);
      setError(error.message);
      setResults({ results: [], grouped: {} });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleItemSelect = (result: any) => {
    const path = `/menu/${result.item.category}/${result.item.id}`;
    handleClose();
    navigate(path);
  };

  // Get flattened list of all items for keyboard navigation
  const allItems = React.useMemo(() => {
    if (!results.grouped) return [];
    return Object.values(results.grouped)
      .flat()
      .sort((a: any, b: any) => b.score - a.score);
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
      console.log('Modal opened, resetting state');
      setSelectedIndex(-1);
      setQuery(''); // Clear query when opening
      // Add a small delay to ensure the input is focused after render
      setTimeout(() => {
        console.log('Attempting to focus input');
        if (inputRef.current) {
          inputRef.current.focus();
          console.log('Input focused');
        } else {
          console.log('Input ref not available');
        }
      }, 100);
    }
  }, [isOpen]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        performSearch(query);
      } else {
        setResults({ results: [], grouped: {} }); // Clear results when query is empty
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
  };

  const handleQuickLinkClick = (quickLink: QuickLink) => {
    setQuery(quickLink.query);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderHighlightedText = (text: string, searchQuery: string) => {
    if (!text || !searchQuery) return text || '';
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={i} className="bg-yellow-800 text-white">{part}</span> : part
    );
  };

  const renderLoadingState = () => {
    return (
      <div className="p-8 text-center text-gray-400">
        <Loader className="w-6 h-6 animate-spin mx-auto mb-4" />
        <p>Initializing search...</p>
      </div>
    );
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice);
  };

  const renderResultsByCategory = () => {
    console.log('Rendering results by category:', results);
    if (!results?.grouped || typeof results.grouped !== 'object') {
      console.warn('Invalid grouped results:', results);
      return (
        <div className="p-4 text-center text-gray-400">
          No results found
        </div>
      );
    }

    const categories = Object.entries(results.grouped)
      .filter(([_, items]) => Array.isArray(items) && items.length > 0)
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
      if (!Array.isArray(items) || items.length === 0) {
        console.warn(`Category ${category} has no items`);
        return null;
      }

      // Sort items by score within each category
      const sortedItems = [...items].sort((a: any, b: any) => b.score - a.score);

      return (
        <div key={category} className="mb-4">
          <h3 className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800/50">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h3>
          <div className="divide-y divide-gray-700">
            {sortedItems.map((result: any, index: number) => {
              // Ensure we have valid item data
              if (!result?.item?.name) {
                console.warn('Invalid search result:', result);
                return null;
              }

              const item = result.item;
              return (
                <div
                  key={item.id || `result-${index}`}
                  onClick={() => handleItemSelect(result)}
                  data-result-item
                  className={`px-4 py-3 hover:bg-gray-800 cursor-pointer ${
                    allItems.findIndex((i: any) => i.item.id === item.id) === selectedIndex ? 'bg-gray-800' : ''
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
                    <div className="mt-1 flex items-center gap-2">
                      {item.dietary?.isVegetarian && (
                        <span className="text-xs px-2 py-0.5 bg-green-900 text-green-100 rounded">
                          Vegetarian
                        </span>
                      )}
                      {item.dietary?.isVegan && (
                        <span className="text-xs px-2 py-0.5 bg-green-900 text-green-100 rounded">
                          Vegan
                        </span>
                      )}
                      {item.dietary?.isGlutenFree && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-900 text-yellow-100 rounded">
                          Gluten Free
                        </span>
                      )}
                    </div>
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
              disabled={!isSearchInitialized}
            />
          </div>

          {/* Quick links */}
          {!query && isSearchInitialized && (
            <div className="p-4 border-b border-gray-700">
              <div className="text-sm font-medium text-gray-400 mb-2">Quick Links</div>
              <div className="flex flex-wrap gap-2">
                {QUICK_LINKS.map((link) => (
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
            {!isSearchInitialized ? (
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
