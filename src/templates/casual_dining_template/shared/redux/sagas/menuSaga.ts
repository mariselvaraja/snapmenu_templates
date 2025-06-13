import { call, put, takeLatest, select } from 'redux-saga/effects';
import { 
  fetchMenuRequest, 
  fetchMenuSuccess, 
  fetchMenuFailure,
  setMenuItems,
  setMenuCategories
} from '../slices/menuSlice';
import { menuService } from '../../services';

// Worker Saga - Disabled to prevent duplicate API calls
// Menu data is now fetched in the common saga
function* fetchMenuSaga(): Generator<any, void, any> {
  try {
    // This saga is now disabled to prevent duplicate API calls
    // The common saga will handle fetching menu data
    console.log('Pizza template MenuSaga: Skipping API call to prevent duplication');
    
    // We don't need to dispatch success action here as it will be handled by the common saga
  } catch (error) {
    yield put(fetchMenuFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
  }
}

// Selector to get menu items from state
const getMenuItems = (state: any) => state.menu.items;

// Additional saga for filtering menu by category
function* fetchMenuByCategorySaga(action: { type: string, payload: string }): Generator<any, void, any> {
  try {
    // Get menu data from the Redux store using select effect
    const menuItems = yield select(getMenuItems);
    
    // Check if menu data is already loaded
    if (menuItems && menuItems.length > 0) {
      console.log('Using existing menu data for category filtering');
      
      // Filter items by category
      const categoryItems = menuItems.filter((item: { category: string }) => 
        item.category.toLowerCase() === action.payload.toLowerCase()
      );
      
      // Update the store with filtered items
      yield put(setMenuItems(categoryItems));
    } else {
      console.log('Menu data not loaded, fetching from API for category filtering');
      
      // Get all menu data from API
      const menuData = yield call(menuService.getMenu);
      
      // Filter items by category
      const categoryItems = menuData.items.filter((item: { category: string }) => 
        item.category.toLowerCase() === action.payload.toLowerCase()
      );
      
      // Update the store with filtered items
      yield put(setMenuItems(categoryItems));
    }
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
