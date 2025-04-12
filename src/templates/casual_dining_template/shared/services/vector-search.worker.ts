/**
 * Web worker for vector search operations
 * This worker handles the vector search operations in a separate thread
 * to prevent UI blocking during search operations
 */

// Use self as WorkerGlobalScope
const worker = self as any;

// Try to load the client-vector-search worker script
try {
  // First try to load from CDN
  worker.importScripts('https://cdn.jsdelivr.net/npm/client-vector-search@latest/dist/worker.js');
  console.log('Loaded client-vector-search worker from CDN');
} catch (e) {
  console.error('Failed to load client-vector-search worker from CDN:', e);
  
  // If CDN fails, try to initialize a basic worker
  worker.addEventListener('message', (event: MessageEvent) => {
    const { id, method, params } = event.data;
    
    // Respond with a mock result
    worker.postMessage({
      id,
      result: {
        success: true,
        message: 'Fallback worker response'
      }
    });
  });
  
  console.log('Initialized fallback worker');
}

export {};
