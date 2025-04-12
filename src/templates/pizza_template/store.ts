import { configureAppStore } from './shared/redux';
import { setStoreInstance } from './shared/services/storeAccess';

// Create the Redux store
export const store = configureAppStore();

// Set the store instance in the storeAccess utility
setStoreInstance(store);

// Re-export types from the shared redux module
export type { RootState, AppDispatch } from './shared/redux';
