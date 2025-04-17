import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../common/store';
import { setSearchQuery, setSearchResults, setSearchState } from '../../../redux/slices/searchSlice';
import { addItem, toggleDrawer } from '../../../common/redux/slices/cartSlice';
import searchService, { SearchState as SearchServiceState } from '../../../services/searchService';

interface SearchBarComponentProps {
  onClose: () => void;
}

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Get search state and menu data from Redux
  const { query, results, searchState, error } = useSelector((state: RootState) => state.search);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const menuCategories = useSelector((state: RootState) => state.menu.categories);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Local state
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input on mount and clear any existing search query
  useEffect(() => {
    // Clear any existing search query when component mounts
    dispatch(setSearchQuery(''));
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [dispatch]);

  // Perform search with debounce
  useEffect(() => {
    if (!query) {
      dispatch(setSearchResults({ results: [], grouped: {} }));
      setIsSearching(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (searchState !== SearchServiceState.READY) {
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

  // Handle item select
  const handleItemSelect = (item: any) => {
    onClose();
    navigate(`/product/${item.id}`);
  };

  // Get flattened list of all items for keyboard navigation
  const allItems = React.useMemo(() => {
    if (!results.grouped) return [];
    return Object.values(results.grouped)
      .flat()
      .sort((a: any, b: any) => b.similarity - a.similarity);
  }, [results.grouped]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
            handleItemSelect(allItems[selectedIndex].item);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [allItems, selectedIndex, navigate, onClose]);

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

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
    setSelectedIndex(-1);
  };

  // Format price to display with currency symbol
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  // Render highlighted text
  const renderHighlightedText = (text: string, searchQuery: string) => {
    if (!text || !searchQuery) return text || '';
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part: string, i: number) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={i} className="bg-red-100 text-red-800">{part}</span> : part
    );
  };

  // Render menu items in a grid
  const renderMenuItemsGrid = (items: any[], highlightQuery: boolean = false) => {
    if (!items || items.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No items found
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {items.map((item, index) => (
          <div
            key={item.id || `item-${index}`}
            data-result-item={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-32 bg-gray-100">
              <div 
                className="w-full h-full cursor-pointer"
                onClick={() => handleItemSelect(item)}
              >
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-red-100">
                    <span className="text-3xl font-bold text-red-500">
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Dietary Information */}
              {item.dietary && (
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {item.dietary.isVegetarian && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Veg
                    </div>
                  )}
                  {item.dietary.isVegan && (
                    <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Vegan
                    </div>
                  )}
                  {item.dietary.isGlutenFree && (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      GF
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-3">
              <h4 
                className="font-medium text-gray-800 mb-1 line-clamp-1 cursor-pointer"
                onClick={() => handleItemSelect(item)}
              >
                {highlightQuery ? renderHighlightedText(item.name, query) : item.name}
              </h4>
              <p 
                className="text-xs text-gray-500 line-clamp-2 cursor-pointer"
                onClick={() => handleItemSelect(item)}
              >
                {highlightQuery ? renderHighlightedText(item.description || 'No description available', query) : (item.description || 'No description available')}
              </p>
              
              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-2 mb-3 flex flex-wrap items-center gap-1">
                  {item.tags.slice(0, 2).map((tag: string, idx: number) => (
                    <span key={idx} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                  )}
                </div>
              )}
              
              {/* Price and Add to Order */}
              <div className="flex justify-between items-center mt-auto">
                <p className="text-sm font-bold text-red-500">{formatPrice(item.price)}</p>
                <button 
                  onClick={() => {
                    dispatch(addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      image: item.image || ''
                    }));
                  }}
                  className="text-xs flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  Add <Plus className='text-xs'/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render results by category
  const renderResultsByCategory = () => {
    if (!results?.grouped || typeof results.grouped !== 'object') {
      return (
        <div className="p-4 text-center text-gray-500">
          No results found
        </div>
      );
    }

    const categories = Object.entries(results.grouped)
      .filter(([_, items]: [string, unknown]) => Array.isArray(items) && items.length > 0)
      .sort(([a]: [string, unknown], [b]: [string, unknown]) => a.localeCompare(b));

    if (categories.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No results found. Try searching for something else.
        </div>
      );
    }

    return categories.map(([category, items]: [string, unknown]) => {
      // Type guard to ensure items is an array
      if (!Array.isArray(items)) return null;
      // Only render category if it has items
      if (!items || items.length === 0) {
        return null;
      }

      // Sort items by score within each category
      const sortedItems = [...items].sort((a: any, b: any) => b.similarity - a.similarity);
      const mappedItems = sortedItems.map(result => result.item);

      return (
        <div key={category} className="mb-6">
          <h3 className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h3>
          {renderMenuItemsGrid(mappedItems, true)}
        </div>
      );
    }).filter(Boolean); // Remove null categories
  };

  // Render all menu items in a single list
  const renderAllMenuItems = () => {
    if (!menuItems || menuItems.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No menu items available
        </div>
      );
    }

    return (
      
        <div className="mb-4">
          {/* <h3 className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100">
            All Menu Items
          </h3> */}
          {renderMenuItemsGrid(menuItems)}
        </div>
      
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black bg-opacity-90 backdrop-blur-sm shadow-md">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Back button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black hover:bg-opacity-50 mr-2"
            >
              <ArrowLeft className="h-6 w-6 text-red-500" />
            </button>
            
            {/* Search input */}
            <div className="flex-1">
              <div className="relative w-full">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Type to search..."
                  className="w-full py-2  bg-transparent text-white focus:outline-none"
                  disabled={searchState !== SearchServiceState.READY}
                />
                {query && (
                  <button
                    onClick={() => dispatch(setSearchQuery(''))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Cart Icon */}
            <button 
              onClick={() => dispatch(toggleDrawer())}
              className="p-2 rounded-full hover:bg-black hover:bg-opacity-50 relative ml-2"
            >
              <ShoppingCart className="h-6 w-6 text-red-500" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="p-4 text-center text-gray-500">
            Searching...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            Error: {error}
          </div>
        ) : query ? (
          <div ref={resultsRef} className="pb-16">
            {renderResultsByCategory()}
          </div>
        ) : (
          <div className="pb-16">
            {renderAllMenuItems()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBarComponent;
