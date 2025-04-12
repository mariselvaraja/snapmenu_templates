/**
 * Store access utility
 * This file provides access to the Redux store for services
 * without creating circular dependencies
 */

// This will be set by the application when the store is created
let storeInstance: any = null;

export const setStoreInstance = (store: any) => {
  storeInstance = store;
};

export const getStoreState = () => {
  if (!storeInstance) {
    return null;
  }
  return storeInstance.getState();
};

export default {
  setStoreInstance,
  getStoreState,
};
