import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchState as SearchServiceState, SearchResponse } from '../../services/searchService';

// Define the search state for Redux
export interface SearchState {
  isModalOpen: boolean;
  query: string;
  results: SearchResponse;
  searchState: SearchServiceState;
  searchProgress: number;
  error: string | null;
}

// Initial state
const initialState: SearchState = {
  isModalOpen: false,
  query: '',
  results: { results: [], grouped: {} },
  searchState: SearchServiceState.UNINITIALIZED,
  searchProgress: 0,
  error: null,
};

// Create the search slice
export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Open the search modal
    openSearchModal: (state) => {
      state.isModalOpen = true;
    },
    
    // Close the search modal
    closeSearchModal: (state) => {
      state.isModalOpen = false;
    },
    
    // Set the search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    
    // Set the search results
    setSearchResults: (state, action: PayloadAction<SearchResponse>) => {
      state.results = action.payload;
    },
    
    // Set the search state
    setSearchState: (state, action: PayloadAction<{
      state: SearchServiceState;
      error: string | null;
      progress: number;
    }>) => {
      state.searchState = action.payload.state;
      state.error = action.payload.error;
      state.searchProgress = action.payload.progress;
    },
    
    // Clear the search results
    clearSearchResults: (state) => {
      state.results = { results: [], grouped: {} };
    },
  },
});

// Export actions
export const {
  openSearchModal,
  closeSearchModal,
  setSearchQuery,
  setSearchResults,
  setSearchState,
  clearSearchResults,
} = searchSlice.actions;

// Export reducer
export default searchSlice.reducer;
