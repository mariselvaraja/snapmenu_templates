import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchRestaurantSuccess, fetchRestaurantError, fetchRestaurantStart, fetchRestaurantRequest } from './restaurantSlice';

const API_ENDPOINT_BASE = 'https://appliance.genaiembed.ai/p5093/restaurant/getRestaurantOnDomain?domain=';

function* fetchRestaurantDetailsSaga(action) {
  try {
    yield put(fetchRestaurantStart());
    const domain = action.payload;
    const response = yield call(fetch, `${API_ENDPOINT_BASE}${domain}`);
    const data = yield response.json();
    yield put(fetchRestaurantSuccess(data));
  } catch (error) {
    yield put(fetchRestaurantError(error.message));
  }
}

function* restaurantSaga() {
  yield takeLatest(fetchRestaurantRequest.type, fetchRestaurantDetailsSaga);
}

export default restaurantSaga;
