import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';



const OrdersBottomBar: React.FC<any> = ({ onViewOrders, orders, historyLoading, historyError }) => {
  // Calculate total price across all orders
  const totalOrderPrice = orders.reduce((total: number, order: any) => {
    return total + (order.total || 0);
  }, 0);

  // Calculate total number of items across all orders
  const totalItemLength = orders.reduce((total: number, order: any) => {
    return total + (order.items?.length || 0);
  }, 0);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between space-x-3">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              {/* <span className="text-sm text-gray-600">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span> */}
              {historyLoading && (
                <span className="text-xs text-blue-500">Loading...</span>
              )}
              {historyError && (
                <span className="text-xs text-red-500">Error loading orders</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm font-semibold">
              <span>${totalOrderPrice.toFixed(2)}</span>
              <span>|</span>
              <span>{totalItemLength} Item(s)</span>
            </div>
          </div>
          {/* View Orders Button */}
          <button
            onClick={onViewOrders}
            className="flex text-lg items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 transition-colors cursor-pointer"
          >
            View Orders
            <ChevronRight className="h-4 w-4" />
          </button>

        </div>
      </div>
    </motion.div>
  );
};

export default OrdersBottomBar;
