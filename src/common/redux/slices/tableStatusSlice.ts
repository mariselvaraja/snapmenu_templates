import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableStatus {
  id: string;
  tableNumber: string;
  status: string;
  capacity: number;
  [key: string]: any;
}

interface TableStatusState {
  tables: TableStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: TableStatusState = {
  tables: [],
  loading: false,
  error: null,
};

export const tableStatusSlice = createSlice({
  name: 'tableStatus',
  initialState,
  reducers: {
    // Async action triggers for table status
    fetchTableStatusRequest: (state, action: PayloadAction<string | null>) => {
      state.loading = true;
      state.error = null;
    },
    fetchTableStatusSuccess: (state, action: PayloadAction<TableStatus[]>) => {
      state.tables = action.payload;
      state.loading = false;
    },
    fetchTableStatusFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTableStatusRequest,
  fetchTableStatusSuccess,
  fetchTableStatusFailure
} = tableStatusSlice.actions;

export default tableStatusSlice.reducer;
