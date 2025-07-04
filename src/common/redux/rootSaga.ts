import { all, fork } from 'redux-saga/effects';
import { cartSaga } from './sagas/cartSaga';
import { menuSaga } from './sagas/menuSaga';
import { siteContentSaga } from './sagas/siteContentSaga';
import { restaurantSaga } from './sagas/restaurantSaga';
import { inDiningOrderSaga } from './sagas/inDiningOrderSaga';
import { tableAvailabilitySaga } from './sagas/tableAvailabilitySaga';
import { makeReservationSaga } from './sagas/makeReservationSaga';
import { tableStatusSaga } from './sagas/tableStatusSaga';
import { orderHistorySaga } from './sagas/orderHistorySaga';
import { watchPaymentSagas } from './sagas/paymentSaga';
import { tpnSaga } from '../../redux/sagas/tpnSaga';
import { comboSaga } from '../../redux/sagas/comboSaga';

export function* rootSaga(): Generator<any, void, any> {
  yield all([
    fork(cartSaga),
    fork(menuSaga),
    fork(siteContentSaga),
    fork(restaurantSaga),
    fork(inDiningOrderSaga),
    fork(tableAvailabilitySaga),
    fork(makeReservationSaga),
    fork(tableStatusSaga),
    fork(orderHistorySaga),
    fork(watchPaymentSagas),
    fork(tpnSaga),
    fork(comboSaga)
  ]);
}
