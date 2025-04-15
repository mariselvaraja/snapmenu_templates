import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAppSelector } from '../../../../common/redux';
import { CartDrawer } from './CartDrawer';

export function CartSummary() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useAppSelector(state => state.cart);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      <button 
        onClick={handleOpenCart}
        className="relative p-2 text-orange-600 hover:text-orange-700 transition-colors"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
      </button>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={handleCloseCart} 
      />
    </>
  );
}
