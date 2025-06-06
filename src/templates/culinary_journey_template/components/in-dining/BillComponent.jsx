import React from 'react';
import { motion } from 'framer-motion';
import { X, Printer, CreditCard, DollarSign, Receipt } from 'lucide-react';

const BillComponent = ({ onClose, order, tableNumber }) => {
  // Calculate subtotal
  const subtotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Calculate tax (10%)
  const tax = subtotal * 0.1;
  
  // Calculate total
  const total = subtotal + tax;
  
  // Format date
  const formattedDate = new Date(order.date).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Bill</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        {/* Bill Content */}
        <div className="p-6">
          {/* Restaurant Info */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold">Culinary Journey Restaurant</h3>
            <p className="text-sm text-gray-500">123 Main Street, City</p>
            <p className="text-sm text-gray-500">Tel: (123) 456-7890</p>
          </div>
          
          {/* Order Info */}
          <div className="flex justify-between text-sm mb-6">
            <div>
              <p><span className="font-medium">Order #:</span> {order.id}</p>
              <p><span className="font-medium">Table:</span> {tableNumber || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p><span className="font-medium">Date:</span> {formattedDate}</p>
              <p><span className="font-medium">Status:</span> {order.status}</p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-dashed border-gray-300 my-4"></div>
          
          {/* Order Items */}
          <div className="space-y-3 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <span className="font-medium">{item.quantity}x </span>
                  {item.name}
                </div>
                <div className="font-medium">${(item.price * item.quantity)?.toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          {/* Divider */}
          <div className="border-t border-dashed border-gray-300 my-4"></div>
          
          {/* Totals */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total?.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Payment Options */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-orange-600 text-white rounded-lg flex items-center justify-center font-medium hover:bg-orange-700 transition-colors">
              <CreditCard className="h-5 w-5 mr-2" />
              Make Payment
            </button>
          </div>
          
          {/* Make Payment Note */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Make Payment</p>
            <p>We hope to see you again soon.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BillComponent;
