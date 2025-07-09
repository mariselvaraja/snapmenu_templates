/**
 * Party Orders Page Component
 * Displays all available party orders using the PartyOrdersSection component
 */

import React from 'react';
import PartyOrdersSection from '../components/PartyOrdersSection';
import { useAppSelector } from '../../../common/redux';

const PartyOrders: React.FC = () => {
  const { items: menuItems, loading, error } = useAppSelector(state => state.menu);
  
  // Filter menu items that have party_orders data
  const partyOrders = menuItems?.filter(item => item.party_orders?.length && item.party_orders.length > 0) || [];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header spacing for fixed navbar */}
      <div className="pt-20">
        {/* Party Orders Section - Only show if there are party orders */}
        {(partyOrders?.length > 0) || loading ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <PartyOrdersSection 
              partyOrders={partyOrders}
              loading={loading}
              error={error}
              showTitle={true} // Show title
              className="party-orders-page"
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <p className="text-lg text-gray-600">
              No party orders available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyOrders;
