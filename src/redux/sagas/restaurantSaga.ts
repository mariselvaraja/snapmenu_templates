import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  fetchRestaurantInfoRequest, 
  fetchRestaurantInfoSuccess, 
  fetchRestaurantInfoFailure 
} from '../slices/restaurantSlice';
import { restaurantService } from '../../services';

// Worker Saga - Disabled to prevent duplicate API calls
// Restaurant info is now fetched in the common saga
function* fetchRestaurantInfoSaga(): Generator<any, void, any> {
  try {
    // This saga is now disabled to prevent duplicate API calls
    // The common saga will handle fetching restaurant info
    console.log('Pizza template RestaurantSaga: Skipping API call to prevent duplication');
    
    // We don't need to dispatch success action here as it will be handled by the common saga
  } catch (error) {
    console.error('Error in fetchRestaurantInfoSaga:', error);
    yield put(fetchRestaurantInfoFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Watcher Saga
export function* restaurantSaga(): Generator<any, void, any> {
  yield takeLatest(fetchRestaurantInfoRequest.type, fetchRestaurantInfoSaga);
}
