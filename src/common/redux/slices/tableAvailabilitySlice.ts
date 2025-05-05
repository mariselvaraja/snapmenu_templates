import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableStatus {
  id: string;
  tableNumber: string;
  status: string;
  capacity: number;
  [key: string]: any;
}

interface TableAvailabilityState {
  items: any[];
  tableStatus: TableStatus[];
  loading: boolean;
  statusLoading: boolean;
  error: string | null;
  statusError: string | null;
}

const initialState: TableAvailabilityState = {
  items: [],
  tableStatus: [],
  loading: false,
  statusLoading: false,
  error: null,
  statusError: null,
};


export const tableAvailablitySlice = createSlice({
  name: 'tableAvailablity',
  initialState,
  reducers: {
    // Async action triggers for table availability
    fetchTableAvailablityRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTableAvailablitySuccess: (state, action: PayloadAction<{ availableDetails: any[] }>) => {
      state.items = action.payload.availableDetails;
      state.loading = false;
    },
    fetchTableAvailablityFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTableAvailablityRequest,
  fetchTableAvailablitySuccess,
  fetchTableAvailablityFailure
} = tableAvailablitySlice.actions;

export default tableAvailablitySlice.reducer;
