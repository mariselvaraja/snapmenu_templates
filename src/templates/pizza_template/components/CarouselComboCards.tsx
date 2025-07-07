import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselItem } from '../../../components/carousel';
import { useCartWithToast } from '../hooks/useCartWithToast';
import { createCartItem } from '../context/CartContext';

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

interface MenuItem {
  id: string;
  sku_id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  is_enabled?: boolean;
  modifiers_list?: any[];
  is_spice_applicable?: string;
  raw_api_data?: any;
}

interface CarouselComboCardsProps {
  combos?: ComboItem[];
  featuredItems?: MenuItem[];
  siteConfiguration: any;
  isPaymentAvailable: boolean;
  itemType?: 'combo' | 'featured';
}

export const CarouselComboCards: React.FC<CarouselComboCardsProps> = ({
  combos,
  featuredItems,
  siteConfiguration,
  isPaymentAvailable,
  itemType = 'combo'
}) => {
  const { addItemWithToast } = useCartWithToast();

  // Remove duplicates for carousel layout
  const uniqueItems = itemType === 'combo' 
    ? (combos || []).filter((combo, index, self) => 
        index === self.findIndex(c => c.combo_id === combo.combo_id)
      )
    : (featuredItems || []).filter((item, index, self) => 
        index === self.findIndex(i => i.id === item.id || i.sku_id === item.sku_id)
      );

  // Handle adding combo to cart
  const handleAddComboToCart = (combo: ComboItem) => {
    const price = parseFloat(combo.combo_price.replace(/[^\d.-]/g, '')) || 0;
    
    const comboCartItem = createCartItem({
      pk_id: combo.combo_id,
      name: combo.title,
      price: price,
      image: combo.combo_image || '',
      description: combo.description
    }, [], 1);

    addItemWithToast(comboCartItem);
  };

  // Handle adding featured item to cart
  const handleAddFeaturedToCart = (menuItem: MenuItem) => {
    const cartItem = createCartItem(menuItem, [], 1);
    addItemWithToast(cartItem);
  };

  // Create carousel items
  const carouselItems: CarouselItem[] = itemType === 'combo' 
    ? (uniqueItems as ComboItem[])
        .map((combo) => {
          if (!combo) return null;
          
          return {
            id: combo.combo_id,
            content: (
              <div className="bg-white rounded-lg overflow-hidden shadow-lg mx-2 hover:shadow-xl transition-all duration-300">
                <Link 
                  to={`/combo/${combo.combo_id}`} 
                  className="block"
                  onClick={() => {
                    // Store selected combo ID in localStorage
                    localStorage.setItem('selectedComboId', combo.combo_id);
                  }}
                >
                  <div className="relative">
                    {combo.combo_image ? (
                      <img
                        src={combo.combo_image}
                        alt={combo.title}
                        className="w-full h-48 object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-red-600 block mb-1">
                            {combo.title.charAt(0).toUpperCase()}
                          </span>
                          <span className="text-red-500 text-sm">Combo</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Offer Badge */}
                    {combo.offer_percentage && parseFloat(combo.offer_percentage) > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {combo.offer_percentage}% OFF
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">{combo.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">{combo.description}</p>
                    <div className="flex items-center justify-between">
                      {/* Price Display */}
                      {(!siteConfiguration?.hidePriceInWebsite) && (!siteConfiguration?.hidePriceInHome) && (
                        <span className="text-lg font-bold text-red-500">
                          ${parseFloat(combo.combo_price.replace(/[^\d.-]/g, '')) || 0}
                        </span>
                      )}
                      
                      {/* Add to Cart Button */}
                      {!siteConfiguration?.hidePriceInWebsite && !siteConfiguration?.hidePriceInHome && isPaymentAvailable && (
                        <button
                          className="inline-flex items-center bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddComboToCart(combo);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            )
          };
        })
        .filter(Boolean) as CarouselItem[]
    : (uniqueItems as MenuItem[])
        .map((item) => {
          if (!item) return null;
          
          return {
            id: item.id || item.sku_id,
            content: (
              <div className="bg-white rounded-lg overflow-hidden shadow-lg mx-2 hover:shadow-xl transition-all duration-300">
                <Link 
                  to={`/product/${item.id}`} 
                  className="block"
                >
                  <div className="relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-red-600 block mb-1">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                          <span className="text-red-500 text-sm">Featured</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">{item.description}</p>
                    <div className="flex items-center justify-between">
                      {/* Price Display */}
                      {(!siteConfiguration?.hidePriceInWebsite) && (!siteConfiguration?.hidePriceInHome) && (
                        <span className="text-lg font-bold text-red-500">
                          ${item.price}
                        </span>
                      )}
                      
                      {/* Add to Cart Button */}
                      {!siteConfiguration?.hidePriceInWebsite && !siteConfiguration?.hidePriceInHome && isPaymentAvailable && (
                        <button
                          className="inline-flex items-center bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddFeaturedToCart(item);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </button>
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
      className="carousel-combo-cards"
    />
  ) : (
    <div className="text-center py-8">
      <p className="text-xl">No combo deals available</p>
    </div>
  );
};

export default CarouselComboCards;
