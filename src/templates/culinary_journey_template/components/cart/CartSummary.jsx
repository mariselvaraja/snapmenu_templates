import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/contexts/CartContext';
import { CartDrawer } from './CartDrawer';
import { CART_ACTIONS } from '../../utils/constants';

export function CartSummary() {
  const { state, dispatch } = useCart();
  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleOpenCart = () => {
    dispatch({ type: CART_ACTIONS.OPEN_DRAWER });
  };

  const handleCloseCart = () => {
    dispatch({ type: CART_ACTIONS.CLOSE_DRAWER });
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
        isOpen={state.isDrawerOpen} 
        onClose={handleCloseCart} 
      />
    </>
  );
}
