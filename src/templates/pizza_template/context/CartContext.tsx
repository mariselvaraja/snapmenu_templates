import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface CartItem {
  pk_id: number;
  sku_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  spiceLevel: string;
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
  drawerOpen: boolean;
  orderPlaced: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { sku_id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_DRAWER'; payload?: boolean }
  | { type: 'SET_ORDER_PLACED'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (sku_id: string) => void;
  updateItemQuantity: (sku_id: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: (open?: boolean) => void;
  setOrderPlaced: (placed: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'pizza_template_cart';

// Helper function to normalize modifier data for consistent processing
export const normalizeModifiers = (modifiers?: any[]): CartItem['selectedModifiers'] => {
  if (!modifiers || !Array.isArray(modifiers) || modifiers.length === 0) {
    return [];
  }

  return modifiers
    .filter(modifier => 
      modifier && 
      modifier.name && 
      modifier.options && 
      Array.isArray(modifier.options) && 
      modifier.options.length > 0
    )
    .map(modifier => ({
      name: modifier.name.trim(),
      options: modifier.options
        .filter((option: any) => option && option.name)
        .map((option: any) => ({
          name: option.name.trim(),
          price: typeof option.price === 'string' 
            ? parseFloat(option.price.replace(/[^\d.-]/g, '')) || 0
            : (typeof option.price === 'number' && !isNaN(option.price) ? option.price : 0)
        }))
        .filter((option: any) => option.name) // Remove options with empty names
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
    }))
    .filter(modifier => modifier.options.length > 0) // Remove modifiers with no valid options
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Helper function to generate unique sku_id based on product and modifiers
export const generateSkuId = (pk_id: number, selectedModifiers?: CartItem['selectedModifiers']): string => {
  // Ensure pk_id is valid
  const productId = typeof pk_id === 'string' ? parseInt(pk_id) : (pk_id || 0);
  let skuId = `${productId}`;
  
  // Normalize modifiers to ensure consistency
  const normalizedModifiers = normalizeModifiers(selectedModifiers) || [];
  
  // Only add modifier suffix if there are actual modifiers with options
  if (normalizedModifiers && normalizedModifiers.length > 0) {
    const modifierString = normalizedModifiers
      .map(modifier => 
        `${modifier.name}:${modifier.options.map(opt => opt.name).join(',')}`
      )
      .join('|');
    
    // Create a consistent hash of the modifier string
    try {
      skuId += `_${btoa(modifierString).replace(/[^a-zA-Z0-9]/g, '')}`;
    } catch (e) {
      // Fallback if btoa fails
      skuId += `_${modifierString.replace(/[^a-zA-Z0-9:,|]/g, '')}`;
    }
  }
  
  return skuId;
};

// Helper function to create a standardized cart item
export const createCartItem = (
  menuItem: any, 
  selectedModifiers?: any[], 
  quantity: number = 1
): CartItem => {
  const normalizedModifiers = normalizeModifiers(selectedModifiers) || [];
  const productId = typeof menuItem.pk_id === 'string' ? parseInt(menuItem.pk_id) : (menuItem.pk_id || 0);
  
  return {
    pk_id: productId,
    sku_id: generateSkuId(productId, normalizedModifiers),
    name: menuItem.name || '',
    price: typeof menuItem.price === 'number' && !isNaN(menuItem.price) ? menuItem.price : 0,
    image: menuItem.image || '',
    quantity: quantity,
    spiceLevel: '', // Legacy field, kept for compatibility
    selectedModifiers: normalizedModifiers
  };
};

const initialState: CartState = {
  items: [],
  drawerOpen: false,
  orderPlaced: false,
};

// Helper function to save cart to sessionStorage
const saveCartToStorage = (items: CartItem[]) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to sessionStorage:', error);
  }
};

// Helper function to load cart from sessionStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load cart from sessionStorage:', error);
    return [];
  }
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      
      // Check if an item with the same sku_id already exists
      const existingItem = state.items.find(item => item.sku_id === newItem.sku_id);

      let updatedItems: CartItem[];
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, newItem];
      }

      saveCartToStorage(updatedItems);
      return {
        ...state,
        items: updatedItems,
        drawerOpen: true, // Open drawer when item is added
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.sku_id !== action.payload);
      saveCartToStorage(updatedItems);
      return {
        ...state,
        items: updatedItems,
      };
    }

    case 'UPDATE_ITEM_QUANTITY': {
      const { sku_id, quantity } = action.payload;
      const updatedItems = state.items.map(item =>
        item.sku_id === sku_id ? { ...item, quantity } : item
      );
      saveCartToStorage(updatedItems);
      return {
        ...state,
        items: updatedItems,
      };
    }

    case 'CLEAR_CART': {
      saveCartToStorage([]);
      return {
        ...state,
        items: [],
      };
    }

    case 'TOGGLE_DRAWER':
      return {
        ...state,
        drawerOpen: action.payload !== undefined ? action.payload : !state.drawerOpen,
      };

    case 'SET_ORDER_PLACED':
      if (action.payload) {
        // Clear cart when order is placed
        saveCartToStorage([]);
        return {
          ...state,
          orderPlaced: action.payload,
          items: [],
        };
      }
      return {
        ...state,
        orderPlaced: action.payload,
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from sessionStorage on mount
  useEffect(() => {
    const storedCart = loadCartFromStorage();
    if (storedCart.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: storedCart });
    }
  }, []);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (sku_id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: sku_id });
  };

  const updateItemQuantity = (sku_id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { sku_id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleDrawer = (open?: boolean) => {
    dispatch({ type: 'TOGGLE_DRAWER', payload: open });
  };

  const setOrderPlaced = (placed: boolean) => {
    dispatch({ type: 'SET_ORDER_PLACED', payload: placed });
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    toggleDrawer,
    setOrderPlaced,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
