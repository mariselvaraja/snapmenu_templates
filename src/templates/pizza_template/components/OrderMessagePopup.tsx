import React from 'react';
import { MdCheckCircle, MdError, MdInfo } from "react-icons/md";

interface OrderMessagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  messageType?: 'info' | 'success' | 'error';
}

const OrderMessagePopup: React.FC<OrderMessagePopupProps> = ({ isOpen, onClose, message, messageType = 'info' }) => { 
  if (!isOpen) return null;

  const getIcon = () => {
    switch (messageType) {
      case 'success':
        return <MdCheckCircle className="h-16 w-16 mx-auto text-green-500" />;
      case 'error':
        return <MdError className="h-16 w-16 mx-auto text-red-500" />;
      default:
        return <MdInfo className="h-16 w-16 mx-auto text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (messageType) {
      case 'success':
        return 'Order Status';
      case 'error':
        return 'Order Error';
      default:
        return 'Order Information';
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 p-4 md:p-4">
      <div className="bg-white w-full h-full md:w-full md:max-w-md md:h-auto md:rounded-lg relative border-0 md:border md:border-gray-200 shadow-lg md:mx-4">
        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl transition-colors z-20"
        >
          &times;
        </button>

        <div className="p-6 flex flex-col justify-center h-full md:h-auto">
          <div className="text-center">
            <div className="mb-4">
              {getIcon()}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{getTitle()}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {message}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderMessagePopup;
