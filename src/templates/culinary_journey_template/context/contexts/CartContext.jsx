import React, { createContext, useContext, useReducer } from 'react';
import { INITIAL_CART_STATE, CART_ACTIONS } from '../../utils/constants';
import { calculateCartTotal, createCartItem } from '../../utils/cartHelpers';

export const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { item, quantity } = action.payload;
      const existingItem = state.items.find(i => i.id === item.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const updatedItems = state.items.map(i =>
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        );
        return {
          ...state,
          items: updatedItems,
          total: calculateCartTotal(updatedItems),
          isDrawerOpen: true // Open drawer when adding item
        };
      }

      const newItems = [...state.items, createCartItem(item, quantity)];
      return {
        ...state,
        items: newItems,
        total: calculateCartTotal(newItems),
        isDrawerOpen: true // Open drawer when adding item
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        items: newItems,
        total: calculateCartTotal(newItems)
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateCartTotal(updatedItems)
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return INITIAL_CART_STATE;
      
    case CART_ACTIONS.OPEN_DRAWER:
      return {
        ...state,
        isDrawerOpen: true
      };
      
    case CART_ACTIONS.CLOSE_DRAWER:
      return {
        ...state,
        isDrawerOpen: false
      };
      
    case CART_ACTIONS.TOGGLE_DRAWER:
      return {
        ...state,
        isDrawerOpen: !state.isDrawerOpen
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_CART_STATE);
  const value = { state, dispatch };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
