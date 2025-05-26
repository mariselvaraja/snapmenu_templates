import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TpnConfig {
  id: string;
  merchantId: string;
  publicKey: string;
  environment: 'sandbox' | 'production';
  currency: string;
  countryCode: string;
  supportedNetworks: string[];
  merchantCapabilities: string[];
  requiredBillingContactFields: string[];
  requiredShippingContactFields: string[];
  shippingMethods: Array<{
    label: string;
    amount: string;
    type: string;
    identifier: string;
  }>;
}

interface TpnState {
  config: TpnConfig | null;
  rawApiResponse: any | null; // Store the raw API response
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: TpnState = {
  config: null,
  rawApiResponse: null,
  loading: false,
  error: null,
  isInitialized: false,
};

export const tpnSlice = createSlice({
  name: 'tpn',
  initialState,
  reducers: {
    // Synchronous actions
    setTpnConfig: (state, action: PayloadAction<TpnConfig>) => {
      state.config = action.payload;
      state.isInitialized = true;
    },
    
    clearTpnConfig: (state) => {
      state.config = null;
      state.rawApiResponse = null;
      state.isInitialized = false;
      state.error = null;
    },
    
    // Async action triggers for sagas
    fetchTpnConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    fetchTpnConfigSuccess: (state, action: PayloadAction<{rawApiResponse: any}>) => {
      state.rawApiResponse = action.payload.rawApiResponse;
      state.loading = false;
      state.isInitialized = true;
    },
    
    fetchTpnConfigFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isInitialized = false;
    },
    
    // Reset error state
    clearTpnError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setTpnConfig,
  clearTpnConfig,
  fetchTpnConfigRequest,
  fetchTpnConfigSuccess,
  fetchTpnConfigFailure,
  clearTpnError,
} = tpnSlice.actions;

export default tpnSlice.reducer;
