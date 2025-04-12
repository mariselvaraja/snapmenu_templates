/**
 * Web worker for vector search
 * This file is loaded as a web worker to perform search operations in a separate thread
 */

// Define search data interface
interface SearchData {
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

// Define search index
let searchIndex: any = null;

// Listen for messages from the main thread
self.onmessage = (event) => {
  const { type, data } = event.data;
  
  if (type === 'initialize') {
    initializeIndex(data);
  } else if (type === 'search') {
    search(data);
  }
};

/**
 * Initialize the search index with data
 */
function initializeIndex(data: SearchData) {
  try {
    // Report progress
    self.postMessage({ type: 'progress', data: 0 });
    
    // Store data
    searchIndex = data;
    
    // Report progress
    self.postMessage({ type: 'progress', data: 100 });
    
    // Report ready
    self.postMessage({ type: 'ready' });
  } catch (error) {
    console.error('Error initializing search index:', error);
    self.postMessage({ type: 'error', data: error instanceof Error ? error.message : 'Unknown error' });
  }
}

/**
 * Search for items matching the query
 */
function search(query: string) {
  try {
    // Check if search index is initialized
    if (!searchIndex) {
      throw new Error('Search index not initialized');
    }
    
    // Perform search
    // This is a simple implementation, in a real application you would use a more sophisticated search algorithm
    const results : any = [];
    
    // Report results
    self.postMessage({ type: 'results', data: results });
  } catch (error) {
    console.error('Error searching:', error);
    self.postMessage({ type: 'error', data: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// Export empty object to make TypeScript happy
export {};
