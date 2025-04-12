import React, { createContext, useContext, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
}

export type { CartContextType };

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContext };
