import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowLeft, Plus, Filter, Loader, Mic } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import InDiningCartDrawer from './in-dining/InDiningCartDrawer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../common/store';
import { setSearchQuery, setSearchResults, setSearchState } from '../../../common/redux/slices/searchSlice';
import { addItem, toggleDrawer } from '../../../common/redux/slices/cartSlice';
import searchService, { SearchState as SearchServiceState } from '../../../services/searchService';
import _ from 'lodash';

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SearchBarComponentProps {
  onClose: () => void;
  onPlaceOrder?: (specialRequest: string) => void;
}

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({ onClose, onPlaceOrder }) => {
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
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [filters, setFilters] = useState({
    vegetarian: true,
    vegan: true,
    glutenFree: true
  });
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const lastClickTimeRef = useRef<number>(0);

  const currentMenuType = useSelector((state: RootState) => state.menu.currentMenuType);

  // Focus input on mount and load all menu items initially
  useEffect(() => {
    // Clear any existing search query when component mounts
    dispatch(setSearchQuery(''));
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Initially show all menu items
    if (menuItems && menuItems.length > 0) {
      console.log('Initially loading all menu items');
      // We don't need to do anything special here since renderAllMenuItems
      // will be called when query is empty
    }
  }, [dispatch, menuItems]);

  // Generate quick links from menu categories and popular dietary options
  const quickLinks = useMemo(() => {
    const links:any = [];
    
    // Add dietary options
    links.push({ text: 'Vegetarian', query: 'vegetarian' });
    links.push({ text: 'Vegan', query: 'vegan' });
    links.push({ text: 'Gluten Free', query: 'gluten free' });
    
    // Add categories from menu data
    if(menuItems && menuItems.length)
      {
        let items = menuItems.map((item:any)=>{
          return { text: item.category, query: item.category }
        })
        let unique_item = _.uniqBy(items,'text')
          return  unique_item
        }
    return links;
  }, [menuCategories, menuItems]);

  // Handle quick link click
  const handleQuickLinkClick = (quickLink: { text: string, query: string }) => {
    dispatch(setSearchQuery(quickLink.query));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Expand health-related terms for better semantic matching
  const expandHealthTerms = (query: string): string => {
    // Use the searchService's expandHealthTerms function if available
    if (typeof searchService.expandHealthTerms === 'function') {
      return searchService.expandHealthTerms(query);
    }
    
    // Fallback implementation if the service function is not available
    const healthTermsMap: Record<string, string> = {
      'healthy': 'nutritious fresh light lean natural wholesome balanced',
      'vegetarian': 'plant-based meatless veggie vegetables',
      'vegan': 'plant-based dairy-free egg-free animal-free',
      'gluten-free': 'celiac wheat-free grain-free',
      'spicy': 'hot chili pepper fiery'
    };

    const queryTerms = query.toLowerCase().split(/\s+/);
    const expandedTerms = new Set(queryTerms);

    queryTerms.forEach(term => {
      if (healthTermsMap[term]) {
        healthTermsMap[term].split(' ').forEach(expandedTerm => {
          expandedTerms.add(expandedTerm);
        });
      }
    });

    return Array.from(expandedTerms).join(' ');
  };

  // Simple filtering based on query - no search service
  const filteredMenuItems = useMemo(() => {
    if (!query || !menuItems) {
      return menuItems || [];
    }

    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    
    return menuItems.filter(item => {
      const itemText = [
        item.name || '',
        item.description || '',
        item.category || '',
        ...(item.tags || [])
      ].join(' ').toLowerCase();
      
      // Check if all search terms are found in the item text
      return searchTerms.every(term => itemText.includes(term));
    });
  }, [query, menuItems]);

  // Get location from react-router
  const location = useLocation();
  const { table } = useParams<{ table: string }>();
  
  // Check if we're in the in-dining context
  const isInDiningContext = location.pathname.includes('placeindiningorder');

  // Handle item select with debounce to prevent multiple rapid clicks
  const handleItemSelect = (item: any) => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTimeRef.current;
    
    // Prevent multiple clicks within 500ms
    if (timeSinceLastClick < 500) {
      return;
    }
    
    // Prevent multiple clicks if already navigating
    if (isNavigating) {
      return;
    }
    
    lastClickTimeRef.current = currentTime;
    
    if (isInDiningContext && table) {
      // Navigate to the product details route
      setIsNavigating(true);
      navigate(`/placeindiningorder/${table}/product/${item.id || item.pk_id}`);
      
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    } 
    // else {
      
    //   setIsNavigating(true);
    //   onClose();
    //   navigate(`/product/${item.pk_id || item.id}`);
      
      
    //   setTimeout(() => {
    //     setIsNavigating(false);
    //   }, 1000);
    // }
  };

  // Get filtered items for keyboard navigation
  const allItems = React.useMemo(() => {
    let items = query ? filteredMenuItems : (menuItems || []);
    
    // Apply dietary filters if any are active
    if (filters.vegetarian || filters.vegan || filters.glutenFree) {
      items = items.filter((item: any) => {
        if (!item) return false;
        
        // If item doesn't have dietary info, include it in results
        if (!item.dietary) return true;
        
        // OR condition - show item if it matches ANY active filter
        return (filters.vegetarian && item.dietary.isVegetarian) || 
               (filters.vegan && item.dietary.isVegan) || 
               (filters.glutenFree && item.dietary.isGlutenFree);
      });
    }
    
    return items;
  }, [query, filteredMenuItems, menuItems, filters]);

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
            handleItemSelect(allItems[selectedIndex]);
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

  // Voice search functionality
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechError('Voice search is not supported in your browser');
      return;
    }

    setSpeechError(null);
    setIsListening(true);

    try {
      // Create speech recognition object
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
    
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        console.log('Voice search result:', speechResult);
        dispatch(setSearchQuery(speechResult));
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setSpeechError(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setSpeechError('Failed to initialize speech recognition');
      setIsListening(false);
    }
  };
  
  // Handle filter toggle
  const handleFilterToggle = (filterName: 'vegetarian' | 'vegan' | 'glutenFree') => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
    setSelectedIndex(-1);
  };

  // Format price to display with currency symbol
  const formatPrice = (item: any): string => {
    const price = Array.isArray(item?.prices) && item.prices.length > 0
      ? Number(item.prices[0].price) || 0
      : Number(item?.indining_price || item?.price || 0);
    
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
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No items in this category</h3>
          <p className="text-gray-500 text-center max-w-md mb-4 text-sm">
            Try browsing other categories or use the search to find what you're looking for.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {items.map((item, index) => (
          <div
            key={item.id || `item-${index}`}
            data-result-item={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleItemSelect(item)}
          >
            <div className="relative h-32 bg-gray-100">
              <div className="w-full h-full">
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
              <h4 className="font-medium text-gray-800 mb-1 line-clamp-1">
                {highlightQuery ? renderHighlightedText(item.name, query) : item.name}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2">
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
              
 
            </div>
          </div>
        ))}
      </div>
    );
  };


  // Simple render of filtered items
  const renderFilteredItems = () => {
    let itemsToRender = query ? filteredMenuItems : menuItems;

    // Apply dietary filters
    if (filters.vegetarian || filters.vegan || filters.glutenFree) {
      itemsToRender = itemsToRender.filter((item) => {
        if (!item) return false;
        
        // If item doesn't have dietary info, include it in results
        if (!item.dietary) return true;
        
        // OR condition - show item if it matches ANY active filter
        return (filters.vegetarian && item.dietary.isVegetarian) || 
               (filters.vegan && item.dietary.isVegan) || 
               (filters.glutenFree && item.dietary.isGlutenFree);
      });
    }

    if (itemsToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No matches found</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            {query 
              ? "We couldn't find any items matching your search. Try using different keywords."
              : "No items match your dietary preferences. Try adjusting your filters."}
          </p>
          <button
            onClick={() => dispatch(setSearchQuery(''))}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center"
          >
            Clear Search
          </button>
        </div>
      );
    }

    return renderMenuItemsGrid(itemsToRender, !!query);
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder={isListening ? "Listening..." : "Type or speak to search..."}
                  className="w-full py-2 pl-10 pr-16 bg-transparent text-white focus:outline-none"
                  disabled={isListening}
                />
                
                {/* Voice search button */}
                <button
                  onClick={startVoiceSearch}
                  disabled={isListening}
                  className={`absolute right-10 top-1/2 transform -translate-y-1/2 p-1 rounded-full 
                    ${isListening 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-400 hover:text-white'}`}
                  title="Search by voice"
                >
                  <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                </button>
                
                {query && !isListening && (
                  <button
                    onClick={() => dispatch(setSearchQuery(''))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                
              </div>
              
              {/* Speech error message */}
              {speechError && (
                <div className="text-red-400 text-xs mt-1 px-2">
                  {speechError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick links - only show when no query is entered */}
      {!query && quickLinks.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="text-sm font-medium text-gray-600 mb-2">Quick Links</div>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link:any, index:any) => (
              <button
                key={index}
                onClick={() => handleQuickLinkClick(link)}
                className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
              >
                {link.text}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Results Count */}
      <div className="flex flex-wrap items-center px-3 py-1 bg-gray-100 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          {query 
            ? `Showing ${allItems.length} results` 
            : `Showing ${menuItems.length} items`
          }
        </div>
      </div>

      {/* Debug info removed */}
      
      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div ref={resultsRef} className="pb-16">
          {renderFilteredItems()}
        </div>
      </div>

      {/* InDiningCartDrawer - Only shown in in-dining context */}
      {isInDiningContext && (
        <InDiningCartDrawer onPlaceOrder={onPlaceOrder} />
      )}
    </div>
  );
};

export default SearchBarComponent;
