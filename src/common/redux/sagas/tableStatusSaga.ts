import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  fetchTableStatusRequest,
  fetchTableStatusSuccess,
  fetchTableStatusFailure
} from '../slices/tableStatusSlice';
import { tableStatusService } from '../../services/tableAvailabilityService';

// Worker Saga
function* fetchTableStatusSaga(action:any): Generator<any, void, any> {
  try {
    let table_id = action.payload;
    const tableStatusData = yield call(tableStatusService.getTableStatus, table_id);

    yield put(fetchTableStatusSuccess(tableStatusData));
  } catch (error) {
    yield put(fetchTableStatusFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Watcher Saga
export function* tableStatusSaga(): Generator<any, void, any> {
  yield takeLatest(fetchTableStatusRequest.type, fetchTableStatusSaga);
}
