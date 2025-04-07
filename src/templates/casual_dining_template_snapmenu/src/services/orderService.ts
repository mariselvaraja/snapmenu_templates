import axios from 'axios';
import { CartItem } from '../context/CartContext';

// Define a type for the API item that uses string for price
interface ApiCartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
}

// Base URL for the API
const API_URL = 'https://appliance.genaiembed.ai/p5093';

// Define API response interfaces
interface OrderResponse {
  id: string;
  items: ApiCartItem[];
  subtotal: string;
  tax: string;
  total: string;
  order_type: 'takeout' | 'delivery';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address?: string;
  payment_method: string;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  created_at: string;
  estimated_time: string;
  special_instructions?: string;
  message?: string;
  payment_link?: string;
}

export interface OrderDetails {
  orderId: string;
  orderDate: string;
  orderTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderMethod: 'takeout' | 'delivery';
  deliveryAddress?: string;
  items: CartItem[] | ApiCartItem[];
  subtotal: string;
  tax: string;
  deliveryFee?: string;
  total: string;
  estimatedTime: string;
  specialInstructions?: string;
  status?: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  paymentInfo?: {
    message: string;
    payment_link: string;
  };
}

/**
 * Create a new order
 * @param orderData The order details
 * @returns The created order with confirmation details
 */
export const createOrder = async (
  orderData: Omit<OrderDetails, 'orderId' | 'status'>
): Promise<OrderDetails> => {
  try {
    // Format the data for the API
    const payload = {
      restaurant_id: sessionStorage.getItem("rid"), // Get from session storage or use default
      ordered_items: orderData.items.map(item => {
        // Ensure price is a number and convert to string with 2 decimal places
        const itemPrice = (item.price as number).toFixed(2);
          
        return {
          name: item.name,
          quantity: item.quantity,
          itemPrice: itemPrice,
          modifiers : []
        };
      }),
      order_type: 'manual',
      name: orderData.customerName,
      email: orderData.customerEmail,
      phone: orderData.customerPhone,
      special_requests: orderData.specialInstructions || '',
      grand_total: parseFloat(orderData.total).toFixed(2)
    };

    // Make the API call
    const response = await axios.post<OrderResponse>(`${API_URL}/snapMenu/restaurant/placeOrder`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Process the response
    const result: OrderDetails = {
      orderId: response.data.id || Math.random().toString(36).substring(2, 15),
      orderDate: new Date().toISOString().split('T')[0],
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      orderMethod: orderData.orderMethod,
      deliveryAddress: orderData.deliveryAddress,
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,
      estimatedTime: orderData.estimatedTime,
      specialInstructions: orderData.specialInstructions,
      status: 'confirmed'
    };

    // Check if payment information is included in the response
    if (response.data.message && response.data.payment_link) {
      result.paymentInfo = {
        message: response.data.message,
        payment_link: response.data.payment_link
      };
    }

    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    
    // For development/demo purposes, return a mock successful response
    // In production, you would want to throw the error
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using mock order data due to API error');
      return {
        orderId: Math.random().toString(36).substring(2, 15),
        orderDate: new Date().toISOString().split('T')[0],
        orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        orderMethod: orderData.orderMethod,
        deliveryAddress: orderData.deliveryAddress,
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        deliveryFee: orderData.deliveryFee,
        total: orderData.total,
        estimatedTime: orderData.estimatedTime || '30-45 minutes',
        specialInstructions: orderData.specialInstructions,
        status: 'confirmed',
        // Add mock payment info for testing
        paymentInfo: {
          message: "Order Placed Make Payment",
          payment_link: "https://api.ipospays.tech/v1/sl/3ggy8_150325072656"
        }
      };
    }
    
    throw error;
  }
};

/**
 * Get an order by ID
 * @param id The order ID
 * @returns The order details
 */
export const getOrder = async (id: string): Promise<OrderDetails> => {
  try {
    const response = await axios.get<OrderResponse>(`${API_URL}/orders/${id}`);
    
    // Process the response
    const data = response.data;
    
    const result: OrderDetails = {
      orderId: data.id,
      orderDate: new Date(data.created_at).toISOString().split('T')[0],
      orderTime: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      orderMethod: data.order_type,
      deliveryAddress: data.delivery_address,
      items: data.items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })) as CartItem[],
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      estimatedTime: data.estimated_time,
      specialInstructions: data.special_instructions,
      status: data.status
    };

    // Check if payment information is included in the response
    if (data.message && data.payment_link) {
      result.paymentInfo = {
        message: data.message,
        payment_link: data.payment_link
      };
    }

    return result;
  } catch (error) {
    console.error('Error getting order:', error);
    
    // For development/demo purposes, return a mock response
    // In production, you would want to throw the error
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using mock order data due to API error');
      return {
        orderId: id,
        orderDate: '2025-03-13',
        orderTime: '12:30 PM',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerPhone: '555-123-4567',
        orderMethod: 'takeout',
        items: [
          {
            id: '1',
            name: 'Grilled Salmon',
            price: 24.99,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          },
          {
            id: '2',
            name: 'Caesar Salad',
            price: 12.99,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          }
        ] as CartItem[],
        subtotal: '50.97',
        tax: '4.08',
        total: '55.05',
        estimatedTime: '30-45 minutes',
        specialInstructions: 'Extra lemon for the salmon please',
        status: 'confirmed',
        // Add mock payment info for testing
        paymentInfo: {
          message: "Order Placed Make Payment",
          payment_link: "https://api.ipospays.tech/v1/sl/3ggy8_150325072656"
        }
      };
    }
    
    throw error;
  }
};

