import axios from 'axios';
import { CartItem } from '../cartSlice';

// Base URL for the API
const API_URL = 'https://appliance.genaiembed.ai/p5093';

// Modifier interface for pizza toppings and options
export interface OrderModifier {
  modifier_name: string;
  modifier_price: string | number;
}

// Extended CartItem for our service
export interface OrderItem {
  id: string | number;
  name: string;
  price: string | number;
  quantity: number;
  image?: string;
  imageUrl?: string;
  modifiers?: OrderModifier[];
}

// Types
export interface OrderData {
  orderDate: string;
  orderTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderMethod: 'takeout' | 'delivery';
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: string;
  tax: string;
  deliveryFee?: string;
  total: string;
  estimatedTime?: string;
  specialInstructions?: string;
}

export interface OrderDetails extends OrderData {
  orderId: string;
  status?: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  createdAt?: string;
  paymentInfo?: {
    message: string;
    payment_link: string;
  };
}

// Convert CartItem to OrderItem
const convertCartItemToOrderItem = (item: CartItem): OrderItem => {
  return {
    id: String(item.id),
    name: item.name,
    price: String(item.price),
    quantity: item.quantity,
    image: item.image,
    modifiers: item.modifiers || []
  };
};

/**
 * Create a new order
 * @param orderData The order details
 * @returns The created order with confirmation details
 */
