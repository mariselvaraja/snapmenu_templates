import { configureAppStore } from './redux';
import { setStoreInstance } from '../services/storeAccess';

// Create the Redux store
export const store = configureAppStore();

// Set the store instance in the storeAccess utility
setStoreInstance(store);

// Re-export types from the shared redux module
export type { RootState, AppDispatch } from './redux';