/**
 * Update an order's status
 * @param id The order ID
 * @param status The new status
 * @returns The updated order
 */
export const updateOrderStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled'
): Promise<OrderDetails> => {
  try {
    const response = await axios.patch<OrderResponse>(`${API_URL}/orders/${id}`, { status });
    
    // Process the response
    const data = response.data;
    
    return {
      orderId: data.id,
      orderDate: new Date(data.created_at).toISOString().split('T')[0],
      orderTime: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      orderMethod: data.order_type,
      deliveryAddress: data.delivery_address,
      items: data.items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })) as CartItem[],
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      estimatedTime: data.estimated_time,
      specialInstructions: data.special_instructions,
      status: data.status
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    
    // For development/demo purposes, return a mock response
    // In production, you would want to throw the error
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using mock order data due to API error');
      return {
        orderId: id,
        orderDate: '2025-03-13',
        orderTime: '12:30 PM',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerPhone: '555-123-4567',
        orderMethod: 'takeout',
        items: [
          {
            id: '1',
            name: 'Grilled Salmon',
            price: 24.99,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          },
          {
            id: '2',
            name: 'Caesar Salad',
            price: 12.99,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          }
        ] as CartItem[],
        subtotal: '50.97',
        tax: '4.08',
        total: '55.05',
        estimatedTime: '30-45 minutes',
        specialInstructions: 'Extra lemon for the salmon please',
        status,
        paymentInfo: {
          message: "Order Placed Make Payment",
          payment_link: "https://api.ipospays.tech/v1/sl/3ggy8_150325072656"
        }
      };
    }
    
    throw error;
  }
};

/**
 * Get order history for a user
 * @returns Array of order details
 */
export const getOrderHistory = async (): Promise<OrderDetails[]> => {
  try {
    const userId = 28; // Hardcoded user ID for demo purposes
    const response = await axios.get<OrderResponse[]>(`${API_URL}/orders/user/${userId}`);
    
    // Process the response
    return response.data.map(data => ({
      orderId: data.id,
      orderDate: new Date(data.created_at).toISOString().split('T')[0],
      orderTime: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      orderMethod: data.order_type,
      deliveryAddress: data.delivery_address,
      items: data.items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })) as CartItem[],
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      estimatedTime: data.estimated_time,
      specialInstructions: data.special_instructions,
      status: data.status
    }));
  } catch (error) {
    console.error('Error getting order history:', error);
    
    // For development/demo purposes, return a mock response
    // In production, you would want to throw the error
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using mock order history due to API error');
      return [
        {
          orderId: '1',
          orderDate: '2025-03-10',
          orderTime: '7:30 PM',
          customerName: 'John Doe',
          customerEmail: 'john.doe@example.com',
          customerPhone: '555-123-4567',
          orderMethod: 'delivery',
          deliveryAddress: '123 Main St, Anytown, CA 12345',
          items: [
            {
              id: '1',
              name: 'Grilled Salmon',
              price: 24.99,
              quantity: 1,
              imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
            },
            {
              id: '2',
              name: 'Caesar Salad',
              price: 12.99,
              quantity: 2,
              imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
            }
          ] as CartItem[],
          subtotal: '50.97',
          tax: '4.08',
          deliveryFee: '2.99',
          total: '58.04',
          estimatedTime: '30-45 minutes',
          specialInstructions: 'Extra lemon for the salmon please',
          status: 'delivered'
        },
        {
          orderId: '2',
          orderDate: '2025-03-12',
          orderTime: '12:30 PM',
          customerName: 'John Doe',
          customerEmail: 'john.doe@example.com',
          customerPhone: '555-123-4567',
          orderMethod: 'takeout',
          items: [
            {
              id: '3',
              name: 'Ribeye Steak',
              price: 32.99,
              quantity: 1,
              imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
            }
          ] as CartItem[],
          subtotal: '32.99',
          tax: '2.64',
          total: '35.63',
          estimatedTime: 'Ready in 20 minutes',
          status: 'confirmed',
          paymentInfo: {
            message: "Order Placed Make Payment",
            payment_link: "https://api.ipospays.tech/v1/sl/3ggy8_150325072656"
          }
        }
      ];
    }
    
    throw error;
  }
};
