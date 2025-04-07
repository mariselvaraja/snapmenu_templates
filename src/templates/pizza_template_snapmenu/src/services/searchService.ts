// Simple vector search implementation for menu items
class SearchService {
  // Search states for tracking progress
  SEARCH_STATES = {
    UNINITIALIZED: 'uninitialized',
    LOADING: 'loading',
    READY: 'ready',
    ERROR: 'error'
  };

  private embeddings: Record<string, any> = {};
  private menuData: any = null;
  private state: string;
  private error: string | null;
  private progress: number;
  private stateListeners: Set<Function>;

  constructor() {
    console.log('Initializing SearchService');
    this.state = this.SEARCH_STATES.UNINITIALIZED;
    this.error = null;
    this.progress = 0;
    this.stateListeners = new Set();
  }

  // Add state change listener
  addStateListener(listener: Function) {
    console.log('Adding state listener');
    this.stateListeners.add(listener);
    // Immediately notify of current state
    listener(this.state, this.error, this.progress);
  }

  // Remove state change listener
  removeStateListener(listener: Function) {
    console.log('Removing state listener');
    this.stateListeners.delete(listener);
  }

  // Notify all listeners of stateChange
  notifyStateChange() {
    console.log('Notifying state change:', this.state, this.error, this.progress);
    this.stateListeners.forEach(listener =>
      listener(this.state, this.error, this.progress)
    );
  }

  // Update state and notify listeners
  setState(state: string, error: string | null = null, progress: number = 0) {
    console.log('Setting state:', state, error, progress);
    this.state = state;
    this.error = error;
    this.progress = progress;
    this.notifyStateChange();
  }

  // Create a feature vector from text with weight
  createFeatureVector(text: string, weight: number = 1.0): number[] {
    const vector = new Array(384).fill(0);
    if (!text) return vector;

    const processedText = text.toLowerCase().trim();
    if (processedText.length === 0) return vector;

    // Create a deterministic vector based on text content
    for (let i = 0; i < processedText.length; i++) {
      const charCode = processedText.charCodeAt(i);
      // Use multiple positions to create more unique vectors
      const positions = [
        i % 384,
        (i * 2) % 384,
        (charCode * i) % 384
      ];
      positions.forEach(pos => {
        vector[pos] = (vector[pos] + charCode * weight) / 255;
      });
    }

    // Add word-level features
    const words = processedText.split(/\\s+/);
    words.forEach((word, wordIndex) => {
      const wordHash = word.split('').reduce((hash, char) => {
        return ((hash << 5) - hash) + char.charCodeAt(0);
      }, 0);
      const pos = Math.abs(wordHash) % 384;
      vector[pos] = (vector[pos] + (wordIndex + 1) * weight) / 255;
    });

    return vector;
  }

  // Initialize search with menu data
  async initializeIndex(menuData: any) {
    try {
      console.log('Starting index initialization');
      this.setState(this.SEARCH_STATES.LOADING);

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
        const ingredientsVector = this.createFeatureVector(
          (item.ingredients || []).join(' '), 
          2.5
        ); // Higher weight for ingredients
        const allergensVector = this.createFeatureVector(
          (item.allergens || []).join(' '),
          1.5
        ); // Include allergens
        const pairingsVector = this.createFeatureVector(
          (item.pairings || []).join(' '),
          1.0
        ); // Include pairings

        // Enhanced dietary and health context
        const healthContext = [
          // Dietary preferences
          item.dietary?.isVegetarian ? 'vegetarian vegetable vegetables healthy plant-based' : '',
          item.dietary?.isVegan ? 'vegan plant-based healthy natural' : '',
          item.dietary?.isGlutenFree ? 'gluten-free celiac healthy' : '',
          // Health indicators from ingredients
          (item.ingredients || []).some((i: string) => 
            ['vegetable', 'fruit', 'salad', 'lean', 'fresh'].some(term => 
              i.toLowerCase().includes(term)
            )
          ) ? 'healthy nutritious' : '',
          // Health indicators from description
          (item.description || '').toLowerCase().includes('fresh') ? 'healthy fresh' : '',
          // Low calorie items
          (item.calories || 0) < 500 ? 'healthy light' : '',
          // Fresh ingredients and preparations
          item.subCategory === 'salads' ? 'healthy fresh nutritious' : '',
          ['grilled', 'steamed', 'fresh'].some(term => 
            (item.description || '').toLowerCase().includes(term)
          ) ? 'healthy light' : ''
        ].filter(Boolean).join(' ');

        const dietaryVector = this.createFeatureVector(healthContext, 2.0);

        // Combine all feature vectors
        const vector = new Array(384).fill(0);
        [
          nameVector,
          descVector,
          categoryVector,
          ingredientsVector,
          allergensVector,
          pairingsVector,
          dietaryVector
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
            price: parseFloat(item.price as string) || 0,
            category: item.category,
            dietary: item.dietary || {},
            ingredients: item.ingredients || [],
            allergens: item.allergens || [],
            pairings: item.pairings || [],
            image: item.image || ''
          }
        };
      }

