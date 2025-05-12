import { supabase } from '../lib/supabase';
import axios from 'axios';

// Base URL for the API
const API_URL = 'https://appliance.genaiembed.ai/p5093';

function formatPhoneNumber(phone) {
  return phone.replace(/\D/g, ''); // Remove all non-numeric characters
}

export const orderService = {
  async createOrder(orderData) {
    try {
      // Format the data for the API
      const payload = {
        restaurant_id: sessionStorage.getItem("rid"), // Get from session storage or use default
        name: orderData.customerName,
        phone: formatPhoneNumber(orderData.customerPhone),
        email: orderData.customerEmail || null,
        special_requests: orderData.notes || '',
        order_type: 'manual',
        ordered_items: orderData.items.map(item => {
          // Ensure price is a number and convert to string with 2 decimal places
          const itemPrice = typeof item.price === 'number' 
            ? item.price?.toFixed(2) 
            : parseFloat(item.price.toString().replace(/[^\d.-]/g, ''))?.toFixed(2);
          
          // Calculate total item price
          const totalItemPrice = (parseFloat(itemPrice) * item.quantity)?.toFixed(2);
          
          // Handle modifiers if they exist
          const modifiers = item.customizations ? item.customizations.map(mod => ({
            modifier_name: mod.name,
            modifier_price: typeof mod.price === 'number' 
              ? mod.price?.toFixed(2) 
              : parseFloat(mod.price.toString().replace(/[^\d.-]/g, ''))?.toFixed(2)
          })) : [];
          
          // Calculate total modifier price
          const modifierPrice = modifiers.reduce((total, mod) => 
            total + parseFloat(mod.modifier_price), 0)?.toFixed(2);
          
          return {
            name: item.name,
            quantity: item.quantity,
            itemPrice: itemPrice,
            modifiers: modifiers,
            modifier_price: modifiers.length > 0 ? modifierPrice : null,
            total_item_price: totalItemPrice
          };
        }),
        grand_total: typeof orderData.totalAmount === 'number' 
          ? orderData.totalAmount?.toFixed(2) 
          : parseFloat(orderData.totalAmount.toString().replace(/[^\d.-]/g, ''))?.toFixed(2)
      };

      // Make the API call
      const response = await axios.post(`${API_URL}/snapMenu/restaurant/placeOrder`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Process the response
      const orderWithItems = {
        id: response.data?.id || Math.random().toString(36).substring(2, 15),
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        order_type: orderData.orderType,
        status: 'confirmed',
        pickup_time: orderData.pickupTime,
        total_amount: orderData.totalAmount,
        payment_method: orderData.paymentMethod,
        device_type: orderData.deviceType,
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString(),
        notes: orderData.notes,
        items: orderData.items.map(item => ({
          order_id: response.data?.id || Math.random().toString(36).substring(2, 15),
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          customizations: item.customizations || null
        }))
      };

      // Check if payment information is included in the response
      if (response.data.message && response.data.payment_link) {
        orderWithItems.paymentInfo = {
          message: response.data.message,
          payment_link: response.data.payment_link
        };
      }

      return { order: orderWithItems, items: orderWithItems.items };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrder(orderId) {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select(`
          *,
          items:order_items(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async getOrdersByCustomer(email) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('customer_email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  async getOrdersByStatus(status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw error;
    }
  },

  async getOrders({
    page = 1,
    limit = 20,
    status = null,
    startDate = null,
    endDate = null,
    searchTerm = null
  }) {
    try {
      let query = supabase
        .from('orders')
        .select('*, items:order_items(*)', { count: 'exact' });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (startDate) {
        const startDateTime = new Date(startDate);
        startDateTime.setHours(0, 0, 0, 0);
        query = query.gte('created_at', startDateTime.toISOString());
      }

      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endDateTime.toISOString());
      }

      if (searchTerm) {
        query = query.or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,customer_phone.ilike.%${searchTerm}%`);
      }

      // Add sorting
      query = query.order('created_at', { ascending: false });

      // Add pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }

      if (!data) {
        console.log('No orders found');
        return {
          orders: [],
          total: 0,
          currentPage: page,
          totalPages: 0
        };
      }

      console.log(`Found ${data.length} orders`);
      return {
        orders: data,
        total: count || 0,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  }
};
