import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  makePaymentRequest,
  makePaymentSuccess,
  makePaymentFailure,
  PaymentRequest,
  PaymentResponse,
} from '../slices/paymentSlice';
import { paymentService } from '../../services/paymentService';

function* makePaymentSaga(action: PayloadAction<{table_id: string, total_amount?: number}>) {
  try {
    const { table_id, total_amount } = action.payload;
    
    // Call the payment service
    const response: PaymentResponse = yield call(paymentService.makePayment, table_id, total_amount);
    
    // Dispatch success action
    yield put(makePaymentSuccess(response));
    
    // If payment is successful and there's a payment URL, redirect to it
    if (response.success && response.paymentUrl) {
      window.location.href = response.paymentUrl;
    }
  } catch (error: any) {
    // Extract error message
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        'Payment failed. Please try again.';
    
    // Dispatch failure action
    yield put(makePaymentFailure(errorMessage));
  }
}

export function* watchPaymentSagas() {
  yield takeEvery(makePaymentRequest.type, makePaymentSaga);
}

export default watchPaymentSagas;
