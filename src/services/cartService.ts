/**
 * Cart service for handling cart-related API calls
 */

import api from './api';
import endpoints from '../config/endpoints';
import { CartItem } from '../redux/slices/cartSlice';

// Order interface
export interface OrderData {
  items: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    administrative_district_level_1?: string;
    postal_code?: string;
    country?: string;
  };
  paymentInfo?: {
    method: string;
    cardNumber?: string;
    expiryDate?: string;
  };
  delivery_type: 'pickup' | 'delivery';
  pay_now?: boolean
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
      const cartData = sessionStorage.getItem('cart');
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
      const cartData = sessionStorage.getItem('cart');
      const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
      
      // Check if item already exists
      const existingItemIndex = cart.findIndex(cartItem => cartItem.pk_id === item.pk_id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        cart.push(item);
      }
      
      // Save updated cart
      sessionStorage.setItem('cart', JSON.stringify(cart));
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
      const cartData = sessionStorage.getItem('cart');
      const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
      
      // Remove item
      const updatedCart = cart.filter(item => item.pk_id !== itemId);
      
      // Save updated cart
      sessionStorage.setItem('cart', JSON.stringify(updatedCart));
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
      const cartData = sessionStorage.getItem('cart');
      const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
      
      // Find and update item
      const itemIndex = cart.findIndex(item => item.pk_id === itemId);
      
      if (itemIndex >= 0) {
        cart[itemIndex].quantity = quantity;
      }
      
      // Save updated cart
      sessionStorage.setItem('cart', JSON.stringify(cart));
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
      sessionStorage.setItem('cart', JSON.stringify([]));
      return [];
    } catch (error) {
      console.error('Error clearing cart in storage:', error);
      throw error;
    }
  },

  /**
   * Places an order with the current cart items and customer information
   */
  placeOrder: async (orderData: OrderData, restaurant_id: any): Promise<any> => {
  
    try {
      // Format the order payload as required
      const formattedPayload: any = {
        restaurant_id:  sessionStorage.getItem("franchise_id"),
        name: orderData.customerInfo.name,
        phone: orderData.customerInfo.phone,
        email: orderData.customerInfo.email,
        special_requests: orderData.customerInfo.address || "",
        order_type: "web",
        delivery_type: orderData.delivery_type,
        pay_now : orderData.pay_now
      };

      // Add address fields for delivery orders
      if (orderData.delivery_type === 'delivery') {
        formattedPayload.delivery_address = {
          address_line_1: orderData.customerInfo.address_line_1 || "",
          address_line_2: orderData.customerInfo.address_line_2 || "",
          locality: orderData.customerInfo.locality || "",
          administrative_district_level_1: orderData.customerInfo.administrative_district_level_1 || "",
          postal_code: orderData.customerInfo.postal_code || "",
          country: orderData.customerInfo.country || "US"
        };
        formattedPayload.pay_now = true;
      }

      // Add ordered items and grand total
      formattedPayload.ordered_items = orderData.items.map(item => {
          // Ensure we have valid item data
          const itemName = item.name || 'Unknown Item';
          const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.-]/g, '')) || 0;
          const itemQuantity = typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity)) || 1;
          
          // Calculate modifier price safely
          const modifierPrice = item.selectedModifiers?.reduce((sum, modifier) => {
            return sum + (modifier.options?.reduce((optSum, option) => {
              const optionPrice = typeof option.price === 'number' ? option.price : parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0;
              return optSum + optionPrice;
            }, 0) || 0);
          }, 0) || 0;
          
          // Get spice level safely
          const spiceLevel = item.selectedModifiers?.find(modifier => modifier.name === "Spice Level")?.options?.[0]?.name || null;
          
          return {
            name: itemName,
            quantity: itemQuantity,
            itemPrice: itemPrice.toFixed(2),
            modifiers: item.selectedModifiers?.filter((modifier) => modifier.name !== "Spice Level").flatMap((modifier) => 
              modifier.options?.map(option => ({
                modifier_name: option.name,
                modifier_price: typeof option.price === 'number' ? option.price : parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0
              })) || []
            ) || [],
            modifier_price: modifierPrice,
            spicelevel: spiceLevel,
            image: item.image,
            total_item_price: ((itemPrice + modifierPrice) * itemQuantity).toFixed(2)
          };
        });

      formattedPayload.grand_total = orderData.items.reduce((sum, item) => {
        const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.-]/g, '')) || 0;
        const itemQuantity = typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity)) || 1;
        const modifierPrice = item.selectedModifiers?.reduce((modSum, modifier) => {
          return modSum + (modifier.options?.reduce((optSum, option) => {
            const optionPrice = typeof option.price === 'number' ? option.price : parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0;
            return optSum + optionPrice;
          }, 0) || 0);
        }, 0) || 0;
        return sum + ((itemPrice + modifierPrice) * itemQuantity);
      }, 0).toFixed(2);
      
      console.log('Formatted payload:', orderData);
      
      // Make API call to place order
      const response = await api.post<any>(endpoints.cart.placeOrder, formattedPayload);
      
      // Clear local cart after successful order
      sessionStorage.setItem('cart', JSON.stringify([])); 

      // Response is ApiResponse<any> object, access data property directly
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },
};

export default cartService;
