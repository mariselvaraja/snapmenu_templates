import React from 'react';
import { Navigation } from './Navigation';
import { Check, ShoppingBag, Clock, MapPin, Phone, ArrowRight, Truck, Home, User, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../../../common/context/SiteContentContext';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
  selectedModifiers?: {
    name: string;
    options: {
      name: string;
      price: number;
    }[];
  }[];
}

interface OrderConfirmationProps {
  orderDetails: {
    orderId: string;
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
    estimatedTime: string;
    specialInstructions?: string;
  };
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderDetails }) => {
  const siteContent = useSiteContent();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[40vh]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            alt="Order confirmation background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
        </div>
        
        <Navigation />

        <div className="relative z-10 container mx-auto px-6 h-[calc(40vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <div className="bg-green-500 rounded-full p-4">
                <Check className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Your order has been successfully placed
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Details Section */}
      <section className="py-16 px-6 bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-800 rounded-2xl p-8 md:p-12 shadow-xl border border-zinc-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">Thank You for Your Order!</h2>
              <p className="text-gray-300 text-lg">
                A confirmation has been sent to your email. Please save this information for your records.
              </p>
            </div>

            {/* Order Summary */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Order Summary</h3>
                <span className="text-yellow-400 font-semibold">Order #{orderDetails.orderId}</span>
              </div>
              
              <div className="bg-zinc-700 rounded-xl p-6 mb-6">
                <div className="flex items-start mb-4">
                  <Clock className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">Estimated {orderDetails.orderMethod === 'takeout' ? 'Pickup' : 'Delivery'} Time</h4>
                    <p className="text-gray-300">{orderDetails.estimatedTime}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  {orderDetails.orderMethod === 'takeout' ? (
                    <ShoppingBag className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                  ) : (
                    <Truck className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {orderDetails.orderMethod === 'takeout' ? 'Pickup' : 'Delivery'} Details
                    </h4>
                    <p className="text-gray-300">
                      {formatDate(orderDetails.orderDate)} at {orderDetails.orderTime}
                    </p>
                    {orderDetails.orderMethod === 'delivery' && orderDetails.deliveryAddress && (
                      <p className="text-gray-300 mt-1">
                        Delivering to: {orderDetails.deliveryAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="border border-zinc-700 rounded-xl overflow-hidden mb-6">
                <div className="bg-zinc-700 p-4">
                  <h4 className="font-semibold text-white">Order Items</h4>
                </div>
                <div className="p-4">
                  {orderDetails.items.length > 0 ? (
                    orderDetails.items.map((item) => (
                    <div key={item.id} className="py-3 border-b border-zinc-700 last:border-b-0">
                      <div className="flex items-center">
                        <div className="w-16 h-16 mr-4">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-grow">
                          <h5 className="font-semibold text-white">{item.name}</h5>
                          <p className="text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 font-semibold">
                            ${(() => {
                              let totalItemPrice = parseFloat(item.price);
                              
                              if (item.selectedModifiers && item.selectedModifiers.length > 0) {
                                item.selectedModifiers.forEach(modifier => {
                                  modifier.options.forEach(option => {
                                    totalItemPrice += option.price;
                                  });
                                });
                              }
                              
                              return (totalItemPrice * item.quantity)?.toFixed(2);
                            })()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Display selected modifiers */}
                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <div className="mt-1 ml-20">
                          {item.selectedModifiers.flatMap(modifier => 
                            modifier.options.map((option, index) => (
                              <div 
                                key={`${modifier.name}-${option.name}-${index}`}
                                className="flex justify-between text-xs text-gray-400"
                              >
                                <span>{option.name || modifier.name}</span>
                                {option.price > 0 && (
                                  <span>+${(option.price * item.quantity)?.toFixed(2)}</span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    ))
                  ) : (
                    <div className="py-3 text-center text-gray-400">
                      No items in this order
                    </div>
                  )}
                </div>
              </div>
              
              {/* Order Totals */}
              <div className="bg-zinc-700 rounded-xl p-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white">${orderDetails.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tax:</span>
                    <span className="text-white">${orderDetails.tax}</span>
                  </div>
                  {orderDetails.orderMethod === 'delivery' && orderDetails.deliveryFee && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Delivery Fee:</span>
                      <span className="text-white">${orderDetails.deliveryFee}</span>
                    </div>
                  )}
                  <div className="border-t border-zinc-600 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-yellow-400">${orderDetails.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                  <User className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">Name</h4>
                      <p className="text-gray-300">{orderDetails.customerName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">Email</h4>
                      <p className="text-gray-300">{orderDetails.customerEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">Phone</h4>
                      <p className="text-gray-300">{orderDetails.customerPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Restaurant Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">Location</h4>
                      <p className="text-gray-300">
                        {siteContent.reservation?.info?.location?.street || '123 Restaurant St'}<br />
                        {siteContent.reservation?.info?.location?.city || 'City'}, {siteContent.reservation?.info?.location?.state || 'State'} {siteContent.reservation?.info?.location?.zip || '12345'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">Contact</h4>
                      <p className="text-gray-300">{siteContent.reservation?.info?.contact?.phone || '(555) 123-4567'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {orderDetails.specialInstructions && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Special Instructions</h3>
                <div className="bg-zinc-700 p-4 rounded-xl">
                  <p className="text-gray-300">{orderDetails.specialInstructions}</p>
                </div>
              </div>
            )}

            <div className="border-t border-zinc-700 pt-8 mt-8">
              <div className="text-center space-y-4">
                <p className="text-gray-300">
                  Questions about your order? Please contact us at {siteContent.reservation?.info?.contact?.phone || '(555) 123-4567'}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Link to="/menu" className="bg-yellow-400 text-black py-3 px-6 rounded-full hover:bg-yellow-300 transition text-lg font-medium flex items-center justify-center">
                    Order Again
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  
                  <Link to="/" className="bg-zinc-700 text-white py-3 px-6 rounded-full hover:bg-zinc-600 transition text-lg font-medium flex items-center justify-center">
                    Return to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  
    </div>
  );
};

export default OrderConfirmation;
