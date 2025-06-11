import React from 'react';
import { motion } from 'framer-motion';
import ComboCard from './ComboCard';
import { Carousel, CarouselItem } from '../../../components/carousel';
import { useCartWithToast } from '../hooks/useCartWithToast';
import { createCartItem } from '../context/CartContext';

interface ComboSectionProps {
  comboData?: {
    isActive?: boolean;
    data?: any[];
  };
  siteConfiguration?: {
    hidePriceInWebsite?: boolean;
    hidePriceInHome?: boolean;
  };
  isPaymentAvailable?: boolean;
  className?: string;
}

const ComboSection: React.FC<ComboSectionProps> = ({
  comboData,
  siteConfiguration,
  isPaymentAvailable = true,
  className = ''
}) => {
  const { addItemWithToast } = useCartWithToast();

  // Don't render if not active
  if (!comboData?.isActive) {
    return null;
  }

  // Check if prices should be shown
  const showPrice = siteConfiguration?.hidePriceInWebsite 
    ? false 
    : siteConfiguration?.hidePriceInHome 
    ? false 
    : true;

  // Process combo data from data array only
  const getAllCombos = () => {
    // Only use data array, filter by is_enabled
    if (comboData?.data && Array.isArray(comboData.data)) {
      return comboData.data.filter((combo: any) => combo.is_enabled);
    }
    return [];
  };

  const allCombos = getAllCombos();

  // Handle adding combo to cart
  const handleAddComboToCart = (combo: any) => {
    try {
      // Parse price from string
      const parsePrice = (priceString: string) => {
        if (!priceString) return 0;
        const cleanPrice = priceString.replace(/[^\d.]/g, '');
        return parseFloat(cleanPrice) || 0;
      };

      // Create a cart item for the combo
      const comboCartItem = createCartItem({
        pk_id: combo.combo_id || combo.id || Date.now(), // Use combo_id or fallback
        name: combo.title,
        price: parsePrice(combo.combo_price),
        image: combo.combo_image || '',
        description: combo.description,
        sku_id: combo.combo_id || `combo_${Date.now()}`
      }, [], 1);

      addItemWithToast(comboCartItem);
    } catch (error) {
      console.error('Error adding combo to cart:', error);
    }
  };

  // Don't render if no combos available
  if (!allCombos || allCombos.length === 0) {
    return null;
  }

  return (
    <section className={`py-20 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Combo Deals</h2>
          <p className="text-xl text-gray-600">Try our delicious combo meals and save more</p>
        </motion.div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCombos.map((combo, index) => (
              <motion.div
                key={combo.combo_id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ComboCard
                  combo={combo}
                  showPrice={showPrice}
                  isPaymentAvailable={isPaymentAvailable}
                  onAddToCart={handleAddComboToCart}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Carousel Layout */}
        <div className="block md:hidden">
          {(() => {
            const carouselItems: CarouselItem[] = allCombos.map((combo, index) => ({
              id: combo.combo_id || index,
              content: (
                <div className="px-2">
                  <ComboCard
                    combo={combo}
                    showPrice={showPrice}
                    isPaymentAvailable={isPaymentAvailable}
                    onAddToCart={handleAddComboToCart}
                  />
                </div>
              )
            }));

            return (
              <Carousel
                items={carouselItems}
                autoplay={true}
                autoplaySpeed={4000}
                dots={true}
                arrows={true}
                infinite={true}
                slidesToShow={1}
                slidesToScroll={1}
                className="combo-carousel"
              />
            );
          })()}
        </div>
      </div>
    </section>
  );
};

export default ComboSection;
