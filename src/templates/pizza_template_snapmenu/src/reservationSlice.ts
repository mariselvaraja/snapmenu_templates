import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReservationDetails {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: number;
  specialRequests?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
}

interface ReservationState {
  currentReservation: ReservationDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  currentReservation: null,
  loading: false,
  error: null
};

export const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setReservationLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setReservation: (state, action: PayloadAction<ReservationDetails>) => {
      state.currentReservation = action.payload;
      state.loading = false;
      state.error = null;
    },
    setReservationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearReservation: (state) => {
      state.currentReservation = null;
      state.error = null;
      state.loading = false;
    }
  }
});

export const { 
  setReservationLoading, 
  setReservation, 
  setReservationError, 
  clearReservation 
} = reservationSlice.actions;

export default reservationSlice.reducer;
