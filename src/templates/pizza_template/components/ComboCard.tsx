import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface ComboCardProps {
  combo: {
    combo_id: string;
    title: string;
    description: string;
    combo_price: string;
    offer_percentage?: string;
    combo_image?: string;
    is_enabled: boolean;
  };
  showPrice: boolean;
  isPaymentAvailable: boolean;
  onAddToCart: (combo: any) => void;
}

const ComboCard: React.FC<ComboCardProps> = ({
  combo,
  showPrice,
  isPaymentAvailable,
  onAddToCart
}) => {
  // Parse price for display
  const parsePrice = (priceString: string) => {
    if (!priceString) return '0';
    return priceString.replace(/[^\d.]/g, '');
  };

  const displayPrice = parsePrice(combo.combo_price);
  const hasOffer = combo.offer_percentage && parseFloat(combo.offer_percentage) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Combo Image */}
      <div className="relative h-48 bg-gray-200">
        {combo.combo_image ? (
          <img
            src={combo.combo_image}
            alt={combo.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-red-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">
                {combo.title.charAt(0)}
              </div>
              <div className="text-sm text-red-400 font-medium">
                Combo Deal
              </div>
            </div>
          </div>
        )}
        
        {/* Offer Badge */}
        {hasOffer && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {combo.offer_percentage}% OFF
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-3 text-gray-900 line-clamp-2">
          {combo.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {combo.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          {showPrice && (
            <div className="flex items-center">
              <span className="text-2xl font-bold text-red-500">
                ${displayPrice}
              </span>
              {hasOffer && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${(parseFloat(displayPrice) * (1 + parseFloat(combo.offer_percentage || '0') / 100)).toFixed(2)}
                </span>
              )}
            </div>
          )}
          
          {isPaymentAvailable && (
            <button
              onClick={() => onAddToCart(combo)}
              className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </button>
          )}
        </div>

        {/* Full width button when price is hidden */}
        {!showPrice && isPaymentAvailable && (
          <button
            onClick={() => onAddToCart(combo)}
            className="w-full mt-4 inline-flex items-center justify-center bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add Combo to Cart
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ComboCard;
