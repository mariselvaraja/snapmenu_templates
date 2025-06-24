import React, { useEffect, useState } from 'react';
import { DollarSign, ArrowRightLeft, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export default function PaymentStatusCheck() {
  const [searchParams] = useSearchParams();
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    // Get transaction_id from query parameters
    const txnId = searchParams.get('transaction_id') || searchParams.get('txn_id') || searchParams.get('transactionId');
    setTransactionId(txnId);
  }, [searchParams]);

  useEffect(() => {
    if (transactionId) {
      const payload = {
        transaction_id: transactionId,
      };

      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'PAYMENT_STATUS_CHECK',
            payload,
          },
          '*' // Ideally use your domain here for security
        );

        // Optional: close the popup after sending the message
        window.close();
      }
    }
  }, [transactionId]);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="text-center relative"
      >
        {/* Professional Dollar Sign Design */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
          className="w-24 h-24 mx-auto mb-8 relative"
        >
          {/* Outer ring with gradient border */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-1"
            animate={{
              rotate: [0, 360]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full bg-white shadow-inner" />
          </motion.div>

          {/* Inner dollar sign area */}
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg border border-slate-200 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Dollar Sign */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 200 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <DollarSign className="h-12 w-12 text-green-600 font-bold stroke-2" />
              </motion.div>
            </motion.div>

            {/* Animated sparkle effects around dollar sign */}
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute w-1 h-1 bg-green-400 rounded-full"
                style={{
                  left: `${40 + Math.cos((index * 60) * Math.PI / 180) * 25}%`,
                  top: `${40 + Math.sin((index * 60) * Math.PI / 180) * 25}%`
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          {/* Pulsing rings for loading effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-400"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.2, 0.6]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div
            className="absolute inset-0 rounded-full border border-emerald-300"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.1, 0.4]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />

          {/* Subtle glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-green-400 opacity-20 blur-md"
            animate={{
              scale: [0.8, 1.1, 0.8],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Status Message with staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Checking Payment Status
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-gray-600 mb-6"
          >
            Please wait while we check your payment status...
          </motion.p>

          {/* Transaction ID Display */}
          {transactionId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="bg-gray-50 rounded-lg px-4 py-2 mb-4 border border-gray-200"
            >
              <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
              <p className="text-sm font-mono text-gray-700 break-all">{transactionId}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Animated loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-2 mb-6"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Progress bar animation */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "300px" }}
          transition={{ delay: 1, duration: 0.8 }}
          className="bg-gray-200 rounded-full h-1 mb-6 overflow-hidden mx-auto"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Additional Info with fade-in */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-xs text-gray-500"
        >
          Please do not close this window while we process your payment.
        </motion.p>

        {/* Floating particles effect */}
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-30"
            style={{
              left: `${-50 + index * 20}px`,
              top: `${-30 + (index % 2) * 60}px`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + index * 0.5,
              repeat: Infinity,
              delay: index * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