      console.log('Created embeddings for', Object.keys(this.embeddings).length, 'items');
      this.setState(this.SEARCH_STATES.READY);
    } catch (error: any) {
      console.error('Search initialization error:', error);
      this.setState(this.SEARCH_STATES.ERROR, error.message);
      throw error;
    }
  }

  // Create a query embedding from text
  createQueryEmbedding(query: string): number[] {
    // Create weighted feature vectors for query
    const nameVector = this.createFeatureVector(query, 4.0);
    const categoryVector = this.createFeatureVector(query, 3.0);
    const descriptionVector = this.createFeatureVector(query, 2.0);
    const ingredientsVector = this.createFeatureVector(query, 2.5);
    const dietaryVector = this.createFeatureVector(
      [
        query.includes('vegetarian') ? 'vegetarian vegetable vegetables' : '',
        query.includes('vegan') ? 'vegan plant-based' : '',
        query.includes('gluten') ? 'gluten-free celiac' : ''
      ].filter(Boolean).join(' '),
      2.0
    );

    // Combine feature vectors
    const vector = new Array(384).fill(0);
    [
      nameVector,
      categoryVector,
      descriptionVector,
      ingredientsVector,
      dietaryVector
    ].forEach(featureVector => {
      featureVector.forEach((val, i) => {
        vector[i] += val;
      });
    });

    // Normalize the combined vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude === 0 ? vector : vector.map(val => val / magnitude);
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Group search results by category
  groupResults(results: any[]): Record<string, any[]> {
    if (!Array.isArray(results)) {
      console.warn('Expected array of results, got:', typeof results);
      return {};
    }

    const grouped: Record<string, any[]> = {};
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
        score: result.similarity
      });
    }

    return grouped;
  }

  // Perform search with error handling
  async search(query: string): Promise<{ results: any[], grouped: Record<string, any[]> }> {
    if (this.state !== this.SEARCH_STATES.READY) {
      throw new Error('Search index not initialized');
    }

    try {
      if (!query || typeof query !== 'string') {
        console.warn('Invalid search query:', query);
        return { results: [], grouped: {} };
      }
      
      console.log('Performing search for:', query);
      const queryEmbedding = this.createQueryEmbedding(query);

      // Find matching items for query terms
      const words = query.toLowerCase().split(/\\s+/).filter(word => word.length > 0);
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
          let ingredientsScore = 0;
          let dietaryScore = 0;

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

            // Ingredients matches (medium weight)
            if ((item.ingredients || []).some((i: string) => i.toLowerCase().includes(word))) {
              ingredientsScore += 0.5;
            }

            // Dietary preference matches (medium-high weight)
            const dietaryText = [
              item.dietary?.isVegetarian ? 'vegetarian vegetable vegetables' : '',
              item.dietary?.isVegan ? 'vegan plant-based' : '',
              item.dietary?.isGlutenFree ? 'gluten-free celiac' : ''
            ].join(' ').toLowerCase();
            if (dietaryText.includes(word)) {
              dietaryScore += 0.7;
            }
          });

          // Combine all scores with weights
          const textScore = (
            (nameScore * 0.35) +
            (categoryScore * 0.25) +
            (descriptionScore * 0.15) +
            (ingredientsScore * 0.15) +
            (dietaryScore * 0.10)
          );

          // Calculate vector similarity
          const vectorSimilarity = this.cosineSimilarity(queryEmbedding, data.vector);
          
          // Combine text and vector scores
          const combinedScore = (textScore * 0.4) + (vectorSimilarity * 0.6);

          return combinedScore > 0 ? { 
            similarity: combinedScore,
            item: data.item
          } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b!.similarity - a!.similarity);

      // Group the results by category
      const grouped = this.groupResults(matchingItems as any[]);

      return {
        results: matchingItems as any[],
        grouped: grouped
      };
    } catch (error: any) {
      console.error('Search error:', error);
      throw error;
    }
  }

  // Clean up resources
  async cleanup() {
    try {
      console.log('Cleaning up search resources');
      this.embeddings = {};
      this.menuData = null;
      this.setState(this.SEARCH_STATES.UNINITIALIZED);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

// Create and export singleton instance
const searchService = new SearchService();
export default searchService;
