import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  fetchTableAvailablityRequest,
  fetchTableAvailablitySuccess,
  fetchTableAvailablityFailure
} from '../slices/tableAvailabilitySlice';
import { tableAvailabilityService } from '../../services/tableAvailabilityService';

// Worker Saga
function* fetchtableAvailabilitySaga(): Generator<any, void, any> {
  try {
    const tableAvailabilityData = yield call(tableAvailabilityService.getTableAvailability);

    yield put(fetchTableAvailablitySuccess(tableAvailabilityData));
  } catch (error) {
    yield put(fetchTableAvailablityFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}


// Watcher Saga
export function* tableAvailabilitySaga(): Generator<any, void, any> {
  yield takeLatest(fetchTableAvailablityRequest.type, fetchtableAvailabilitySaga);
}
