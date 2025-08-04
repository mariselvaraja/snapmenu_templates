import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { FaClock, FaPercent } from 'react-icons/fa';
import { useAppSelector } from '../../../../common/redux';
import { useCartWithToast } from '../../hooks/useCartWithToast';
import { createCartItem } from '../../context/CartContext';

interface OffersSectionProps {
  onOpenModifierModal?: (menuItem: any) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onOpenModifierModal }) => {
  const { items: menuItems } = useAppSelector(state => state.menu);
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  const { addItemWithToast } = useCartWithToast();
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const homepage = siteContent.homepage;
  const siteConfiguration = siteContent?.siteConfiguration;
  const offers: any = homepage?.offers?.offers || [];

  // Helper function to handle adding items to cart with modifier check
  const handleAddToCart = (menuItem: any) => {
    // Helper function to check if spice level should be shown based on is_spice_applicable
    const shouldShowSpiceLevel = () => {
      // Check if product has is_spice_applicable field and it's "yes"
      if (menuItem?.is_spice_applicable?.toLowerCase() === 'yes') {
        return true;
      }
      // Also check in raw_api_data if it exists
      if (menuItem?.raw_api_data) {
        try {
          const rawData = typeof menuItem.raw_api_data === 'string' 
            ? JSON.parse(menuItem.raw_api_data) 
            : menuItem.raw_api_data;
          if (rawData?.is_spice_applicable?.toLowerCase() === 'yes') {
            return true;
          }
        } catch (e) {
          // If parsing fails, continue with other checks
        }
      }
      return false;
    };

    // Helper function to check if modifiers are available
    const hasModifiers = () => {
      return menuItem?.modifiers_list && menuItem.modifiers_list.length > 0;
    };

    // Check if spice level is available OR modifiers are available
    const needsModifierModal = shouldShowSpiceLevel() || hasModifiers();

    if (needsModifierModal && onOpenModifierModal) {
      // Open the modifier modal and set the selected menu item
      onOpenModifierModal(menuItem);
    } else {
      // Directly add to cart without opening modifier modal using standardized function
      const cartItem = createCartItem(menuItem, [], 1);
      addItemWithToast(cartItem);
    }
  };

  const showPrice = siteConfiguration?.hidePriceInWebsite ? false : siteConfiguration?.hidePriceInHome ? false : true;

  // Only render if offers exists and has items
  if (!offers || !Array.isArray(offers) || offers.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {offers.length > 1 ? (
          // Carousel layout for multiple offers
          <div className="relative">
            <div className="overflow-x-auto overflow-y-hidden pb-4 hide-scrollbar">
              <div className="flex space-x-6 px-2">
                {offers.map((offer: any, index: number) => (
                  <div key={index} className="flex-shrink-0 w-full max-w-4xl">
                    {offer.product_sku && menuItems ? (
                      // Try to find the product with matching SKU
                      (() => {
                        const menuItem = menuItems.find(item => item.sku_id === offer.product_sku);
                        if (menuItem) {
                          // Product found - show product
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                              {/* Left side - Offer content */}
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                              >
                                <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                                <p className="text-xl text-gray-600 mb-8">
                                  {offer.content || "Check out our special offer!"}
                                </p>
                                <div className="space-y-4">
                                  <div className="flex items-center">
                                    <FaClock className="h-6 w-6 text-red-500 mr-4" />
                                    <span>Limited Time Only</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FaPercent className="h-6 w-6 text-red-500 mr-4" />
                                    <span>Exclusive Deal</span>
                                  </div>
                                </div>
                              </motion.div>
                              
                              {/* Right side - Product */}
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-lg overflow-hidden shadow-lg"
                              >
                                <div className="h-full flex flex-col">
                                  <div className="relative h-64">
                                    {menuItem.image ? (
                                      <img
                                        src={menuItem.image}
                                        alt={menuItem.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-red-100 flex items-center justify-center text-4xl font-bold text-red-500">
                                        {menuItem.name.charAt(0)}
                                      </div>
                                    )}
                                    {showPrice && <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                      ${menuItem.price}
                                    </div>}
                                  </div>
                                  <div className="p-6 flex-grow">
                                    <h3 className="text-2xl font-semibold mb-2">{menuItem.name}</h3>
                                    <p className="text-gray-600 mb-4">{menuItem.description}</p>
                                    <button
                                      className="w-full inline-flex items-center justify-center bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
                                      onClick={() => handleAddToCart(menuItem)}
                                    >
                                      <ShoppingCart className="h-5 w-5 mr-2" />
                                      Add to Cart
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          );
                        } else if (offer.image) {
                          // Product not found but offer has image - show banner image with overlay content
                          return (
                            <div className="relative rounded-lg overflow-hidden shadow-lg h-96">
                              <img
                                src={offer.image}
                                alt="Special Offer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center p-8">
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5 }}
                                  className="text-white"
                                >
                                  <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                                  <p className="text-xl mb-8">
                                    {offer.content || "Check out our special offer!"}
                                  </p>
                                  <div className="space-y-4">
                                    <div className="flex items-center">
                                      <FaClock className="h-6 w-6 text-red-400 mr-4" />
                                      <span>Limited Time Only</span>
                                    </div>
                                    <div className="flex items-center">
                                      <FaPercent className="h-6 w-6 text-red-400 mr-4" />
                                      <span>Exclusive Deal</span>
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          );
                        } else {
                          // No product and no image - show default layout
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                              >
                                <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                                <p className="text-xl text-gray-600 mb-8">
                                  {offer.content || "Check out our special offer!"}
                                </p>
                              </motion.div>
                              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                                <FaPercent className="h-16 w-16 text-red-500" />
                              </div>
                            </div>
                          );
                        }
                      })()
                    ) : offer.image ? (
                      // No product SKU but has image - show banner image with overlay content
                      <div className="relative rounded-lg overflow-hidden shadow-lg h-96">
                        <img
                          src={offer.image}
                          alt="Special Offer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center p-8">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-white"
                          >
                            <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                            <p className="text-xl mb-8">
                              {offer.content || "Check out our special offer!"}
                            </p>
                            <div className="space-y-4">
                              <div className="flex items-center">
                                <FaClock className="h-6 w-6 text-red-400 mr-4" />
                                <span>Limited Time Only</span>
                              </div>
                              <div className="flex items-center">
                                <FaPercent className="h-6 w-6 text-red-400 mr-4" />
                                <span>Exclusive Deal</span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      // No product SKU and no image - show default layout
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                          <p className="text-xl text-gray-600 mb-8">
                            {offer.content || "Check out our special offer!"}
                          </p>
                        </motion.div>
                        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                          <FaPercent className="h-16 w-16 text-red-500" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Single offer layout
          (() => {
            const offer = offers[0];
            if (offer.product_sku && menuItems) {
              // Try to find the product with matching SKU
              const menuItem = menuItems.find(item => item.sku_id === offer.product_sku);
              if (menuItem) {
                // Product found - show product
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left side - Offer content */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                      <p className="text-xl text-gray-600 mb-8">
                        {offer.content || "Check out our special offer!"}
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <FaClock className="h-6 w-6 text-red-500 mr-4" />
                          <span>Limited Time Only</span>
                        </div>
                        <div className="flex items-center">
                          <FaPercent className="h-6 w-6 text-red-500 mr-4" />
                          <span>Exclusive Deal</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Right side - Product */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-lg overflow-hidden shadow-lg"
                    >
                      <div className="h-full flex flex-col">
                        <div className="relative h-64">
                          {menuItem.image ? (
                            <img
                              src={menuItem.image}
                              alt={menuItem.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-red-100 flex items-center justify-center text-4xl font-bold text-red-500">
                              {menuItem.name.charAt(0)}
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            ${menuItem.price}
                          </div>
                        </div>
                        <div className="p-6 flex-grow">
                          <h3 className="text-2xl font-semibold mb-2">{menuItem.name}</h3>
                          <p className="text-gray-600 mb-4">{menuItem.description}</p>
                          <button
                            className="w-full inline-flex items-center justify-center bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
                            onClick={() => handleAddToCart(menuItem)}
                          >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              } else if (offer.image) {
                // Product not found but offer has image - show banner image with overlay content
                return (
                  <div className="relative rounded-lg overflow-hidden shadow-lg h-96 mx-auto max-w-4xl">
                    <img
                      src={offer.image}
                      alt="Special Offer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center p-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-white"
                      >
                        <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                        <p className="text-xl mb-8">
                          {offer.content || "Check out our special offer!"}
                        </p>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <FaClock className="h-6 w-6 text-red-400 mr-4" />
                            <span>Limited Time Only</span>
                          </div>
                          <div className="flex items-center">
                            <FaPercent className="h-6 w-6 text-red-400 mr-4" />
                            <span>Exclusive Deal</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              } else {
                // No product and no image - show default layout
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                      <p className="text-xl text-gray-600 mb-8">
                        {offer.content || "Check out our special offer!"}
                      </p>
                    </motion.div>
                    <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                      <FaPercent className="h-16 w-16 text-red-500" />
                    </div>
                  </div>
                );
              }
            } else if (offer.image) {
              // No product SKU but has image - show banner image with overlay content
              return (
                <div className="relative rounded-lg overflow-hidden shadow-lg h-96 mx-auto max-w-4xl">
                  <img
                    src={offer.image}
                    alt="Special Offer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-white"
                    >
                      <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                      <p className="text-xl mb-8">
                        {offer.content || "Check out our special offer!"}
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <FaClock className="h-6 w-6 text-red-400 mr-4" />
                          <span>Limited Time Only</span>
                        </div>
                        <div className="flex items-center">
                          <FaPercent className="h-6 w-6 text-red-400 mr-4" />
                          <span>Exclusive Deal</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            } else {
              // No product SKU and no image - show default layout
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                    <p className="text-xl text-gray-600 mb-8">
                      {offer.content || "Check out our special offer!"}
                    </p>
                  </motion.div>
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <FaPercent className="h-16 w-16 text-red-500" />
                  </div>
                </div>
              );
            }
          })()
        )}
      </div>
    </section>
  );
};

export default OffersSection;
