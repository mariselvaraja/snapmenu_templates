import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SiteContent {
  about: {
    story: string;
    team: Array<{
      name: string;
      role: string;
      bio: string;
      image: string;
    }>;
  };
  gallery: Array<{
    id: number;
    title: string;
    image: string;
    description: string;
  }>;
  events: Array<{
    id: number;
    title: string;
    date: string;
    description: string;
    image: string;
  }>;
  blog: Array<{
    id: number;
    title: string;
    date: string;
    author: string;
    content: string;
    image: string;
    excerpt: string;
  }>;
  reservation: {
    title: string;
    description: string;
    image: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string;
    image: string;
  };
  locations: Array<{
    id: number;
    name: string;
    address: string;
    phone: string;
    hours: string;
    image: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }>;
}

interface SiteContentState {
  content: SiteContent | null;
  rawApiResponse: any | null; // Store the raw API response
  loading: boolean;
  error: string | null;
}

const initialState: SiteContentState = {
  content: null,
  rawApiResponse: null,
  loading: false,
  error: null,
};

export const siteContentSlice = createSlice({
  name: 'siteContent',
  initialState,
  reducers: {
    // Synchronous actions
    setSiteContent: (state, action: PayloadAction<SiteContent>) => {
      state.content = action.payload;
    },
    
    // Async action triggers for sagas
    fetchSiteContentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSiteContentSuccess: (state, action: PayloadAction<{transformedData: SiteContent, rawApiResponse: any}>) => {
      state.content = action.payload.transformedData;
      state.rawApiResponse = action.payload.rawApiResponse;
      state.loading = false;
    },
    fetchSiteContentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setSiteContent,
  fetchSiteContentRequest,
  fetchSiteContentSuccess,
  fetchSiteContentFailure,
} = siteContentSlice.actions;

export default siteContentSlice.reducer;
