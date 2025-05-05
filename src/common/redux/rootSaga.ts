import { all, fork } from 'redux-saga/effects';
import { cartSaga } from './sagas/cartSaga';
import { menuSaga } from './sagas/menuSaga';
import { siteContentSaga } from './sagas/siteContentSaga';
import { restaurantSaga } from './sagas/restaurantSaga';
import { inDiningOrderSaga } from './sagas/inDiningOrderSaga';
import { tableAvailabilitySaga } from './sagas/tableAvailabilitySaga';
import { makeReservationSaga } from './sagas/makeReservationSaga';
import { tableStatusSaga } from './sagas/tableStatusSaga';

export function* rootSaga(): Generator<any, void, any> {
  yield all([
    fork(cartSaga),
    fork(menuSaga),
    fork(siteContentSaga),
    fork(restaurantSaga),
    fork(inDiningOrderSaga),
    fork(tableAvailabilitySaga),
    fork(makeReservationSaga),
    fork(tableStatusSaga)
  ]);
}
