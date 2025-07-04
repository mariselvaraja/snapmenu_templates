/**
 * Party Orders Section Component
 * A plug-and-play component for displaying party orders with popup functionality
 * Shows only enabled party orders, no cart functionality - display only
 */

import React, { useState } from 'react';
import { useAppSelector } from '../../../common/redux';

interface PartyOrdersSectionProps {
  className?: string;
  title?: string;
  showTitle?: boolean;
  partyOrders?: any[];
  loading?: boolean;
  error?: string | null;
}

const PartyOrdersSection: React.FC<PartyOrdersSectionProps> = ({
  className = '',
  title = 'Party Orders',
  showTitle = true,
  partyOrders = [],
  loading = false,
  error = null,
}) => {
  const [selectedPartyOrder, setSelectedPartyOrder] = useState<any>(null);
  const [isPartyDetailModalOpen, setIsPartyDetailModalOpen] = useState(false);

  // Get restaurant info from Redux store
  const restaurantInfo = useAppSelector(state => state.restaurant?.info);

  // Filter only enabled party orders
  const enabledPartyOrders = partyOrders?.filter(party => party?.is_enabled) || [];

  // Don't render if no party orders
  if (!loading && enabledPartyOrders.length === 0) {
    return null;
  }

  return (
    <div className={`party-orders-section ${className}`}>
      {/* Title */}
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">Perfect for celebrations and gatherings</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">Error loading party orders</div>
          <p className="text-gray-600">{error}</p>
        </div>
      )}

      {/* Party Orders Grid */}
      {!loading && !error && enabledPartyOrders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enabledPartyOrders.map((party, index) => (
            <div
              key={party.party_id || index}
              className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => {
                setSelectedPartyOrder(party);
                setIsPartyDetailModalOpen(true);
              }}
            >
              <div className="relative">
                {party.image ? (
                  <img
                    src={party.image}
                    alt={party.title}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <span className="text-6xl font-bold text-red-500">
                      {party.title?.charAt(0)?.toUpperCase() || 'P'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 mr-2">
                    {party?.title || 'Untitled Party'}
                  </h3>
                  <span className="text-xl font-bold text-red-500 whitespace-nowrap">
                    ${party?.price || '0'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {party?.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <span className="mr-1">👥</span>
                    <span className="font-medium">{party?.no_of_serving || 0} servings</span>
                  </div>
                  {/* <div className="flex items-center text-gray-500">
                    <span className="mr-1">📦</span>
                    <span className="font-medium">{party?.products?.length || 0} items</span>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Party Orders Detail Modal */}
      {isPartyDetailModalOpen && selectedPartyOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">{selectedPartyOrder?.title || 'Party Order'}</h2>
              <button
                onClick={() => {
                  setIsPartyDetailModalOpen(false);
                  setSelectedPartyOrder(null);
                }}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="w-full">
                {/* Details Section */}
                <div className="flex flex-col">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {selectedPartyOrder?.description || 'No description available'}
                  </p>

                  {/* Products List */}
                  {selectedPartyOrder?.products?.length > 0 && (
                    <div className="flex-1">
                      <div className="space-y-4 mb-6">
                        {selectedPartyOrder?.products?.map((product: any, idx: number) => (
                          <div key={idx} className="flex items-end gap-4">
                            {/* Product Card */}
                            <div className="bg-white border rounded-lg p-6 shadow-sm flex-1 max-w-md min-h-[120px]">
                              <div className="flex gap-4 items-center h-full">
                                {/* Left Section - Product Image */}
                                <div className="flex-shrink-0">
                                  {product?.image ? (
                                    <img
                                      src={product.image}
                                      alt={product?.name || 'Product'}
                                      className="w-20 h-20 object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center rounded-lg">
                                      <span className="text-xl font-bold text-red-500">
                                        {product?.name?.charAt(0)?.toUpperCase() || 'P'}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Right Section - Product Content */}
                                <div className="flex-1 flex flex-col justify-center">
                                  {/* Product Title - One Line */}
                                  <h5 className="font-bold text-gray-900 mb-2 line-clamp-1">
                                    {product?.name || 'Unnamed Product'}
                                  </h5>

                                  {/* Product Description - One Line */}
                                  {product?.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                      {product.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Serving Count - Outside Card, Bottom Aligned */}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total Price - Bottom Left with Serving Count */}
                  <div className="flex justify-between items-center mt-auto pt-4 border-t">
                    <div className="flex-shrink-0">
                      <span className="text-2xl font-bold text-red-500">{selectedPartyOrder?.no_of_serving || 0} servings</span>
                    </div>
                    <span className="text-2xl font-bold text-red-500">
                      Total: ${selectedPartyOrder?.price || '0'}
                    </span>
                  </div>

                  {/* Call to Place Your Order */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <h6 className="font-bold text-gray-900 mb-2">📞 Call to Place Your Order</h6>
                      <a
                        href={`tel:${restaurantInfo?.phone || (restaurantInfo as any)?.customer_care_number || '+1234567890'}`}
                        className="text-red-500 font-bold text-lg hover:text-red-600 transition-colors"
                      >
                        {restaurantInfo?.phone || (restaurantInfo as any)?.customer_care_number || '+1 (234) 567-8900'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyOrdersSection;
