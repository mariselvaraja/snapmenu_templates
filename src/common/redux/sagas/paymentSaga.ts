import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  makePaymentRequest,
  makePaymentSuccess,
  makePaymentFailure,
  makeRequestCheckRequest,
  makeRequestCheckSuccess,
  makeRequestCheckFailure,
  PaymentRequest,
  PaymentResponse,
} from '../slices/paymentSlice';
import { paymentService } from '../../services/paymentService';

function* makePaymentSaga(action: PayloadAction<{table_id: string, total_amount?: number}>): Generator<any, void, any> {
  try {
    const { table_id, total_amount } = action.payload;
    
    // Call the payment service
    const response: PaymentResponse = yield call(paymentService.makePayment, table_id, total_amount);
    
    // Handle response parsing - check if response is a string that needs parsing
    let payment_response: PaymentResponse;
    if (typeof response === 'string') {
      try {
        payment_response = JSON.parse(response);
        // Payment link handling is now done by the payment management system
        // No need to open window.open here as it will be handled by usePaymentManagement hook
      } catch (parseError) {
        console.error('Failed to parse payment response:', parseError);
        throw new Error('Invalid payment response format');
      }
    } else {
      payment_response = response;
    }
    
    // Dispatch success action
    yield put(makePaymentSuccess(payment_response));
  } catch (error: any) {
    // Extract error message
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        'Payment failed. Please try again.';
    
    // Dispatch failure action
    yield put(makePaymentFailure(errorMessage));
  }
}

function* makeRequestCheckSaga(action: PayloadAction<{table_id: string, total_amount?: number}>): Generator<any, void, any> {
  try {
    const { table_id, total_amount } = action.payload;
    
    // Call the request check service
    const response: any = yield call(paymentService.makeRequestCheck, table_id, total_amount);
    
    // Handle response parsing - check if response is a string that needs parsing
    let request_check_response: any;
    if (typeof response === 'string') {
      try {
        request_check_response = JSON.parse(response);
      } catch (parseError) {
        console.error('Failed to parse request check response:', parseError);
        throw new Error('Invalid request check response format');
      }
    } else {
      request_check_response = response;
    }
    
    // Dispatch success action
    yield put(makeRequestCheckSuccess(request_check_response));
  } catch (error: any) {
    // Extract error message
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        'Request check failed. Please try again.';
    
    // Dispatch failure action
    yield put(makeRequestCheckFailure(errorMessage));
  }
}

export function* watchPaymentSagas() {
  yield takeEvery(makePaymentRequest.type, makePaymentSaga);
  yield takeEvery(makeRequestCheckRequest.type, makeRequestCheckSaga);
}

export default watchPaymentSagas;
