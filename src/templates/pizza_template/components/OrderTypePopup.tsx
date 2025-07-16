import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Truck, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderTypePopupProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryRedirectUrl?: string;
  customerCareNumber?: string | null;
}

export default function OrderTypePopup({ isOpen, onClose, deliveryRedirectUrl = "https://ctbiryani.square.site/", customerCareNumber }: OrderTypePopupProps) {
  const navigate = useNavigate();

  const handleTakeOut = () => {
    navigate('/menu');
    onClose();
  };

  const handleDelivery = () => {
    window.open(deliveryRedirectUrl, '_blank');
    onClose();
  };

  const handleCallOrder = () => {
    if (customerCareNumber) {
      window.location.href = `tel:${customerCareNumber}`;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Popup Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              duration: 0.15,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Content */}
            <div className="p-4 sm:p-6">
              <div className={`grid gap-4 ${customerCareNumber ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {/* Take Out Card */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTakeOut}
                  className="group relative bg-white border-2 border-red-500 rounded-xl p-4 text-center hover:border-red-600 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Out</h3>
                      <div className="flex items-center justify-center text-red-600 text-sm font-medium">
                        <span>Browse Menu</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.button>

                {/* Delivery Card */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelivery}
                  className="group relative bg-white border-2 border-red-500 rounded-xl p-4 text-center hover:border-red-600 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery</h3>
                      <div className="flex items-center justify-center text-red-600 text-sm font-medium">
                        <span>Order for Delivery</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.button>

                {/* Call & Order Card */}
                {customerCareNumber && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCallOrder}
                    className="group relative bg-white border-2 border-red-500 rounded-xl p-4 text-center hover:border-red-600 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Call & Order</h3>
                        <div className="flex items-center justify-center text-red-600 text-sm font-medium">
                          <span>{customerCareNumber}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )}
              </div>
            </div>
            
            {/* Fixed Bottom Close Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button
                onClick={onClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-lg font-medium transition-colors touch-manipulation"
              >
                Close
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
