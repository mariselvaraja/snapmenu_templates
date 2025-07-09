import React from 'react';
import { IoClose } from 'react-icons/io5';

interface VerifyingPaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerifyingPaymentPopup: React.FC<VerifyingPaymentPopupProps> = ({ isOpen, onClose }) => { 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 p-4 md:p-4">
      <div className="bg-white w-full h-full md:w-full md:max-w-md md:h-auto md:rounded-lg relative border-0 md:border md:border-gray-200 shadow-lg md:mx-4">

        {/* Content */}
        <div className="p-8 text-center flex flex-col justify-center h-full md:h-auto">
          {/* Loading spinner */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin">
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Verifying Payment Status
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-6">
            Please wait while we verify your payment. This may take a few moments.
          </p>
          
          {/* Additional info */}
          <div className="text-sm text-gray-500">
            <p>Do not close this window or refresh the page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyingPaymentPopup;
