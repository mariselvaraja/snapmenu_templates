import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderConfirmation from '../components/OrderConfirmation';
import { getOrder } from '../services/orderService';

export function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have order details in location state (passed from checkout)
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
      setLoading(false);
    } else {
      // Try to get the order ID from URL params or use a mock ID for demo
      const searchParams = new URLSearchParams(location.search);
      const orderId = searchParams.get('id') || 'demo123';
      
      // Fetch order details
      const fetchOrderDetails = async () => {
        try {
          setLoading(true);
          const details = await getOrder(orderId);
          setOrderDetails(details);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching order details:', err);
          setError('Failed to load order details. Please try again.');
          setLoading(false);
          
          // For demo purposes, use mock data if API fails
          if (process.env.NODE_ENV !== 'production') {
            setOrderDetails({
              orderId: 'demo123',
              orderDate: new Date().toISOString().split('T')[0],
              orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              customerName: 'John Doe',
              customerEmail: 'john.doe@example.com',
              customerPhone: '(555) 123-4567',
              orderMethod: 'takeout',
              items: [
                {
                  id: '1',
                  name: 'Classic Caesar Salad',
                  price: '16.00',
                  quantity: 1,
                  image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
                }
              ],
              subtotal: '16.00',
              tax: '1.28',
              total: '17.28',
              estimatedTime: '15-20 minutes',
              specialInstructions: ''
            });
            setLoading(false);
          }
        }
      };
      
      fetchOrderDetails();
    }
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading order details...</p>
        </div>
      </div>
    );
  }

  return <OrderConfirmation orderDetails={orderDetails} />;
}
