import React from 'react';
import { motion } from 'framer-motion';
import DefaultComboCards from './DefaultComboCards';
import CarouselComboCards from './CarouselComboCards';

interface ComboItem {
  combo_id: string;
  restaurant_id: string;
  title: string;
  description: string;
  products: any[];
  combo_price: string;
  offer_percentage?: string;
  combo_image: string;
  is_enabled: boolean;
  created_date?: string;
}

interface ComboSectionProps {
  comboData: {
    isActive?: boolean;
    data?: ComboItem[];
  };
  siteConfiguration: any;
  isPaymentAvailable: boolean;
  comboLoading?: boolean;
}

export const ComboSection: React.FC<ComboSectionProps> = ({
  comboData,
  siteConfiguration,
  isPaymentAvailable,
  comboLoading = false
}) => {
  // Check if combo section should be displayed
  if (!comboData?.isActive || !comboData?.data || comboData.data.length === 0) {
    return null;
  }

  const allCombos = comboData.data.filter(combo => combo.is_enabled);

  if (allCombos.length === 0) {
    return null;
  }

  // Remove duplicates from combo data
  const uniqueCombos = allCombos.filter((combo, index, self) => 
    index === self.findIndex(c => c.combo_id === combo.combo_id)
  );

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Combo Deals</h2>
          <p className="text-xl text-gray-600">Try our delicious combo offers</p>
        </motion.div>
        
        {comboLoading ? (
          <div className="text-center py-8">
            <p className="text-xl">Loading combo deals...</p>
          </div>
        ) : (
          // Conditional rendering based on number of combos
          uniqueCombos.length <= 3 ? (
            // Default cards for 3 or fewer combos (no duplicates)
            <DefaultComboCards 
              combos={uniqueCombos}
              siteConfiguration={siteConfiguration}
              isPaymentAvailable={isPaymentAvailable}
            />
          ) : (
            // Carousel layout for more than 3 combos
            <CarouselComboCards 
              combos={uniqueCombos}
              siteConfiguration={siteConfiguration}
              isPaymentAvailable={isPaymentAvailable}
            />
          )
        )}
      </div>
    </section>
  );
};

export default ComboSection;
