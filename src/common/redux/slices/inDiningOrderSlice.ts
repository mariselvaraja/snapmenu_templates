import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InDiningOrderItem {
  id: number;
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

export interface InDiningOrder {
  id?: string;
  table_id: string;
  items: InDiningOrderItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'preparing' | 'ready' | 'delivered' | 'void';
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

interface InDiningOrderState {
  orders: InDiningOrder[];
  currentOrder: InDiningOrder | null;
  loading: boolean;
  error: string | null;
  drawerOpen: boolean;
}

const initialState: InDiningOrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  drawerOpen: false,
};

export const inDiningOrderSlice = createSlice({
  name: 'inDiningOrder',
  initialState,
  reducers: {
    // Drawer control
    toggleDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      state.drawerOpen = action.payload !== undefined ? action.payload : !state.drawerOpen;
    },
    
    // Get in-dining orders
    getInDiningOrdersRequest: (state, action: PayloadAction<string | undefined>) => {
      state.loading = true;
      state.error = null;
    },
    getInDiningOrdersSuccess: (state, action: PayloadAction<InDiningOrder[]>) => {
      state.orders = action.payload;
      state.loading = false;
    },
    getInDiningOrdersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Get in-dining orders silently (without loading state)
    getInDiningOrdersSilentRequest: (state) => {
      state.error = null;
    },
    getInDiningOrdersSilentSuccess: (state, action: PayloadAction<InDiningOrder[]>) => {
      state.orders = action.payload;
    },
    getInDiningOrdersSilentFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    // Place in-dining order
    placeInDiningOrderRequest: (state, action: PayloadAction<any>) => {
      state.loading = true;
      state.error = null;
    },
    placeInDiningOrderSuccess: (state, action: PayloadAction<InDiningOrder>) => {
      state.orders.push(action.payload);
      state.currentOrder = action.payload;
      state.loading = false;
    },
    placeInDiningOrderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Update in-dining order
    updateInDiningOrderRequest: (state, action: PayloadAction<{ orderId: string; updates: Partial<InDiningOrder> }>) => {
      state.loading = true;
      state.error = null;
    },
    updateInDiningOrderSuccess: (state, action: PayloadAction<InDiningOrder>) => {
      const updatedOrder = action.payload;
      state.orders = state.orders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      );
      if (state.currentOrder && state.currentOrder.id === updatedOrder.id) {
        state.currentOrder = updatedOrder;
      }
      state.loading = false;
    },
    updateInDiningOrderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Set current order
    setCurrentOrder: (state, action: PayloadAction<InDiningOrder | null>) => {
      state.currentOrder = action.payload;
    },
    
    // Add item to current order
    addItemToOrder: (state, action: PayloadAction<InDiningOrderItem>) => {
      const newItem = action.payload;
      
      if (!state.currentOrder) {
        // Create a new order if none exists
        state.currentOrder = {
          table_id: '',
          items: [newItem],
          status: 'pending',
          totalAmount: newItem.price * newItem.quantity
        };
      } else {
        // Check if item already exists in order
        const existingItemIndex = state.currentOrder.items.findIndex(item => item.id === newItem.id);
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          state.currentOrder.items[existingItemIndex].quantity += newItem.quantity;
        } else {
          // Add new item to order
          state.currentOrder.items.push(newItem);
        }
        
        // Recalculate total amount
        state.currentOrder.totalAmount = state.currentOrder.items.reduce(
          (total, item) => total + (item.price * item.quantity), 0
        );
      }
      
      // Open drawer when item is added
      state.drawerOpen = true;
    },
    
    // Remove item from current order
    removeItemFromOrder: (state, action: PayloadAction<number>) => {
      if (state.currentOrder) {
        state.currentOrder.items = state.currentOrder.items.filter(item => item.id !== action.payload);
        
        // Recalculate total amount
        state.currentOrder.totalAmount = state.currentOrder.items.reduce(
          (total, item) => total + (item.price * item.quantity), 0
        );
      }
    },
    
    // Update item quantity in current order
    updateItemQuantityInOrder: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      
      if (state.currentOrder) {
        const itemToUpdate = state.currentOrder.items.find(item => item.id === id);
        
        if (itemToUpdate) {
          itemToUpdate.quantity = quantity;
          
          // Recalculate total amount
          state.currentOrder.totalAmount = state.currentOrder.items.reduce(
            (total, item) => total + (item.price * item.quantity), 0
          );
        }
      }
    },
    
    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const {
  toggleDrawer,
  getInDiningOrdersRequest,
  getInDiningOrdersSuccess,
  getInDiningOrdersFailure,
  getInDiningOrdersSilentRequest,
  getInDiningOrdersSilentSuccess,
  getInDiningOrdersSilentFailure,
  placeInDiningOrderRequest,
  placeInDiningOrderSuccess,
  placeInDiningOrderFailure,
  updateInDiningOrderRequest,
  updateInDiningOrderSuccess,
  updateInDiningOrderFailure,
  setCurrentOrder,
  addItemToOrder,
  removeItemFromOrder,
  updateItemQuantityInOrder,
  clearCurrentOrder,
} = inDiningOrderSlice.actions;

export default inDiningOrderSlice.reducer;
