/**
 * Search service for handling search functionality
 */

// Define search states
export enum SearchState {
  UNINITIALIZED = 'uninitialized',
  INITIALIZING = 'initializing',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

// Define search result interface
export interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  score: number;
}

// Define grouped search results interface
export interface GroupedResults {
  [category: string]: SearchResult[];
}

// Define search response interface
export interface SearchResponse {
  results: SearchResult[];
  grouped: GroupedResults;
}

// Define search data interface
export interface SearchData {
  items: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    tags: string[];
    image: string;
    available: boolean;
  }>;
}

// Search service implementation
export const searchService = {
  // Search state
  state: SearchState.UNINITIALIZED,
  
  // Search progress (0-100)
  progress: 0,
  
  // Error message
  error: null as string | null,
  
  // Search data
  data: null as SearchData | null,
  
  // Web worker for search
  worker: null as Worker | null,
  
  /**
   * Initialize the search index with data
   */
  initializeIndex: async (data: SearchData): Promise<void> => {
    console.log('Initializing search index with data:', data.items.length, 'items');
    
    try {
      // Update state
      searchService.state = SearchState.INITIALIZING;
      searchService.progress = 0;
      searchService.error = null;
      
      // Store data
      searchService.data = data;
      
      // Create web worker for search
      if (typeof Worker !== 'undefined') {
        // Terminate existing worker if any
        if (searchService.worker) {
          searchService.worker.terminate();
        }
        
        // Create new worker
        searchService.worker = new Worker(new URL('./vector-search.worker.ts', import.meta.url), { type: 'module' });
        
        // Listen for messages from worker
        searchService.worker.onmessage = (event) => {
          const { type, data } = event.data;
          
          if (type === 'progress') {
            searchService.progress = data;
            // Notify listeners
            searchService.listeners.forEach(listener => 
              listener(searchService.state, searchService.error, searchService.progress)
            );
          } else if (type === 'ready') {
            searchService.state = SearchState.READY;
            searchService.progress = 100;
            // Notify listeners
            searchService.listeners.forEach(listener => 
              listener(searchService.state, searchService.error, searchService.progress)
            );
          } else if (type === 'error') {
            searchService.state = SearchState.ERROR;
            searchService.error = data;
            // Notify listeners
            searchService.listeners.forEach(listener => 
              listener(searchService.state, searchService.error, searchService.progress)
            );
          }
        };
        
        // Initialize worker with data
        searchService.worker.postMessage({ type: 'initialize', data });
      } else {
        // Web workers not supported
        console.error('Web workers not supported');
        searchService.state = SearchState.ERROR;
        searchService.error = 'Web workers not supported';
      }
      
      // Update state
      searchService.state = SearchState.READY;
      searchService.progress = 100;
      // Notify listeners
      searchService.listeners.forEach(listener => 
        listener(searchService.state, searchService.error, searchService.progress)
      );
    } catch (error) {
      console.error('Error initializing search index:', error);
      searchService.state = SearchState.ERROR;
      searchService.error = error instanceof Error ? error.message : 'Unknown error';
      // Notify listeners
      searchService.listeners.forEach(listener => 
        listener(searchService.state, searchService.error, searchService.progress)
      );
      throw error;
    }
  },
  
  /**
   * Search for items matching the query
   */
  search: async (query: string): Promise<SearchResponse> => {
    console.log('Searching for:', query);
    
    try {
      // Check if search is ready
      if (searchService.state !== SearchState.READY) {
        console.error('Search not ready');
        return { results: [], grouped: {} };
      }
      
      // Check if query is empty
      if (!query.trim()) {
        return { results: [], grouped: {} };
      }
      
      // Check if data is available
      if (!searchService.data) {
        console.error('No search data available');
        return { results: [], grouped: {} };
      }
      
      // Perform search
      const results: SearchResult[] = [];
      const grouped: GroupedResults = {};
      
      // Simple search implementation
      const normalizedQuery = query.toLowerCase().trim();
      
      // Search in items
      searchService.data.items.forEach(item => {
        // Skip unavailable items
        if (!item.available) {
          return;
        }
        
        // Calculate score
        let score = 0;
        
        // Check name
        if (item.name.toLowerCase().includes(normalizedQuery)) {
          score += 10;
        }
        
        // Check description
        if (item.description && item.description.toLowerCase().includes(normalizedQuery)) {
          score += 5;
        }
        
        // Check category
        if (item.category.toLowerCase().includes(normalizedQuery)) {
          score += 3;
        }
        
        // Check tags
        if (item.tags) {
          item.tags.forEach(tag => {
            if (tag.toLowerCase().includes(normalizedQuery)) {
              score += 2;
            }
          });
        }
        
        // Add to results if score > 0
        if (score > 0) {
          const result: SearchResult = {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            score,
          };
          
          results.push(result);
          
          // Add to grouped results
          if (!grouped[item.category]) {
            grouped[item.category] = [];
          }
          
          grouped[item.category].push(result);
        }
      });
      
      // Sort results by score
      results.sort((a, b) => b.score - a.score);
      
      // Sort grouped results by score
      Object.keys(grouped).forEach(category => {
        grouped[category].sort((a, b) => b.score - a.score);
      });
      
      return { results, grouped };
    } catch (error) {
      console.error('Error searching:', error);
      return { results: [], grouped: {} };
    }
  },
  
  /**
   * Get the current search state
   */
  getState: (): { state: SearchState; error: string | null; progress: number } => {
    return {
      state: searchService.state,
      error: searchService.error,
      progress: searchService.progress,
    };
  },

  // State change listeners
  listeners: [] as Array<(state: SearchState, error: string | null, progress: number) => void>,

  /**
   * Add a state change listener
   */
  addStateListener: (callback: (state: SearchState, error: string | null, progress: number) => void): void => {
    searchService.listeners.push(callback);
  },

  /**
   * Remove a state change listener
   */
  removeStateListener: (callback: (state: SearchState, error: string | null, progress: number) => void): void => {
    searchService.listeners = searchService.listeners.filter(listener => listener !== callback);
  },
};

export default searchService;
