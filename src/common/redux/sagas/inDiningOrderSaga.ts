import { call, put, takeLatest, select } from 'redux-saga/effects';
import { 
  getInDiningOrdersRequest,
  getInDiningOrdersSuccess,
  getInDiningOrdersFailure,
  placeInDiningOrderRequest,
  placeInDiningOrderSuccess,
  placeInDiningOrderFailure,
  updateInDiningOrderRequest,
  updateInDiningOrderSuccess,
  updateInDiningOrderFailure,
  InDiningOrder
} from '../slices/inDiningOrderSlice';
import { RootState } from '../rootReducer';
import { inDiningOrderService } from '../../services/inDiningOrderService';
import { getOrderHistoryRequest } from '../slices/orderHistorySlice';

// Worker Sagas
function* getInDiningOrdersSaga(): Generator<any, void, any> {
  try {
    const orders = yield call(inDiningOrderService.getInDiningOrders);
    yield put(getInDiningOrdersSuccess(orders));
  } catch (error) {
    yield put(getInDiningOrdersFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

function* placeInDiningOrderSaga(action: ReturnType<typeof placeInDiningOrderRequest>): Generator<any, void, any> {
  try {
    const orderData = action.payload;
    const placedOrder = yield call(inDiningOrderService.placeInDiningOrder,orderData);
    yield put(placeInDiningOrderSuccess(placedOrder));
    //GET INDINING ORDER
    yield put(getOrderHistoryRequest(orderData.table_id));
  } catch (error) {
    yield put(placeInDiningOrderFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

function* updateInDiningOrderSaga(action: ReturnType<typeof updateInDiningOrderRequest>): Generator<any, void, any> {
  try {
    const { orderId, updates } = action.payload;
    const updatedOrder = yield call(inDiningOrderService.updateInDiningOrder, {
      orderId,
      updates
    });
    yield put(updateInDiningOrderSuccess(updatedOrder));
  } catch (error) {
    yield put(updateInDiningOrderFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Watcher Saga
export function* inDiningOrderSaga(): Generator<any, void, any> {
  yield takeLatest(getInDiningOrdersRequest.type, getInDiningOrdersSaga);
  yield takeLatest(placeInDiningOrderRequest.type, placeInDiningOrderSaga);
  yield takeLatest(updateInDiningOrderRequest.type, updateInDiningOrderSaga);
}
