import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 * @property {string} image
 */

/**
 * @typedef {Object} CartState
 * @property {CartItem[]} items
 * @property {boolean} isCartOpen
 */

/** @type {CartState} */
const initialState = {
  items: [],
  isCartOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      // Open the cart drawer when an item is added
      state.isCartOpen = true;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.id === id);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    openCartDrawer: (state) => {
      state.isCartOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isCartOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const { 
  addItem, 
  removeItem, 
  updateItemQuantity, 
  clearCart, 
  openCartDrawer, 
  closeCartDrawer, 
  toggleCartDrawer 
} = cartSlice.actions;

export default cartSlice.reducer;
