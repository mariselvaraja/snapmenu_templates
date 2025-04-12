import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  fetchSiteContentRequest, 
  fetchSiteContentSuccess, 
  fetchSiteContentFailure,
  SiteContent
} from '../slices/siteContentSlice';
import { siteContentService } from '../../services';
import api from '../../services/api';
import endpoints from '../../config/endpoints';

// Worker Saga
function* fetchSiteContentSaga(): Generator<any, void, any> {
  try {
    // Get the site content data from the API
    const response = yield call(api.get, endpoints.siteContent.getAll);
    
    // Log the raw API response for debugging
    console.log('SiteContentSaga: Raw API response', response);
    
    // Transform the API response to match our SiteContent interface
    // We need to pass the response data to the service to ensure it has the latest data
    const transformedData: SiteContent = yield call(
      siteContentService.getSiteContent,
      response.data
    );
    
    console.log('SiteContentSaga: Transformed data', transformedData);
    
    // Dispatch success action with both transformed data and raw response
    yield put(fetchSiteContentSuccess({
      transformedData,
      rawApiResponse: response
    }));
  } catch (error) {
    console.error('Error in fetchSiteContentSaga:', error);
    yield put(fetchSiteContentFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Additional saga for fetching specific site content section
function* fetchSiteContentSectionSaga(action: { type: string, payload: string }): Generator<any, void, any> {
  try {
    // Get the specific section data
    const sectionData = yield call(siteContentService.getSiteContentSection, action.payload);
    
    // Log the section data for debugging
    console.log(`SiteContentSaga: Fetched site content section "${action.payload}"`, sectionData);
    
    // Here we could dispatch an action to update only a specific part of the state
    // For now, we're just logging the data
  } catch (error) {
    console.error(`Error fetching site content section ${action.payload}:`, error);
  }
}

// Watcher Saga
export function* siteContentSaga(): Generator<any, void, any> {
  yield takeLatest(fetchSiteContentRequest.type, fetchSiteContentSaga);
  yield takeLatest('siteContent/fetchSiteContentSection', fetchSiteContentSectionSaga);
}
