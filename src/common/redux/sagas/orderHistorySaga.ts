import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  getOrderHistoryRequest,
  getOrderHistorySuccess,
  getOrderHistoryFailure,
} from '../slices/orderHistorySlice';
import { orderHistoryService } from '../../services/orderHistoryService';

// Worker Saga
function* getOrderHistorySaga(action: ReturnType<typeof getOrderHistoryRequest>): Generator<any, void, any> {
  try {
    const tableId = action.payload;
    const orderHistory = yield call(orderHistoryService.getOrderHistory, tableId);
    yield put(getOrderHistorySuccess(orderHistory));
  } catch (error) {
    yield put(getOrderHistoryFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Watcher Saga
export function* orderHistorySaga(): Generator<any, void, any> {
  yield takeLatest(getOrderHistoryRequest.type, getOrderHistorySaga);
}
