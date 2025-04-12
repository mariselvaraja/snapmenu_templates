import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  fetchSiteContentRequest, 
  fetchSiteContentSuccess, 
  fetchSiteContentFailure,
  SiteContent
} from '../slices/siteContentSlice';
import { siteContentService } from '../../services';

// Worker Saga - Disabled to prevent duplicate API calls
// Site content is now fetched in the common saga
function* fetchSiteContentSaga(): Generator<any, void, any> {
  try {
    // This saga is now disabled to prevent duplicate API calls
    // The common saga will handle fetching site content
    console.log('Pizza template SiteContentSaga: Skipping API call to prevent duplication');
    
    // We don't need to dispatch success action here as it will be handled by the common saga
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
