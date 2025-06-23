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
    
    // Handle response parsing - check if response is a string that needs parsing
    let payment_response: PaymentResponse;
    if (typeof response === 'string') {
      try {
        payment_response = JSON.parse(response);
        if( payment_response?.paymentLink)
        {
          // window.location.href = payment_response.paymentLink;
          window.open(payment_response.paymentLink, "_blank")
        }
        else if(payment_response?.message)
        {
          alert(payment_response?.message)
        }
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

export function* watchPaymentSagas() {
  yield takeEvery(makePaymentRequest.type, makePaymentSaga);
}

export default watchPaymentSagas;
