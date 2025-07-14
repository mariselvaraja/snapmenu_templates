import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderTypePopupProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryRedirectUrl?: string;
}

export default function OrderTypePopup({ isOpen, onClose, deliveryRedirectUrl = "https://ctbiryani.square.site/" }: OrderTypePopupProps) {
  const navigate = useNavigate();

  const handleTakeOut = () => {
    navigate('/menu');
    onClose();
  };

  const handleDelivery = () => {
    window.open(deliveryRedirectUrl, '_blank');
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
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Choose Order Type</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-red-100 mt-1">How would you like to receive your order?</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Take Out</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Order online and pick up at our restaurant. Quick and convenient!
                      </p>
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Get your food delivered right to your door. Fast and reliable service!
                      </p>
                      <div className="flex items-center justify-center text-red-600 text-sm font-medium">
                        <span>Order for Delivery</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4">
              <p className="text-center text-sm text-gray-500">
                Need help? <a href="/contact" className="text-red-500 hover:text-red-600 font-medium">Contact us</a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
