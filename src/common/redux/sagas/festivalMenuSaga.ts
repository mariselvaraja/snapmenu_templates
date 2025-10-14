import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { festivalMenuService } from '../../services/festivalMenuService';
import {
  getFestivalMenuRequest,
  getFestivalMenuSuccess,
  getFestivalMenuFailure
} from '../slices/festivalMenuSlice';

function* getFestivalMenuSaga(): Generator<any, void, any> {
  try {
    const data = yield call(festivalMenuService.getFestivalMenu);
    
    // Get menu state to filter items by pk_ids
    const menuState = yield select((state: any) => state.menu);
    const allFoodItems = menuState || [];
    const allDrinksItems = menuState.drinksItems || [];

    
    const response = JSON.parse(data)
    // Extract pk_ids from response
    const foodMenuPkIds = response?.foodMenu || [];
    const drinksMenuPkIds = response?.drinksMenu || [];

    
    
    // Filter items by pk_ids
    const filteredFoodItems = allFoodItems.foodItems.filter((item: any) => 
      foodMenuPkIds.includes(item.pk_id)
    );
    
    const filteredDrinksItems = allDrinksItems.filter((item: any) => 
      drinksMenuPkIds.includes(item.pk_id)
    );
    
    // Create response with filtered items
    const festivalMenuData = {
      foodMenu: filteredFoodItems,
      drinksMenu: filteredDrinksItems,
      rawResponse: response
    };
    
    yield put(getFestivalMenuSuccess(festivalMenuData));
  } catch (error: any) {
    yield put(getFestivalMenuFailure(error.message || 'Failed to fetch quick menu'));
  }
}

export function* watchFestivalMenuSaga() {
  yield takeLatest(getFestivalMenuRequest.type, getFestivalMenuSaga);
}
