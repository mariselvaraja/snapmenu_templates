import { useCart, CartItem } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const useCartWithToast = () => {
  const { addItem, removeItem, updateItemQuantity } = useCart();
  const { showToast } = useToast();

  const addItemWithToast = (item: CartItem) => {
    addItem(item);
 
  };

  const removeItemWithToast = (skuId: string) => {
    removeItem(skuId);
    showToast('Item removed from cart', 'info', 2000);
  };

  const updateItemQuantityWithToast = (skuId: string, quantity: number) => {
    updateItemQuantity(skuId, quantity);
  };

  return {
    addItemWithToast,
    removeItemWithToast,
    updateItemQuantityWithToast,
  };
};
