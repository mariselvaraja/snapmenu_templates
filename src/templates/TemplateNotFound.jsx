import React, { useEffect, useState } from 'react';

/**
 * TemplateNotFound component
 * Displays an elegant error message with animations when a template cannot be found
 */
const TemplateNotFound = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Trigger the fade-in animation after component mounts
    setVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-gray-50 to-blue-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-100 rounded-full opacity-20 animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-1/4 -right-20 w-60 h-60 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-yellow-100 rounded-full opacity-20 animate-pulse" style={{ animationDuration: '7s' }}></div>
      </div>
      
      {/* Main content card with fade-in animation */}
      <div 
        className={`text-center p-10 bg-white rounded-xl shadow-2xl max-w-md mx-4 border border-gray-100 transition-all duration-700 ease-in-out transform ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Error icon with pulse animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-red-50 animate-pulse"></div>
          </div>
          <svg 
            className="relative mx-auto h-14 w-14 text-red-500 animate-bounce" 
            style={{ animationDuration: '2s' }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        {/* Title with slide-in animation */}
        <h2 
          className={`text-3xl font-bold text-gray-900 mb-3 transition-all duration-1000 delay-300 ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          Website Not Found
        </h2>
        
        {/* Animated divider */}
        <div 
          className={`h-1 w-24 bg-gradient-to-r from-red-400 to-red-600 mx-auto mb-6 rounded-full transition-all duration-1000 delay-500 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
        ></div>
        
        {/* Message with fade-in animation */}
        <p 
          className={`text-gray-600 mb-8 transition-all duration-1000 delay-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          The requested website could not be loaded. Please contact Snapmenu admin for assistance.
        </p>
      </div>
    </div>
  );
};

export default TemplateNotFound;
