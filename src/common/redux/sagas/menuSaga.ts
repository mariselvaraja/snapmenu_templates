import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  fetchMenuRequest, 
  fetchMenuSuccess, 
  fetchMenuFailure,
  setMenuItems,
  setMenuCategories
} from '../slices/menuSlice';
import { menuService } from '../../services';

// Worker Saga
function* fetchMenuSaga(): Generator<any, void, any> {
  try {
    const menuData = yield call(menuService.getMenu);
    yield put(fetchMenuSuccess(menuData));
  } catch (error) {
    yield put(fetchMenuFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Additional saga for filtering menu by category
function* fetchMenuByCategorySaga(action: { type: string, payload: string }): Generator<any, void, any> {
  try {
    // Get all menu data
    const menuData = yield call(menuService.getMenu);
    
    // Filter items by category
    const categoryItems = menuData.items.filter((item: { category: string }) => 
      item.category.toLowerCase() === action.payload.toLowerCase()
    );
    
    // Update the store with filtered items
    yield put(setMenuItems(categoryItems));
  } catch (error) {
    console.error('Error fetching menu by category:', error);
    yield put(fetchMenuFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Watcher Saga
export function* menuSaga(): Generator<any, void, any> {
  yield takeLatest(fetchMenuRequest.type, fetchMenuSaga);
  yield takeLatest('menu/fetchMenuByCategory', fetchMenuByCategorySaga);
}
