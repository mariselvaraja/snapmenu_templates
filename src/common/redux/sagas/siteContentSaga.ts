import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  fetchSiteContentRequest, 
  fetchSiteContentSuccess, 
  fetchSiteContentFailure,
  
} from '../slices/siteContentSlice';
import { siteContentService } from '../../services';
import api from '../../services/api';
import endpoints from '../../config/endpoints';

// Worker Saga
function* fetchSiteContentSaga(): Generator<any, void, any> {
  try {
    // Get the site content data from the API using the service
    // This ensures we only make one API call
    const { transformedData, rawApiResponse } = yield call(siteContentService.getSiteContent);
    
    // Log the raw API response for debugging
    console.log('SiteContentSaga: Raw API response', rawApiResponse);
    
    console.log('SiteContentSaga: Transformed data', transformedData);
    
    // Dispatch success action with both transformed data and raw response
    yield put(fetchSiteContentSuccess({
      transformedData,
      rawApiResponse
    }));
    
    // Removed: After successfully fetching site content, fetch menu data
    // yield put({ type: 'menu/fetchMenuRequest' });
  } catch (error) {
    console.error('Error in fetchSiteContentSaga:', error);
    yield put(fetchSiteContentFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}


// Watcher Saga
export function* siteContentSaga(): Generator<any, void, any> {
  yield takeLatest(fetchSiteContentRequest.type, fetchSiteContentSaga);
  
}
