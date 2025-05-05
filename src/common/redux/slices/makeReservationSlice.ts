import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for the reservation payload
export interface ReservationPayload {
  restaurant_id: string | null;
  restaurant_parent_id: string | null;
  party_size: number;
  customer_name: string;
  phone: string;
  email: string;
  reservation_start_time: string;
  reservation_end_time: string;
  special_request?: string;
}

// Define the type for the reservation state
interface ReservationState {
  loading: boolean;
  success: boolean;
  error: string | null;
  reservationData: any | null;
}

// Initial state
const initialState: ReservationState = {
  loading: false,
  success: false,
  error: null,
  reservationData: null,
};

// Create the slice
export const makeReservationSlice = createSlice({
  name: 'makeReservation',
  initialState,
  reducers: {
    // Async action triggers for sagas
    makeReservationRequest: (state, action: PayloadAction<ReservationPayload>) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    makeReservationSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.success = true;
      state.reservationData = action.payload;
    },
    makeReservationFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetReservationState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.reservationData = null;
    },
  },
});

export const {
  makeReservationRequest,
  makeReservationSuccess,
  makeReservationFailure,
  resetReservationState
} = makeReservationSlice.actions;

export default makeReservationSlice.reducer;
