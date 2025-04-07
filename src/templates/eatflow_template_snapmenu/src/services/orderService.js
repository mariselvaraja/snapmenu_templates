import axios from 'axios';

// Base URL for the API
const API_URL = 'https://appliance.genaiembed.ai/p5093';

/**
 * Create a new order
 * @param {Object} orderData The order details
 * @returns {Promise<Object>} The created order with confirmation details
 */
export const createOrder = async (orderData) => {
  try {
    // Format the data for the API
    const payload = {
      restaurant_id: sessionStorage.getItem("rid"), // Get from session storage or use default
      name: orderData.customerName,
      phone: orderData.customerPhone,
      email: orderData.customerEmail || null,
      special_requests: orderData.specialInstructions || null,
      order_type: 'manual',
      ordered_items: orderData.items.map(item => {
        // Ensure price is a number and convert to string with 2 decimal places
        const itemPrice = typeof item.price === 'number' 
          ? item.price.toFixed(2) 
          : parseFloat(item.price.toString().replace(/[^\d.-]/g, '')).toFixed(2);
          
        // Calculate total item price
        const totalItemPrice = (parseFloat(itemPrice) * item.quantity).toFixed(2);
          
        return {
          name: item.name,
          quantity: item.quantity,
          itemPrice: itemPrice,
          modifiers: [],
          total_item_price: totalItemPrice
        };
      }),
      grand_total: typeof orderData.total === 'number' 
        ? orderData.total.toFixed(2) 
        : parseFloat(orderData.total.toString().replace(/[^\d.-]/g, '')).toFixed(2)
    };

    // Make the API call
    const response = await axios.post(`${API_URL}/snapMenu/restaurant/placeOrder`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Process the response
    const result = {
      orderId: response.data.id || Math.random().toString(36).substring(2, 15),
      orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
      orderTime: orderData.orderTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
      const mockOrderData = {
        orderId: Math.random().toString(36).substring(2, 15),
        orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
        orderTime: orderData.orderTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
          payment_link: "https://api.ipospays.tech/v1/sl/zMGDU_150325065657"
        }
      };
      return mockOrderData;
    }
    
    throw error;
  }
};

/**
 * Get an order by ID
 * @param {string} id The order ID
 * @returns {Promise<Object>} The order details
 */
export const getOrder = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    
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
            name: 'Grilled Salmon',
            price: '24.99',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          },
          {
            id: '2',
            name: 'Caesar Salad',
            price: '12.99',
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          }
        ],
        subtotal: '50.97',
        tax: '4.08',
        total: '55.05',
        estimatedTime: '30-45 minutes',
        specialInstructions: 'Extra lemon for the salmon please',
        status: 'confirmed',
        // Add mock payment info for testing
        paymentInfo: {
          message: "Order Placed Make Payment",
          payment_link: "https://api.ipospays.tech/v1/sl/zMGDU_150325065657"
        }
      };
    }
    
    throw error;
  }
};

/**
 * Update an order's status
 * @param {string} id The order ID
 * @param {string} status The new status
 * @returns {Promise<Object>} The updated order
 */
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/orders/${id}`, { status });
    
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
            name: 'Grilled Salmon',
            price: '24.99',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          },
          {
            id: '2',
            name: 'Caesar Salad',
            price: '12.99',
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
          }
        ],
        subtotal: '50.97',
        tax: '4.08',
        total: '55.05',
        estimatedTime: '30-45 minutes',
        specialInstructions: 'Extra lemon for the salmon please',
        status
      };
    }
    
    throw error;
  }
};

/**
 * Get order history for a user
 * @returns {Promise<Array>} Array of order details
 */
export const getOrderHistory = async () => {
  try {
    const userId = 28; // Hardcoded user ID for demo purposes
    const response = await axios.get(`${API_URL}/orders/user/${userId}`);
    
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
              name: 'Grilled Salmon',
              price: '24.99',
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
            },
            {
              id: '2',
              name: 'Caesar Salad',
              price: '12.99',
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
            }
          ],
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
              price: '32.99',
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
            }
          ],
          subtotal: '32.99',
          tax: '2.64',
          total: '35.63',
          estimatedTime: 'Ready in 20 minutes',
          status: 'confirmed'
        }
      ];
    }
    
    throw error;
  }
};
