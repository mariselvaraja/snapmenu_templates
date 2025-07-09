/**
 * Party Orders Section Component
 * A plug-and-play component for displaying party orders with popup functionality
 * Shows only enabled party orders, no cart functionality - display only
 */

import React from 'react';
import { useAppSelector } from '../../../common/redux';
import { Users } from 'lucide-react';

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
  // const [selectedPartyOrder, setSelectedPartyOrder] = useState<any>(null);
  // const [isPartyDetailModalOpen, setIsPartyDetailModalOpen] = useState(false);

  // Get restaurant info from Redux store
  const restaurantInfo = useAppSelector(state => state.restaurant?.info);

  // Filter only enabled party orders
  const enabledPartyOrders = partyOrders?.filter(party => party?.is_enabled === true) ?? [];

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
          {enabledPartyOrders.map((party: any, index: number) => (
            <div
              key={party.party_id || index}
              className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex flex-col"
              // onClick={() => {
              //   setSelectedPartyOrder(party);
              //   setIsPartyDetailModalOpen(true);
              // }}
            >
              <div className="relative">
                {party?.image ? (
                  <img
                    src={party.image}
                    alt={party?.name ?? 'Party Order'}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <span className="text-6xl font-bold text-red-500">
                      {party?.name?.charAt(0)?.toUpperCase() ?? 'P'}
                    </span>
                  </div>
                )}
                
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {party?.name ?? ''}
                  </h3>
                </div>
                {party?.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {party.description}
                  </p>
                )}
                
                {/* Available Options */}
                {(party?.party_orders?.length ?? 0) > 0 && (
                  <div className="mb-4 flex-grow">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2"> Party Tray:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {party.party_orders?.map((option: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-center bg-white rounded-md p-2 border border-gray-300 shadow-sm">
                          <div>
                        
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {option?.name ?? ''}
                            </span>
                            
                          
                          
                          <div>
  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                              <Users size={12} className="text-red-500" />
                              {option?.serving ?? 0}
                            </span>
                            </div>
                          <span className="text-sm font-bold text-red-600">
                            ${option?.price ?? '0.00'}
                          </span>
                          </div>
                        </div>
                      )) ?? []}
                    </div>
                  </div>
                )}
                
                {/* Place Order Phone Number */}
                <div className="text-center p-3 bg-red-50 rounded-lg mt-auto">
                  <div className="text-sm text-gray-600 mb-1">Place Party Order:</div>
                  <a
                    href={`tel:${restaurantInfo?.phone ?? (restaurantInfo as any)?.customer_care_number ?? ''}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-red-500 font-bold text-lg hover:text-red-600 transition-colors"
                  >
                    📞 {restaurantInfo?.phone ?? (restaurantInfo as any)?.customer_care_number ?? ''}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Party Orders Detail Modal */}
      {/* {isPartyDetailModalOpen && selectedPartyOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            {/* <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">{selectedPartyOrder?.name || 'Party Order'}</h2>
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
            {/* <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="w-full">
                {/* Product Image */}
                {/* {selectedPartyOrder?.image && (
                  <div className="mb-6">
                    <img
                      src={selectedPartyOrder.image}
                      alt={selectedPartyOrder.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Details Section */}
                {/* <div className="flex flex-col">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {selectedPartyOrder?.description || 'No description available'}
                  </p>

                  {/* Party Order Options */}
                  {/* {selectedPartyOrder?.party_orders?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Available Options:</h3>
                      <div className="space-y-3">
                        {selectedPartyOrder.party_orders.map((option: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4 border">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 capitalize">{option?.name}</h4>
                                <p className="text-sm text-gray-600">Serves {option?.serving} people</p>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-red-500">${option?.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Product Info */}
                  {/* {selectedPartyOrder?.ingredients?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Ingredients:</h3>
                      <p className="text-gray-600">{selectedPartyOrder.ingredients.join(', ')}</p>
                    </div>
                  )}

                  {selectedPartyOrder?.allergens?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Allergy Information:</h3>
                      <p className="text-gray-600">{selectedPartyOrder.allergens.join(', ')}</p>
                    </div>
                  )}

                  {/* Call to Place Your Order */}
                  {/* <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <h6 className="font-bold text-gray-900 mb-2">📞 Call to Place Your Party Order</h6>
                      <a
                        href={`tel:${restaurantInfo?.phone || (restaurantInfo as any)?.customer_care_number || ''}`}
                        className="text-red-500 font-bold text-lg hover:text-red-600 transition-colors"
                      >
                        {restaurantInfo?.phone || (restaurantInfo as any)?.customer_care_number || ''}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default PartyOrdersSection;
