import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  fetchRestaurantInfoRequest, 
  fetchRestaurantInfoSuccess, 
  fetchRestaurantInfoFailure 
} from '../slices/restaurantSlice';
import { restaurantService } from '../../services';

// Worker Saga
function* fetchRestaurantInfoSaga(): Generator<any, void, any> {
  try {
    // Get the restaurant info from the API
    let restaurantInfo: any = yield call(restaurantService.getRestaurantInfo);
    restaurantInfo = restaurantInfo[0];
    
    // Log the restaurant info for debugging
    console.log('RestaurantSaga: Restaurant info', restaurantInfo);
    
    // Dispatch success action with the restaurant info
    yield put(fetchRestaurantInfoSuccess(restaurantInfo));
  } catch (error) {
    console.error('Error in fetchRestaurantInfoSaga:', error);
    yield put(fetchRestaurantInfoFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Watcher Saga
export function* restaurantSaga(): Generator<any, void, any> {
  yield takeLatest(fetchRestaurantInfoRequest.type, fetchRestaurantInfoSaga);
}
