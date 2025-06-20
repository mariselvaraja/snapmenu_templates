import { call, put, takeEvery } from 'redux-saga/effects';
import { comboService } from '../../services/comboService';
import {
  fetchComboRequest,
  fetchComboSuccess,
  fetchComboFailure,
} from '../slices/comboSlice';

// Worker saga: fetch combo data
function* fetchComboSaga(): Generator<any, void, any> {
  try {
    const response = yield call(comboService.getCombos);
    // Handle both API response formats:
    // Format 1: { "combos": [...] }
    // Format 2: { "data": [...], "isActive": true }
    const combos = response.data?.combos || response.data?.data || [];
    const isActive = response.data?.isActive !== undefined ? response.data.isActive : true; // Default to true if not provided
    yield put(fetchComboSuccess({ data: combos, isActive }));
  } catch (error: any) {
    yield put(fetchComboFailure(error.message || 'Failed to fetch combo data'));
  }
}

// Watcher saga: watch for combo requests
export function* comboSaga(): Generator<any, void, any> {
  yield takeEvery(fetchComboRequest.type, fetchComboSaga);
}
