import { call, put, takeEvery } from 'redux-saga/effects';
import { paymentService } from '../../services/tpnService';
import {
  fetchTpnConfigRequest,
  fetchTpnConfigSuccess,
  fetchTpnConfigFailure,
} from '../slices/tpnSlice';


// Worker saga: fetch TPN configuration
function* fetchTpnConfigSaga(): Generator<any, void, any> {
  try {
    const response = yield call(paymentService.getPaymentInfo);
  
    yield put(fetchTpnConfigSuccess({
      rawApiResponse: response,
    }));
  } catch (error: any) {
    yield put(fetchTpnConfigFailure(error.message || 'Failed to fetch TPN configuration'));
  }
}

// Watcher saga: watch for TPN config requests
export function* tpnSaga(): Generator<any, void, any> {
  yield takeEvery(fetchTpnConfigRequest.type, fetchTpnConfigSaga);
}