export const createOrder = async (orderData: OrderData): Promise<OrderDetails> => {
  try {
    // Format the data for the API based on the required payload structure
    const payload = {
      restaurant_id: sessionStorage.getItem("rid"), // Get from session storage or use default
      name: orderData.customerName,
      phone: orderData.customerPhone,
      email: orderData.customerEmail || null,
      special_requests: orderData.specialInstructions || null,
      order_type: 'manual', // Changed from 'manual' to 'order' as per the sample payload
      ordered_items: orderData.items.map(item => {
        // Ensure price is a number and convert to string with 2 decimal places
        const itemPrice = typeof item.price === 'number' 
          ? item.price.toFixed(2) 
          : parseFloat(String(item.price).replace(/[^\d.-]/g, '')).toFixed(2);
          
        // Calculate total item price
        const totalItemPrice = (parseFloat(itemPrice) * item.quantity).toFixed(2);
        
        // Generate sample modifiers (in a real app, these would come from the item data)
        const modifiers = item.modifiers || [];
        
        // Calculate modifier price total
        const modifierPriceTotal = modifiers.reduce((total, mod) => 
          total + parseFloat(typeof mod.modifier_price === 'string' ? mod.modifier_price : String(mod.modifier_price)), 0);
        
        return {
          name: item.name,
          quantity: item.quantity,
          itemPrice: itemPrice,
          modifiers: modifiers.length > 0 ? modifiers : [
            // Default modifiers if none provided (for demo purposes)
            { modifier_name: "extra cheese", modifier_price: "1.50" },
            { modifier_name: "garlic", modifier_price: "0.50" }
          ],
          modifier_price: modifierPriceTotal.toFixed(2),
          total_item_price: (parseFloat(itemPrice) * item.quantity + modifierPriceTotal).toFixed(2)
        };
      }),
      grand_total: typeof orderData.total === 'string' 
        ? parseFloat(orderData.total.replace(/[^\d.-]/g, '')).toFixed(2)
        : parseFloat(String(orderData.total)).toFixed(2)
    };
    
    console.log('Order payload:', JSON.stringify(payload, null, 2));

    // Make the API call
    const response = await axios.post(`${API_URL}/snapMenu/restaurant/placeOrder`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Process the response
    const responseData = response.data as any;
    const result: OrderDetails = {
      orderId: responseData?.id || Math.random().toString(36).substring(2, 15),
      orderDate: orderData.orderDate,
      orderTime: orderData.orderTime,
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
      estimatedTime: orderData.estimatedTime || (orderData.orderMethod === 'delivery' ? '30-45 minutes' : '15-20 minutes'),
      specialInstructions: orderData.specialInstructions,
      status: 'confirmed'
    };

    // Check if payment information is included in the response
    if (responseData.message && responseData.payment_link) {
      (result as any).paymentInfo = {
        message: responseData.message,
        payment_link: responseData.payment_link
      };
    }

    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    
    // For development/demo purposes, return a mock successful response
    // In production, you would want to throw the error
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using mock order data due to API error');
      const mockOrderData = {
        orderId: Math.random().toString(36).substring(2, 15),
        orderDate: orderData.orderDate,
        orderTime: orderData.orderTime,
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
        status: 'confirmed' as 'confirmed',
        // Add mock payment info for testing
        paymentInfo: {
          message: "Order Placed Make Payment",
          payment_link: "https://api.ipospays.tech/v1/sl/HBCQG_150325072319"
        }
      };
      return mockOrderData;
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
    const response = await axios.get(`${API_URL}/orders/${id}`);
    
    // Process the response
    const data = response.data as any;
    
    return {
      orderId: data.id,
      orderDate: new Date(data.created_at).toISOString().split('T')[0],
      orderTime: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      orderMethod: data.order_type,
      deliveryAddress: data.delivery_address,
      items: data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      estimatedTime: data.estimated_time,
      specialInstructions: data.special_instructions,
      status: data.status
    };
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
            name: 'Margherita Pizza',
            price: '14.99',
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          },
          {
            id: '2',
            name: 'Caesar Salad',
            price: '8.99',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          }
        ],
        subtotal: '38.97',
        tax: '3.12',
        total: '42.09',
        estimatedTime: '15-20 minutes',
        specialInstructions: 'Extra napkins please',
        status: 'confirmed',
        paymentInfo: {
          message: "Order Placed Make Payment",
          payment_link: "https://api.ipospays.tech/v1/sl/HBCQG_150325072319"
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
export const updateOrderStatus = async (id: string, status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled'): Promise<OrderDetails> => {
  try {
    const response = await axios.patch(`${API_URL}/orders/${id}`, { status });
    
    // Process the response
    const data = response.data as any;
    
    return {
      orderId: data.id,
      orderDate: new Date(data.created_at).toISOString().split('T')[0],
      orderTime: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      orderMethod: data.order_type,
      deliveryAddress: data.delivery_address,
      items: data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
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
            name: 'Margherita Pizza',
            price: '14.99',
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          },
          {
            id: '2',
            name: 'Caesar Salad',
            price: '8.99',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          }
        ],
        subtotal: '38.97',
        tax: '3.12',
        total: '42.09',
        estimatedTime: '15-20 minutes',
        specialInstructions: 'Extra napkins please',
        status,
        paymentInfo: {
          message: "Order Placed Make Payment",
          payment_link: "https://api.ipospays.tech/v1/sl/HBCQG_150325072319"
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
    const response = await axios.get(`${API_URL}/orders/user/${userId}`);
    
    // Process the response
    return (response.data as any[]).map(data => ({
      orderId: data.id,
      orderDate: new Date(data.created_at).toISOString().split('T')[0],
      orderTime: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      orderMethod: data.order_type,
      deliveryAddress: data.delivery_address,
      items: data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
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
              name: 'Margherita Pizza',
              price: '14.99',
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
            },
            {
              id: '2',
              name: 'Caesar Salad',
              price: '8.99',
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
            }
          ],
          subtotal: '38.97',
          tax: '3.12',
          deliveryFee: '5.00',
          total: '47.09',
          estimatedTime: '30-45 minutes',
          specialInstructions: 'Extra napkins please',
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
              name: 'Pepperoni Pizza',
              price: '16.99',
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
            }
          ],
          subtotal: '16.99',
          tax: '1.36',
          total: '18.35',
          estimatedTime: 'Ready in 15 minutes',
          status: 'confirmed',
          paymentInfo: {
            message: "Order Placed Make Payment",
            payment_link: "https://api.ipospays.tech/v1/sl/HBCQG_150325072319"
          }
        }
      ];
    }
    
    throw error;
  }
};
