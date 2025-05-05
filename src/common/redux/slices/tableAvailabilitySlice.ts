import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: any = {
    items: [],
    loading: false,
    error: null,
  };


export const tableAvailablitySlice = createSlice({
    name: 'tableAvailablity',
    initialState,
    reducers: {
      // Async action triggers for sagas
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