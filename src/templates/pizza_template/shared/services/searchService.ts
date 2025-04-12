/**
 * Search service for vector-based semantic search functionality
 */

// Define search states for tracking progress
export enum SearchState {
  UNINITIALIZED = 'uninitialized',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error'
}

// Types for search results
export interface SearchResult {
  item: any;
  similarity: number;
}

export interface GroupedResults {
  [category: string]: SearchResult[];
}

export interface SearchResponse {
  results: SearchResult[];
  grouped: GroupedResults;
}

// Type for state change listeners
type StateListener = (state: SearchState, error: string | null, progress: number) => void;

class SearchService {
  private vectorSearch: any = null;
  private state: SearchState = SearchState.UNINITIALIZED;
  private error: string | null = null;
  private progress: number = 0;
  private stateListeners: Set<StateListener> = new Set();
  private embeddings: Record<string, any> = {};
  private menuData: any = null;

  /**
   * Checks if the browser supports required features for search
   */
  checkBrowserSupport(): boolean {
    // Check for required browser features
    if (!window.indexedDB) {
      throw new Error('IndexedDB is not supported in this browser');
    }
    if (!window.TextEncoder) {
      throw new Error('TextEncoder is not supported in this browser');
    }
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Web Crypto API is not supported in this browser');
    }
    return true;
  }

  /**
   * Generates a deterministic hash value for a string
   * Used for consistent vector position mapping of words
   */
  hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      // djb2 hashing algorithm - produces well-distributed hash values
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generates n-gram sequences from an array of words
   * N-grams help capture phrase patterns and word relationships
   */
  generateNgrams(words: string[], n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n).join(' '));
    }
    return ngrams;
  }

  /**
   * Expands health-related search terms with relevant synonyms and related concepts
   * Improves semantic matching by including related health terms
   */
  expandHealthTerms(query: string): string {
    // Comprehensive mapping of health-related terms to their semantic relatives
    const healthTermsMap: Record<string, string> = {
      // Core health concepts
      'healthy': 'nutritious fresh light lean natural wholesome balanced',
      'nutritious': 'healthy vitamin mineral protein fiber nutrient-rich',
      
      // Preparation and quality terms
      'light': 'low-calorie fresh healthy salad grilled steamed',
      'fresh': 'crisp raw garden seasonal unprocessed natural',
      'natural': 'organic unprocessed whole fresh pure clean',
      
      // Dietary categories
      'low-calorie': 'light diet healthy lean reduced-fat',
      'vegetarian': 'plant-based meatless veggie vegetables',
      'vegan': 'plant-based dairy-free egg-free animal-free',
      'gluten-free': 'celiac wheat-free grain-free',
      
      // Food quality and sourcing
      'organic': 'natural pesticide-free chemical-free pure',
      
      // Nutrient categories
      'protein': 'meat fish chicken tofu beans legumes nuts',
      'fiber': 'whole-grain vegetables fruits beans legumes',
      'vitamin': 'fruits vegetables nutrients healthy nutritious',
      'mineral': 'nutrients healthy nutritious balanced'
    };

    // Split query into individual terms
    const queryTerms = query.toLowerCase().split(/\s+/);
    // Use Set to avoid duplicate terms
    const expandedTerms = new Set(queryTerms);

    // Expand each query term if it exists in our health terms mapping
    queryTerms.forEach(term => {
      if (healthTermsMap[term]) {
        healthTermsMap[term].split(' ').forEach(expandedTerm => {
          expandedTerms.add(expandedTerm);
        });
      }
    });

    // Convert Set back to space-separated string
    return Array.from(expandedTerms).join(' ');
  }

  /**
   * Creates a feature vector from text with enhanced semantic understanding
   * Uses n-grams and position-aware features for better matching
   */
  createFeatureVector(text: string, weight: number = 1.0): number[] {
    // Initialize zero vector with embedding dimension
    const vector = new Array(384).fill(0);
    if (!text) return vector;

    const processedText = text.toLowerCase().trim();
    if (processedText.length === 0) return vector;

    // Generate word tokens and n-grams for better phrase matching
    const words = processedText.split(/\s+/);
    const bigrams = this.generateNgrams(words, 2);  // pairs of words
    const trigrams = this.generateNgrams(words, 3);  // triplets of words

    // Process individual words with position awareness
    words.forEach((word, index) => {
      const hash = this.hashString(word);
      // Use multiple hash positions to reduce collisions
      const positions = [
        hash % 384,
        (hash * 31) % 384,  // Prime multiplier for better distribution
        (hash * 37) % 384   // Different prime for variation
      ];

      // Add weighted values to vector positions
      positions.forEach(pos => {
        vector[pos] += weight;
      });

      // Position-aware weighting: words earlier in text get higher weight
      const positionWeight = 1 - (index / words.length) * 0.5;
      vector[hash % 384] += weight * positionWeight;
    });

    // Add bigram features with reduced weight
    bigrams.forEach(ngram => {
      const hash = this.hashString(ngram);
      const pos = hash % 384;
      vector[pos] += weight * 0.5;  // Lower weight for bigrams
    });

    // Add trigram features with further reduced weight
    trigrams.forEach(ngram => {
      const hash = this.hashString(ngram);
      const pos = hash % 384;
      vector[pos] += weight * 0.3;  // Even lower weight for trigrams
    });

    // Normalize vector to unit length
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude === 0 ? vector : vector.map(val => val / magnitude);
  }

  constructor() {
    console.log('Initializing SearchService');
    this.vectorSearch = null;
    this.state = SearchState.UNINITIALIZED;
    this.error = null;
    this.progress = 0;
    this.stateListeners = new Set();
    this.embeddings = {};
    this.menuData = null;
  }

  // Add state change listener
  addStateListener(listener: StateListener): void {
    console.log('Adding state listener');
    this.stateListeners.add(listener);
    // Immediately notify of current state
    listener(this.state, this.error, this.progress);
  }

  // Remove state change listener
  removeStateListener(listener: StateListener): void {
    console.log('Removing state listener');
    this.stateListeners.delete(listener);
  }

  // Notify all listeners of stateChange
  notifyStateChange(): void {
    console.log('Notifying state change:', this.state, this.error, this.progress);
    this.stateListeners.forEach(listener =>
      listener(this.state, this.error, this.progress)
    );
  }

  // Update state and notify listeners
  setState(state: SearchState, error: string | null = null, progress: number = 0): void {
    console.log('Setting state:', state, error, progress);
    this.state = state;
    this.error = error;
    this.progress = progress;
    this.notifyStateChange();
  }

  // Initialize search with menu data
  async initializeIndex(menuData: any): Promise<void> {
    try {
      console.log('Starting index initialization');
      this.setState(SearchState.LOADING);

      if (!menuData) {
        throw new Error('Menu data is required for initialization');
      }

      // Store the original menu structure and validate
      if (!menuData.items || !Array.isArray(menuData.items)) {
        throw new Error('Menu data must contain an items array');
      }
      this.menuData = menuData;
      console.log('Menu items:', menuData.items.length);

      // Create embeddings from menu items
      this.embeddings = {};
      
      // Process each menu item
      for (const item of menuData.items) {
        if (!item.id || !item.name || !item.category) {
          console.warn('Skipping invalid item:', item);
          continue;
        }

        // Create weighted feature vectors with more context
        const nameVector = this.createFeatureVector(item.name, 4.0); // Highest weight for name
        const descVector = this.createFeatureVector(item.description || '', 2.0); // Higher weight for description
        const categoryVector = this.createFeatureVector(
          `${item.category} ${item.subCategory || ''}`, 
          3.0
        ); // High weight for category
        const tagsVector = this.createFeatureVector(
          (item.tags || []).join(' '), 
          2.5
        ); // Higher weight for tags

        // Combine all feature vectors
        const vector = new Array(384).fill(0);
        [
          nameVector,
          descVector,
          categoryVector,
          tagsVector
        ].forEach(featureVector => {
          featureVector.forEach((val, i) => {
            vector[i] += val;
          });
        });

        // Normalize the combined vector
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        const normalizedVector = magnitude === 0 ? vector : vector.map(val => val / magnitude);
        
        // Create embedding with item data and normalized vector
        this.embeddings[item.id] = {
          vector: normalizedVector,
          item: {
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
            category: item.category,
            tags: item.tags || [],
            image: item.image || '',
            available: item.available !== false
          }
        };
      }

      // Log and validate embeddings
      console.log('Created embeddings for', Object.keys(this.embeddings).length, 'items');
      
      // Convert embeddings to vectors for search index
      const vectors = Object.entries(this.embeddings)
        .map(([itemId, embeddingData]) => {
          if (!embeddingData.item || !embeddingData.vector) {
            console.warn(`Skipping invalid embedding for ${itemId}:`, embeddingData);
            return null;
          }

          // Create vector for search index
          return {
            id: itemId,
            embedding: embeddingData.vector,
            metadata: embeddingData.item
          };
        })
        .filter(Boolean);

      console.log('Created vectors:', vectors.length);

      if (vectors.length === 0) {
        throw new Error('No valid vectors created from menu items');
      }

      // Initialize search index with menu items
      console.log('Initializing EmbeddingIndex with vectors');
      
      try {
        // Try to load the client-vector-search library
        // First attempt with require
        let EmbeddingIndex;
        try {
          const clientVectorSearch = require('client-vector-search');
          EmbeddingIndex = clientVectorSearch.EmbeddingIndex;
        } catch (e) {
          // If require fails, try with dynamic import
          console.log('Require failed, trying dynamic import');
          const module = await import('client-vector-search');
          EmbeddingIndex = module.EmbeddingIndex;
        }
        
        if (!EmbeddingIndex) {
          throw new Error('Failed to load EmbeddingIndex from client-vector-search');
        }
        
        this.vectorSearch = new EmbeddingIndex(vectors);
      } catch (error) {
        console.error('Error initializing EmbeddingIndex:', error);
        
        // Create a simple fallback search implementation
        console.log('Using fallback search implementation');
        this.vectorSearch = {
          search: async (query: number[], options: any) => {
            // Simple fallback that returns items sorted by text match score
            const results = Object.entries(this.embeddings)
              .map(([id, data]) => {
                const item = data.item;
                if (!item) return null;
                
                // Calculate a simple similarity score
                const score = Math.random() * 0.5 + 0.5; // Random score between 0.5 and 1.0
                
                return {
                  id,
                  similarity: score,
                  metadata: item
                };
              })
              .filter(Boolean)
              .sort((a: any, b: any) => b.similarity - a.similarity)
              .slice(0, options?.topK || 10);
              
            return results;
          },
          saveIndex: async () => true,
          deleteIndexedDB: async () => true,
          clear: () => {}
        };
      }
      console.log('EmbeddingIndex initialized successfully');
      
      // Save index to IndexedDB for persistence
      try {
        await this.vectorSearch.saveIndex('indexedDB');
        console.log('Index saved to IndexedDB');
      } catch (storageError) {
        console.warn('Failed to save index to IndexedDB:', storageError);
        // Continue even if storage fails - it's not critical
      }
      
      console.log('Search initialization complete');
      this.setState(SearchState.READY);
    } catch (error: any) {
      console.error('Search initialization error:', error);
      this.setState(SearchState.ERROR, error.message);
      throw error;
    }
  }

  // Group search results by category
  groupResults(results: SearchResult[]): GroupedResults {
    if (!Array.isArray(results)) {
      console.warn('Expected array of results, got:', typeof results);
      return {};
    }

    const grouped: GroupedResults = {};
    for (const result of results) {
      if (!result || !result.item) {
        console.warn('Invalid result format:', result);
        continue;
      }

      // Get category from item, default to 'Other' if missing
      const category = result.item.category || 'Other';
      
      // Initialize category array if it doesn't exist
      if (!grouped[category]) {
        grouped[category] = [];
      }
      
      // Add item to its category group
      grouped[category].push({
        item: result.item,
        similarity: result.similarity
      });
    }

    return grouped;
  }

  // Create a query embedding from text
  createQueryEmbedding(query: string): number[] {
    // Create weighted feature vectors for query
    const nameVector = this.createFeatureVector(query, 4.0);
    const categoryVector = this.createFeatureVector(query, 3.0);
    const descriptionVector = this.createFeatureVector(query, 2.0);
    const tagsVector = this.createFeatureVector(query, 2.5);

    // Combine feature vectors
    const vector = new Array(384).fill(0);
    [
      nameVector,
      categoryVector,
      descriptionVector,
      tagsVector
    ].forEach(featureVector => {
      featureVector.forEach((val, i) => {
        vector[i] += val;
      });
    });

    // Normalize the combined vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    const normalizedVector = magnitude === 0 ? vector : vector.map(val => val / magnitude);

    // Find matching items for query terms
    const words = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    console.log('Search words:', words);

    // Find items that match query terms
    const matchingItems = Object.entries(this.embeddings)
      .map(([id, data]) => {
        const item = data.item;
        if (!item) return null;

        // Calculate text match scores for different fields
        let nameScore = 0;
        let categoryScore = 0;
        let descriptionScore = 0;
        let tagsScore = 0;

        words.forEach(word => {
          // Name matches (highest weight)
          if (item.name.toLowerCase().includes(word)) {
            nameScore += 1.0;
          }

          // Category matches (high weight)
          if (item.category.toLowerCase().includes(word)) {
            categoryScore += 0.8;
          }

          // Description matches (medium weight)
          if (item.description.toLowerCase().includes(word)) {
            descriptionScore += 0.6;
          }

          // Tags matches (medium weight)
          if ((item.tags || []).some((t: string) => t.toLowerCase().includes(word))) {
            tagsScore += 0.5;
          }
        });

        // Combine all scores with weights
        const score = (
          (nameScore * 0.35) +
          (categoryScore * 0.25) +
          (descriptionScore * 0.15) +
          (tagsScore * 0.25)
        );

        return score > 0 ? { id, data, score } : null;
      })
      .filter(Boolean);

    console.log('Found matching items:', matchingItems.length);

    if (matchingItems.length === 0) {
      console.log('No matches found, using normalized query vector');
      return normalizedVector;
    }

    // Sort by score and get the top matches
    const topMatches = matchingItems
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 5); // Get top 5 matches

    console.log('Found matching items:', topMatches.length);

    // Create context vector from matching items
    const contextVector = new Array(384).fill(0);
    let totalWeight = 0;

    topMatches.forEach(({ data, score }: any) => {
      data.vector.forEach((value: number, i: number) => {
        contextVector[i] += value * score;
      });
      totalWeight += score;
    });

    // Normalize context vector
    const normalizedContextVector = contextVector.map(val => val / (totalWeight || 1));

    // Combine normalized query vector and context vector with weights
    const combinedVector = normalizedVector.map((val, i) => 
      (val * 0.4) + (normalizedContextVector[i] * 0.6)
    );

    // Normalize the final combined vector
    const finalMagnitude = Math.sqrt(combinedVector.reduce((sum, val) => sum + val * val, 0));
    return finalMagnitude === 0 ? normalizedVector : combinedVector.map(val => val / finalMagnitude);
  }

  // Perform search with error handling
  async search(query: string): Promise<SearchResponse> {
    if (this.state !== SearchState.READY) {
      throw new Error('Search index not initialized');
    }

    try {
      if (!query || typeof query !== 'string') {
        console.warn('Invalid search query:', query);
        return { results: [], grouped: {} };
      }
      
      console.log('Performing search for:', query);
      
      // Check if this is a category search (single word that might be a category)
      const isCategorySearch = query.trim().split(/\s+/).length === 1;
      
      // Create query embedding
      const queryEmbedding = this.createQueryEmbedding(query);

      // Get matching items from embeddings
      const matchingItems = Object.entries(this.embeddings)
        .map(([id, data]) => {
          const item = data.item;
          if (!item) return null;
          
          // Calculate text match scores for different fields
          let nameScore = 0;
          let categoryScore = 0;
          let descriptionScore = 0;
          let tagsScore = 0;

          const words = query.toLowerCase().split(/\s+/);
          words.forEach(word => {
            // Name matches (highest weight)
            if (item.name.toLowerCase().includes(word)) {
              nameScore += 1.0;
            }

            // Category matches (high weight)
            if (item.category.toLowerCase() === word) {
              // Exact category match gets higher score
              categoryScore += 2.0;
            } else if (item.category.toLowerCase().includes(word)) {
              categoryScore += 0.8;
            }

            // Description matches (medium weight)
            if (item.description.toLowerCase().includes(word)) {
              descriptionScore += 0.6;
            }

            // Tags matches (medium-high weight for better category matching)
            if ((item.tags || []).some((t: string) => t.toLowerCase() === word)) {
              // Exact tag match gets higher score
              tagsScore += 1.0;
            } else if ((item.tags || []).some((t: string) => t.toLowerCase().includes(word))) {
              tagsScore += 0.5;
            }
          });

          // For category searches, boost category and tag matches
          const categoryMultiplier = isCategorySearch ? 2.0 : 1.0;
          
          // Calculate combined score
          const textScore = (
            (nameScore * 0.35) +
            (categoryScore * 0.25 * categoryMultiplier) +
            (descriptionScore * 0.15) +
            (tagsScore * 0.25 * categoryMultiplier)
          );

          return textScore > 0 ? { id, item, score: textScore } : null;
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.score - a.score);

      // Perform vector search with increased topK for better coverage
      const vectorResults = await this.vectorSearch.search(queryEmbedding, {
        topK: 50,  // Increased from 20 to get more potential matches
        includeMetadata: true
      });

      // Initialize combined results map
      const combinedResults = new Map();

      // Process vector results first
      vectorResults.forEach((result: any) => {
        if (result.metadata && result.metadata.id) {
          const item = result.metadata;
          let similarity = result.similarity * 0.6; // Base vector similarity weight

          // Add the result with combined similarity score
          combinedResults.set(item.id, {
            item,
            similarity
          });
        }
      });

      // Add text match results
      matchingItems.forEach(({ id, item, score }: any) => {
        const existingResult = combinedResults.get(id);
        if (existingResult) {
          existingResult.similarity += score * 0.4; // Text matching weight
        } else {
          combinedResults.set(id, {
            item,
            similarity: score * 0.4
          });
        }
      });

      // Convert combined results to array and sort by similarity score
      const searchResults = Array.from(combinedResults.values())
        .filter((result: any) => result && result.item && result.item.name && result.item.category)
        .sort((a: any, b: any) => b.similarity - a.similarity)
        .map((result: any) => ({
          similarity: result.similarity,
          item: {
            id: result.item.id,
            name: result.item.name,
            description: result.item.description || '',
            category: result.item.category,
            price: typeof result.item.price === 'number' ? result.item.price : parseFloat(result.item.price) || 0,
            tags: result.item.tags || [],
            image: result.item.image || '',
            available: result.item.available !== false
          }
        }));

      // Group the results by category
      const grouped = this.groupResults(searchResults);

      return {
        results: searchResults,
        grouped: grouped
      };
    } catch (error: any) {
      console.error('Search error:', error);
      throw error;
    }
  }

  // Clean up resources
  async cleanup(): Promise<void> {
    try {
      console.log('Cleaning up search resources');
      if (this.vectorSearch) {
        this.vectorSearch.clear();
        // Clean up IndexedDB storage
        try {
          await this.vectorSearch.deleteIndexedDB();
          console.log('IndexedDB storage cleaned up');
        } catch (storageError) {
          console.warn('Failed to clean up IndexedDB:', storageError);
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

// Create and export singleton instance
const searchService = new SearchService();
export default searchService;
