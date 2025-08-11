import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerProps {
  message?: string;
  type?: 'info' | 'warning' | 'success' | 'promotional';
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Banner: React.FC<BannerProps> = ({ 
  message = "Welcome! Enjoy 10% off on all orders today!",
  type = 'promotional',
  dismissible = true,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const getBannerStyles = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'promotional':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'info':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'success':
        return 'text-green-600';
      case 'promotional':
      default:
        return 'text-amber-600';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`relative ${getBannerStyles()} border-b`}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center flex-1">
                <Info className={`h-5 w-5 ${getIconColor()} mr-3 flex-shrink-0`} />
                <p className="text-sm font-medium">{message}</p>
              </div>
              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className="ml-3 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Banner;
