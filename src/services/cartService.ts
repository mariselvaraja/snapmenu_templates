/**
 * Cart service for handling cart-related API calls
 */

import api, { ApiResponse } from './api';
import endpoints from '../config/endpoints';
import { environment } from '../config/endpoints';
import { CartItem } from '../redux/slices/cartSlice';

// Order interface
export interface OrderData {
  items: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentInfo?: {
    method: string;
    cardNumber?: string;
    expiryDate?: string;
  };
}

/**
 * Service for handling cart-related operations
 */
export const cartService = {
  /**
   * Fetches the cart items from storage
   */
  getCart: async (): Promise<CartItem[]> => {
    console.log('Using local storage for cart data');
    
    try {
      const cartData = localStorage.getItem('cart');
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error fetching cart from storage:', error);
      return [];
    }
  },

  /**
   * Adds an item to the cart
   */
  addToCart: async (item: CartItem): Promise<CartItem[]> => {
    console.log('Adding item to cart in local storage');
    
    try {
      // Get current cart
      const cartData = localStorage.getItem('cart');
      const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
      
      // Check if item already exists
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        cart.push(item);
      }
      
      // Save updated cart
      localStorage.setItem('cart', JSON.stringify(cart));
      return cart;
    } catch (error) {
      console.error('Error adding item to cart in storage:', error);
      throw error;
    }
  },

  /**
   * Removes an item from the cart
   */
  removeFromCart: async (itemId: number): Promise<CartItem[]> => {
    console.log(`Removing item ${itemId} from cart in local storage`);
    
    try {
      // Get current cart
      const cartData = localStorage.getItem('cart');
      const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
      
      // Remove item
      const updatedCart = cart.filter(item => item.id !== itemId);
      
      // Save updated cart
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    } catch (error) {
      console.error('Error removing item from cart in storage:', error);
      throw error;
    }
  },

  /**
   * Updates an item's quantity in the cart
   */
  updateCartItem: async (itemId: number, quantity: number): Promise<CartItem[]> => {
    console.log(`Updating item ${itemId} quantity to ${quantity} in local storage`);
    
    try {
      // Get current cart
      const cartData = localStorage.getItem('cart');
      const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
      
      // Find and update item
      const itemIndex = cart.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        cart[itemIndex].quantity = quantity;
      }
      
      // Save updated cart
      localStorage.setItem('cart', JSON.stringify(cart));
      return cart;
    } catch (error) {
      console.error('Error updating item in cart in storage:', error);
      throw error;
    }
  },

  /**
   * Clears all items from the cart
   */
  clearCart: async (): Promise<CartItem[]> => {
    console.log('Clearing cart in local storage');
    
    try {
      // Clear cart
      localStorage.setItem('cart', JSON.stringify([]));
      return [];
    } catch (error) {
      console.error('Error clearing cart in storage:', error);
      throw error;
    }
  },

  /**
   * Places an order with the current cart items and customer information
   */
  placeOrder: async (orderData: OrderData): Promise<any> => {
    console.log('Placing order with API');
    
    try {
      // Format the order payload as required
      const formattedPayload = {
        restaurant_id: "2256b9a6-5d53-4b77-b6a0-539043489ad3",
        name: orderData.customerInfo.name,
        phone: orderData.customerInfo.phone,
        email: orderData.customerInfo.email,
        special_requests: orderData.customerInfo.address || "",
        order_type: "manual",
        ordered_items: orderData.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          itemPrice: item.price.toFixed(2),
          modifiers: [],
          modifier_price: null,
          total_item_price: (item.price * item.quantity).toFixed(2)
        })),
        grand_total: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
      };
      
      console.log('Formatted payload:', formattedPayload);
      
      // Make API call to place order
      const response = await api.post<any>(endpoints.cart.placeOrder, formattedPayload);
      
      // Clear local cart after successful order
      localStorage.setItem('cart', JSON.stringify([]));
      
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },
};

export default cartService;
