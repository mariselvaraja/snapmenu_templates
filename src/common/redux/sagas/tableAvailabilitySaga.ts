import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  fetchTableAvailablityRequest,
  fetchTableAvailablitySuccess,
  fetchTableAvailablityFailure
} from '../slices/tableAvailabilitySlice';
import { tableAvailabilityService } from '../../services/tableAvailabilityService';

// Worker Saga
function* fetchtableAvailabilitySaga(action:any): Generator<any, void, any> {
  try {
    let date = action.payload.date;
    const tableAvailabilityData = yield call(tableAvailabilityService.getTableAvailability, date);

    yield put(fetchTableAvailablitySuccess(tableAvailabilityData));
  } catch (error) {
    yield put(fetchTableAvailablityFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}


// Watcher Saga
export function* tableAvailabilitySaga(): Generator<any, void, any> {
  yield takeLatest(fetchTableAvailablityRequest.type, fetchtableAvailabilitySaga);
}
