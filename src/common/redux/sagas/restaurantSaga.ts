import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  fetchRestaurantInfoRequest, 
  fetchRestaurantInfoSuccess, 
  fetchRestaurantInfoFailure,
  fetchRestaurantByDomainRequest,
  fetchRestaurantByDomainSuccess,
  fetchRestaurantByDomainFailure
} from '../slices/restaurantSlice';
import { fetchSiteContentRequest } from '../slices/siteContentSlice';
import { fetchMenuRequest } from '../slices/menuSlice';
import { restaurantService } from '../../services';

// Worker Saga for fetching restaurant info based on current domain
function* fetchRestaurantInfoSaga(): Generator<any, void, any> {
  try {
    // Get the restaurant info from the API
    let restaurantInfo: any = yield call(restaurantService.getRestaurantInfo);
    restaurantInfo = restaurantInfo[0];
    
    // Log the restaurant info for debugging
    console.log('RestaurantSaga: Restaurant info', restaurantInfo);
    
    // Dispatch success action with the restaurant info
    yield put(fetchRestaurantInfoSuccess(restaurantInfo));
    
    // Removed: No longer automatically fetch site content and menu
    // We'll fetch these after location selection instead
  } catch (error) {
    console.error('Error in fetchRestaurantInfoSaga:', error);
    yield put(fetchRestaurantInfoFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Worker Saga for fetching restaurant info by specific domain
function* fetchRestaurantByDomainSaga(action: ReturnType<typeof fetchRestaurantByDomainRequest>): Generator<any, void, any> {
  try {

    // Get the restaurant info from the API
    let restaurantInfo: any = yield call(restaurantService.getRestaurantByDomain);
    
    // If the response is an array, take the first item
    if (Array.isArray(restaurantInfo)) {
      restaurantInfo = restaurantInfo;
    }
    
    // Dispatch success action with the restaurant info
    yield put(fetchRestaurantByDomainSuccess(restaurantInfo));
    
    // Removed: No longer automatically fetch site content and menu
    // We'll fetch these after location selection instead
  } catch (error) {
    console.error('Error in fetchRestaurantByDomainSaga:', error);
    yield put(fetchRestaurantByDomainFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Watcher Saga
export function* restaurantSaga(): Generator<any, void, any> {
  yield takeLatest(fetchRestaurantInfoRequest.type, fetchRestaurantInfoSaga);
  yield takeLatest(fetchRestaurantByDomainRequest.type, fetchRestaurantByDomainSaga);
}
