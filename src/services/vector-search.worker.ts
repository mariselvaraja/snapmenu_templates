/**
 * Web worker for vector search operations
 * This worker handles the vector search operations in a separate thread
 * to prevent UI blocking during search operations
 */

// Use self as WorkerGlobalScope
const worker = self as any;

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

// Search index for fallback implementation
let searchIndex: any = null;

// Try to load the client-vector-search worker script
try {
  // First try to load from CDN
  worker.importScripts('https://cdn.jsdelivr.net/npm/client-vector-search@latest/dist/worker.js');
  console.log('Loaded client-vector-search worker from CDN');
} catch (e) {
  console.error('Failed to load client-vector-search worker from CDN:', e);
  
  // If CDN fails, use our custom implementation
  worker.addEventListener('message', (event: MessageEvent) => {
    const { type, data } = event.data;
    
    if (type === 'initialize') {
      initializeIndex(data);
    } else if (type === 'search') {
      search(data);
    }
  });
  
  console.log('Initialized fallback search worker');
}

/**
 * Initialize the search index with data (fallback implementation)
 */
function initializeIndex(data: SearchData) {
  try {
    // Report progress
    worker.postMessage({ type: 'progress', data: 0 });
    
    // Store data
    searchIndex = data;
    
    // Report progress
    worker.postMessage({ type: 'progress', data: 100 });
    
    // Report ready
    worker.postMessage({ type: 'ready' });
    
    console.log('Search index initialized with', data.items.length, 'items');
  } catch (error) {
    console.error('Error initializing search index:', error);
    worker.postMessage({ type: 'error', data: error instanceof Error ? error.message : 'Unknown error' });
  }
}

/**
 * Search for items matching the query (fallback implementation)
 */
function search(query: string) {
  try {
    // Check if search index is initialized
    if (!searchIndex) {
      throw new Error('Search index not initialized');
    }
    
    console.log('Searching for:', query);
    
    // Perform search
    const results: any[] = [];
    const grouped: { [category: string]: any[] } = {};
    
    // Simple search implementation
    const normalizedQuery = query.toLowerCase().trim();
    
    // Search in items
    searchIndex.items.forEach((item: any) => {
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
        item.tags.forEach((tag: string) => {
          if (tag.toLowerCase().includes(normalizedQuery)) {
            score += 2;
          }
        });
      }
      
      // Add to results if score > 0
      if (score > 0) {
        const result = {
          item: item,
          similarity: score
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
    results.sort((a, b) => b.similarity - a.similarity);
    
    // Sort grouped results by score
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => b.similarity - a.similarity);
    });
    
    console.log('Search results:', results.length, 'items found');
    
    // Report results
    worker.postMessage({ 
      type: 'results', 
      data: { 
        results: results,
        grouped: grouped
      } 
    });
  } catch (error) {
    console.error('Error searching:', error);
    worker.postMessage({ type: 'error', data: error instanceof Error ? error.message : 'Unknown error' });
  }
}

export {};
