import { useAppDispatch } from '../../../redux';
import { addItem, removeItem, updateItemQuantity, CartItem } from '../../../redux/slices/cartSlice';
import { useToast } from '../context/ToastContext';

export const useCartWithToast = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const addItemWithToast = (item: CartItem) => {
    dispatch(addItem(item));
 
  };

  const removeItemWithToast = (itemId: number) => {
    dispatch(removeItem(itemId));
    showToast('Item removed from cart', 'info', 2000);
  };

  const updateItemQuantityWithToast = (id: number, quantity: number) => {
    dispatch(updateItemQuantity({ id, quantity }));
  };

  return {
    addItemWithToast,
    removeItemWithToast,
    updateItemQuantityWithToast,
  };
};
