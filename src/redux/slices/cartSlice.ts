import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  pk_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedModifiers?: {
    name: string;
    options: {
      name: string;
      price: number;
    }[];
  }[];
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  drawerOpen: boolean;
  orderPlaced: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  drawerOpen: false,
  orderPlaced: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Synchronous actions
addItem: (state, action: PayloadAction<CartItem>) => {
  const newItem = action.payload;
  
  // Check if an item with the same ID and same modifiers already exists
  const existingItem = state.items.find(item => {
    // If IDs don't match, it's definitely not the same item
    if (item.pk_id !== newItem.pk_id) return false;
    
    // If one has modifiers and the other doesn't, they're different
    const itemHasModifiers = !!item.selectedModifiers && item.selectedModifiers.length > 0;
    const newItemHasModifiers = !!newItem.selectedModifiers && newItem.selectedModifiers.length > 0;
    
    if (itemHasModifiers !== newItemHasModifiers) return false;
    
    // If neither has modifiers, they're the same
    if (!itemHasModifiers && !newItemHasModifiers) return true;
    
    // At this point, we know both items have modifiers
    // TypeScript safety: we've already checked these exist above
    const itemModifiers = item.selectedModifiers || [];
    const newItemModifiers = newItem.selectedModifiers || [];
    
    // If they have different numbers of modifiers, they're different
    if (itemModifiers.length !== newItemModifiers.length) return false;
    
    // Compare each modifier and its options
    for (const itemMod of itemModifiers) {
      // Find the corresponding modifier in the new item
      const newItemMod = newItemModifiers.find(mod => mod.name === itemMod.name);
      
      // If the modifier doesn't exist in the new item, they're different
      if (!newItemMod) return false;
      
      // If they have different numbers of options, they're different
      if (itemMod.options.length !== newItemMod.options.length) return false;
      
      // Check if all options match
      for (const itemOption of itemMod.options) {
        const newItemOption = newItemMod.options.find(opt => opt.name === itemOption.name);
        if (!newItemOption) return false;
      }
    }
    
    // If we got here, all modifiers and options match
    return true;
  });

  if (existingItem) {
    existingItem.quantity += newItem.quantity;
  } else {
    state.items.push(newItem);
  }
  // Open drawer when item is added
  state.drawerOpen = true;
},
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.pk_id !== action.payload);
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.pk_id === id);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      state.drawerOpen = action.payload !== undefined ? action.payload : !state.drawerOpen;
    },
    
    // Async action triggers for sagas
    fetchCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    saveCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    saveCartSuccess: (state) => {
      state.loading = false;
    },
    saveCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Place order actions
    placeOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.orderPlaced = false;
    },
    placeOrderSuccess: (state) => {
      state.loading = false;
      state.orderPlaced = true;
      state.items = []; // Clear cart after successful order
    },
    placeOrderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.orderPlaced = false;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
  toggleDrawer,
  fetchCartRequest,
  fetchCartSuccess,
  fetchCartFailure,
  saveCartRequest,
  saveCartSuccess,
  saveCartFailure,
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFailure,
} = cartSlice.actions;

export default cartSlice.reducer;
