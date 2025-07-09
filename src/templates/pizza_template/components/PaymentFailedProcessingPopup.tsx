import React from 'react';
import { IoClose } from 'react-icons/io5';
import { MdError } from 'react-icons/md';

interface PaymentFailedProcessingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onTryAgain: () => void;
}

const PaymentFailedProcessingPopup: React.FC<PaymentFailedProcessingPopupProps> = ({ isOpen, onClose, onTryAgain }) => { 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 p-4 md:p-4">
      <div className="bg-white w-full h-full md:w-full md:max-w-md md:h-auto md:rounded-lg relative border-0 md:border md:border-gray-200 shadow-lg md:mx-4">
        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl transition-colors z-20"
        >
          <IoClose size={24} />
        </button>

        {/* Content */}
        <div className="p-8 text-center flex flex-col justify-center h-full md:h-auto">
          {/* Error icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <MdError className="text-red-500 text-3xl" />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Failed
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-6">
            Your payment could not be processed. Please check your payment details and try again.
          </p>
          
          {/* Try Again Button */}
          <div className="flex justify-center">
            <button
              onClick={onTryAgain}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedProcessingPopup;
