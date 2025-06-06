import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InDiningCartItem {
  id: number;
  name: string;
  price: any;
  quantity: number;
  image: string;
  selectedModifiers?: {
    name: string;
    options: {
      name: string;
      price: number;
    }[];
  }[];
  tableId?: string;
  uniqueId?: string; // Add unique identifier for cart items with different modifiers
}

interface InDiningCartState {
  items: InDiningCartItem[];
  loading: boolean;
  error: string | null;
  drawerOpen: boolean;
  orderPlaced: boolean;
  tableId: string | null;
}

const initialState: InDiningCartState = {
  items: [],
  loading: false,
  error: null,
  drawerOpen: false,
  orderPlaced: false,
  tableId: null,
};

// Helper function to generate unique ID for cart items
const generateUniqueId = (item: InDiningCartItem): string => {
  const modifiersString = item.selectedModifiers
    ? item.selectedModifiers
        .map(mod => 
          `${mod.name}:${mod.options.map(opt => `${opt.name}-${opt.price}`).join(',')}`
        )
        .sort()
        .join('|')
    : '';
  return `${item.id}-${modifiersString}`;
};

// Helper function to find item by unique characteristics
const findItemByUniqueCharacteristics = (items: InDiningCartItem[], targetItem: InDiningCartItem): InDiningCartItem | undefined => {
  return items.find((item: InDiningCartItem) => {
    // If IDs don't match, it's definitely not the same item
    if (item.id !== targetItem.id) return false;
    
    // If one has modifiers and the other doesn't, they're different
    const itemHasModifiers = !!item.selectedModifiers && item.selectedModifiers.length > 0;
    const targetHasModifiers = !!targetItem.selectedModifiers && targetItem.selectedModifiers.length > 0;
    
    if (itemHasModifiers !== targetHasModifiers) return false;
    
    // If neither has modifiers, they're the same
    if (!itemHasModifiers && !targetHasModifiers) return true;
    
    // At this point, we know both items have modifiers
    const itemModifiers = item.selectedModifiers || [];
    const targetModifiers = targetItem.selectedModifiers || [];
    
    // If they have different numbers of modifiers, they're different
    if (itemModifiers.length !== targetModifiers.length) return false;
    
    // Compare each modifier and its options
    for (const itemMod of itemModifiers) {
      // Find the corresponding modifier in the target item
      const targetMod = targetModifiers.find((mod: any) => mod.name === itemMod.name);
      
      // If the modifier doesn't exist in the target item, they're different
      if (!targetMod) return false;
      
      // If they have different numbers of options, they're different
      if (itemMod.options.length !== targetMod.options.length) return false;
      
      // Check if all options match
      for (const itemOption of itemMod.options) {
        const targetOption = targetMod.options.find((opt: any) => opt.name === itemOption.name);
        if (!targetOption) return false;
      }
    }
    
    // If we got here, all modifiers and options match
    return true;
  });
};

export const inDiningCartSlice = createSlice({
  name: 'inDiningCart',
  initialState,
  reducers: {
    // Set table ID for the cart
    setTableId: (state, action: PayloadAction<string>) => {
      state.tableId = action.payload;
    },
    
    // Synchronous actions
    addItem: (state, action: PayloadAction<InDiningCartItem>) => {
      const newItem = action.payload;
      
      // Use helper function to find existing item
      const existingItem = findItemByUniqueCharacteristics(state.items, newItem);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        // Generate unique ID and add table ID to the item if available
        const uniqueId = generateUniqueId(newItem);
        const itemWithTable = { 
          ...newItem, 
          uniqueId,
          tableId: state.tableId || newItem.tableId 
        };
        state.items.push(itemWithTable);
      }
      // Open drawer when item is added
      state.drawerOpen = true;
    },
    
    // Remove item by unique characteristics (considering modifiers)
    removeItemByCharacteristics: (state, action: PayloadAction<InDiningCartItem>) => {
      const targetItem = action.payload;
      const itemIndex = state.items.findIndex(item => {
        const existingItem = findItemByUniqueCharacteristics([item], targetItem);
        return !!existingItem;
      });
      
      if (itemIndex >= 0) {
        state.items.splice(itemIndex, 1);
      }
    },
    
    // Update item quantity by unique characteristics (considering modifiers)
    updateItemQuantityByCharacteristics: (state, action: PayloadAction<{ item: InDiningCartItem; quantity: number }>) => {
      const { item: targetItem, quantity } = action.payload;
      const itemToUpdate = findItemByUniqueCharacteristics(state.items, targetItem);
      
      if (itemToUpdate) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          const itemIndex = state.items.findIndex(item => item === itemToUpdate);
          if (itemIndex >= 0) {
            state.items.splice(itemIndex, 1);
          }
        } else {
          itemToUpdate.quantity = quantity;
        }
      }
    },
    
    // Legacy actions for backward compatibility
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item: InDiningCartItem) => item.id !== action.payload);
    },
    
    updateItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find((item: InDiningCartItem) => item.id === id);
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
    fetchInDiningCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInDiningCartSuccess: (state, action: PayloadAction<InDiningCartItem[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchInDiningCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    saveInDiningCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    saveInDiningCartSuccess: (state) => {
      state.loading = false;
    },
    saveInDiningCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Place order actions
    placeInDiningOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.orderPlaced = false;
    },
    placeInDiningOrderSuccess: (state) => {
      state.loading = false;
      state.orderPlaced = true;
      state.items = []; // Clear cart after successful order
    },
    placeInDiningOrderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.orderPlaced = false;
    },
    
    // Reset order placed state
    resetOrderPlaced: (state) => {
      state.orderPlaced = false;
    },
  },
});

export const {
  setTableId,
  addItem,
  removeItem,
  updateItemQuantity,
  removeItemByCharacteristics,
  updateItemQuantityByCharacteristics,
  clearCart,
  toggleDrawer,
  fetchInDiningCartRequest,
  fetchInDiningCartSuccess,
  fetchInDiningCartFailure,
  saveInDiningCartRequest,
  saveInDiningCartSuccess,
  saveInDiningCartFailure,
  placeInDiningOrderRequest,
  placeInDiningOrderSuccess,
  placeInDiningOrderFailure,
  resetOrderPlaced,
} = inDiningCartSlice.actions;

export default inDiningCartSlice.reducer;
