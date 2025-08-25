import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../common/store';

interface OrdersBottomBarProps {
  onViewOrders: () => void;
}

const OrdersBottomBar: React.FC<OrdersBottomBarProps> = ({ onViewOrders }) => {
  // Get raw orders from Redux state - orderListener handles WebSocket updates
  const { orders: rawOrders, loading: historyLoading, error: historyError } = useSelector((state: RootState) => state.orderHistory);
  
  // Transform orderHistory to match the same logic as InDiningOrders component
  const orders = rawOrders ? rawOrders.map((orderData: any) => {
    const order = orderData as any;
    
    // Check if the order has ordered_items (from the sample data structure)
    const items = order.ordered_items 
      ? order.ordered_items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          status: item.status,
          price: item.itemPrice || 0,
          image: item.image || '',
          modifiers: item.modifiers || [],
          spiceLevel: item.spiceLevel || null
        }))
      : order.items || []; // Fallback to order.items if ordered_items doesn't exist
    
    return {
      id: order.id || (order.dining_id ? order.dining_id.toString() : '') || '',
      date: order.createdAt || order.created_date || new Date().toISOString(),
      status: order?.status?.toLowerCase() === "processing" ? "Preparing" : order?.status || "Pending",
      total: order.totalAmount || (order.total_amount ? parseFloat(order.total_amount) : 0) || 0,
      items: items,
      void_reason: order?.void_reason || ''
    };
  }) : [];
  
  // Filter out voided orders for price calculation only
  const activeOrders = orders.filter((order: any) => order.status?.toLowerCase() !== 'void');
  
  // Calculate total price across active (non-voided) orders only
  const totalOrderPrice = activeOrders.reduce((total: number, order: any) => {
    return total + (order.total || 0);
  }, 0);

  // Calculate item count (same logic as InDiningOrders - count number of items, not quantities)
  const itemCount = orders.reduce((total: number, order: any) => {
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
              {/* {historyLoading && (
                <span className="text-xs text-blue-500">Loading...</span>
              )} */}
              {historyError && (
                <span className="text-xs text-red-500">Error loading orders</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm font-semibold">
              {totalOrderPrice > 0 && (
                <>
                  <span>${totalOrderPrice.toFixed(2)}</span>
                  <span>|</span>
                </>
              )}
              <span>{itemCount} Item(s)</span>
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
