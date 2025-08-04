import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../../common/redux';
import { Carousel, CarouselItem } from '../../../../components/carousel';
import { usePayment } from '@/hooks';
import { useCartWithToast } from '../../hooks/useCartWithToast';
import { createCartItem } from '../../context/CartContext';

interface PopularItemsSectionProps {
  onOpenModifierModal?: (menuItem: any) => void;
}

export const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({ onOpenModifierModal }) => {
  const { items: menuItems, loading: menuLoading } = useAppSelector(state => state.menu);
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  const { addItemWithToast } = useCartWithToast();
  const { isPaymentAvilable } = usePayment();
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const homepage = siteContent.homepage;
  const siteConfiguration = siteContent?.siteConfiguration;
  const popularItems: any = homepage?.popularItems || {};

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

  // Only render if popularItems.products exists and has items
  if (!popularItems.products || popularItems.products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{popularItems.title || "Featured Menu Items"}</h2>
          <p className="text-xl text-gray-600">{popularItems.description || "Try our most popular creations"}</p>
        </motion.div>
        
        {menuLoading ? (
          <div className="text-center py-8">
            <p className="text-xl">Loading featured items...</p>
          </div>
        ) : (
          // Carousel layout for featured menu items - show all items with auto-scroll
          (() => {
            // Prepare carousel items from all menu items
            const carouselItems: CarouselItem[] = popularItems.products
              .map((skuId: string, index: number) => {
                const menuItem = menuItems.find(item => item.sku_id === skuId);
                if (!menuItem) return null;
                
                return {
                  id: menuItem.id,
                  content: (
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg mx-2">
                      <Link to={`/product/${menuItem.id}`}>
                        {menuItem.image ? (
                          <img
                            src={menuItem.image}
                            alt={menuItem.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-red-100 flex items-center justify-center text-4xl font-bold text-red-500">
                            {menuItem.name.charAt(0)}
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2">{menuItem.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{menuItem.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Out of Stock indicator */}
                              {menuItem.inventory_status === false && (
                                <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                                  Out Of Stock
                                </span>
                              )}
                              {(!siteConfiguration?.hidePriceInWebsite) ? (!siteConfiguration?.hidePriceInHome) ? <span className="text-lg font-bold text-red-500">${menuItem.price}</span> : null : null}
                            </div>
                            {!siteConfiguration?.hidePriceInWebsite && !siteConfiguration?.hidePriceInHome && (
                              isPaymentAvilable && (
                                menuItem.inventory_status === false ? (
                                  <button
                                    className="inline-flex items-center bg-gray-400 text-white px-3 py-1 rounded-full cursor-not-allowed text-sm"
                                    disabled
                                  >
                                    Out Of Stock
                                  </button>
                                ) : (
                                  <button
                                    className="inline-flex items-center bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleAddToCart(menuItem);
                                    }}
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    Add to Cart
                                  </button>
                                )
                              )
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                };
              })
              .filter(Boolean) as CarouselItem[];

            return carouselItems.length > 0 ? (
              <Carousel
                items={carouselItems}
                autoplay={true}
                autoplaySpeed={3000}
                dots={true}
                arrows={true}
                infinite={true}
                slidesToShow={3}
                slidesToScroll={1}
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                    }
                  },
                  {
                    breakpoint: 600,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    }
                  }
                ]}
                className="featured-menu-carousel"
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-xl">No featured items available</p>
              </div>
            );
          })()
        )}
      </div>
    </section>
  );
};

export default PopularItemsSection;
