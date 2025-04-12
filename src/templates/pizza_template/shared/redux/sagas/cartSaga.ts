import { call, put, takeLatest, select } from 'redux-saga/effects';
import { 
  fetchCartRequest, 
  fetchCartSuccess, 
  fetchCartFailure,
  saveCartRequest,
  saveCartSuccess,
  saveCartFailure,
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFailure
} from '../slices/cartSlice';
import { RootState } from '../rootReducer';
import { cartService, OrderData } from '../../services/cartService';

// Worker Sagas
function* fetchCartSaga(): Generator<any, void, any> {
  try {
    const cartItems = yield call(cartService.getCart);
    yield put(fetchCartSuccess(cartItems));
  } catch (error) {
    yield put(fetchCartFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

function* saveCartSaga(): Generator<any, void, any> {
  try {
    const { items } = yield select((state: RootState) => state.cart);
    
    // For each item in the cart, ensure it's saved
    for (const item of items) {
      yield call(cartService.addToCart, item);
    }
    
    yield put(saveCartSuccess());
  } catch (error) {
    yield put(saveCartFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Additional sagas for cart operations
function* addItemSaga(action: ReturnType<typeof addItem>): Generator<any, void, any> {
  try {
    yield call(cartService.addToCart, action.payload);
    // Refresh cart after adding item
    yield put(fetchCartRequest());
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
}

function* removeItemSaga(action: ReturnType<typeof removeItem>): Generator<any, void, any> {
  try {
    yield call(cartService.removeFromCart, action.payload);
    // Refresh cart after removing item
    yield put(fetchCartRequest());
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
}

function* updateItemQuantitySaga(action: ReturnType<typeof updateItemQuantity>): Generator<any, void, any> {
  try {
    const { id, quantity } = action.payload;
    yield call(cartService.updateCartItem, id, quantity);
    // Refresh cart after updating item
    yield put(fetchCartRequest());
  } catch (error) {
    console.error('Error updating item quantity in cart:', error);
  }
}

function* clearCartSaga(): Generator<any, void, any> {
  try {
    yield call(cartService.clearCart);
    // Refresh cart after clearing
    yield put(fetchCartRequest());
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}

function* placeOrderSaga(action: { type: string, payload: OrderData }): Generator<any, void, any> {
  try {
    // Place the order
    const orderConfirmation = yield call(cartService.placeOrder, action.payload);
    
    // Dispatch success action
    yield put(placeOrderSuccess());
    
    // Log order confirmation
    console.log('Order placed successfully:', orderConfirmation);
  } catch (error) {
    // Dispatch failure action
    yield put(placeOrderFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
    console.error('Error placing order:', error);
  }
}

// Watcher Saga
export function* cartSaga(): Generator<any, void, any> {
  yield takeLatest(fetchCartRequest.type, fetchCartSaga);
  yield takeLatest(saveCartRequest.type, saveCartSaga);
  yield takeLatest(addItem.type, addItemSaga);
  yield takeLatest(removeItem.type, removeItemSaga);
  yield takeLatest(updateItemQuantity.type, updateItemQuantitySaga);
  yield takeLatest(clearCart.type, clearCartSaga);
  yield takeLatest(placeOrderRequest.type, placeOrderSaga);
}
