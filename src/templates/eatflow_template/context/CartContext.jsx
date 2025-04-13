import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

 const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const increaseQuantity = (itemId) => {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    ));
  };

  const decreaseQuantity = (itemId) => {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 0) } : item
    ).filter(item => item.quantity > 0));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price) * (item.quantity || 1), 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        calculateTotal,
        isCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
