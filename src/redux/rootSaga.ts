import { all, fork } from 'redux-saga/effects';
import { cartSaga } from './sagas/cartSaga';
import { menuSaga } from './sagas/menuSaga';
import { siteContentSaga } from './sagas/siteContentSaga';
import { restaurantSaga } from './sagas/restaurantSaga';
import { tpnSaga } from './sagas/tpnSaga';
import { comboSaga } from './sagas/comboSaga';

export function* rootSaga(): Generator<any, void, any> {
  yield all([
    fork(cartSaga),
    fork(menuSaga),
    fork(siteContentSaga),
    fork(restaurantSaga),
    fork(tpnSaga),
    fork(comboSaga),
  ]);
}
