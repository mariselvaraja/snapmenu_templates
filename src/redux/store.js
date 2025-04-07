import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import restaurantReducer from './restaurantSlice';
import restaurantSaga from './restaurantSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
});

sagaMiddleware.run(restaurantSaga);

export default store;
