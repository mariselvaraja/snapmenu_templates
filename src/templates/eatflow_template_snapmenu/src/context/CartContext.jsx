import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

 const addToCart = (item) => {
    // Convert price to number if it's a string
    const itemWithNumberPrice = {
      ...item,
      price: typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^\d.-]/g, '')) 
        : item.price
    };

    const existingItem = cart.find((cartItem) => cartItem.id === itemWithNumberPrice.id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === itemWithNumberPrice.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...itemWithNumberPrice, quantity: 1 }]);
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
    return cart.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^\d.-]/g, '')) 
        : item.price;
      return total + price * (item.quantity || 1);
    }, 0);
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
