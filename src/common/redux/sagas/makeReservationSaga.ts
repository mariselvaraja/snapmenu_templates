/**
 * Saga for handling make reservation operations
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
  makeReservationRequest, 
  makeReservationSuccess, 
  makeReservationFailure,
  ReservationPayload
} from '../slices/makeReservationSlice';
import { tableAvailabilityService } from '../../services/tableAvailabilityService';

/**
 * Worker saga for making a reservation
 */
function* makeReservation(action: PayloadAction<ReservationPayload>): Generator<any, void, any> {
  try {
    // Call the API service to make the reservation
    const response = yield call(
      tableAvailabilityService.makeReservation, 
      action.payload
    );
    
    // Dispatch success action with the response data
    yield put(makeReservationSuccess(response));
  } catch (error) {
    // Dispatch failure action with the error message
    yield put(makeReservationFailure((error as Error).message || 'Failed to make reservation'));
  }
}

/**
 * Watcher saga for make reservation operations
 */
export function* makeReservationSaga() {
  // Watch for the makeReservationRequest action and call the makeReservation saga
  yield takeLatest(makeReservationRequest.type, makeReservation);
}
