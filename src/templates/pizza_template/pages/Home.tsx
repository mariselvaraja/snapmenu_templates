import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Award, Play, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaWineGlass, FaUtensils, FaClock, FaCoffee, FaGlassMartini, 
  FaHamburger, FaPizzaSlice, FaConciergeBell, FaChair, FaFire, FaBreadSlice,
  FaTruck, FaMotorcycle, FaShoppingBag, FaMapMarkerAlt, FaCalendarAlt, FaUsers,
  FaStar, FaMoneyBillWave, FaMobileAlt, FaCarSide, FaShippingFast, FaPercent,
  FaUserTie, FaClipboardList, FaReceipt
} from 'react-icons/fa';

import { useAppDispatch, useAppSelector, addItem, CartItem } from '../../../common/redux';

// Define interfaces for the experienceCard data structure
interface ExperienceCardSection {
  title?: string;
  subtitle?: string;
}

interface ExperienceCardItem {
  icon: string;
  title: string;
  description: string;
  image: string;
}

interface ExperienceCard {
  section?: ExperienceCardSection;
  cards?: ExperienceCardItem[];
}

// Type for icon components
type IconComponent = React.ComponentType<React.SVGAttributes<SVGElement>>;

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { items: menuItems, loading: menuLoading } = useAppSelector(state => state.menu);
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const navigationBar = siteContent?.navigationBar;
  const heroData = navigationBar?.hero;
  const experienceCard: ExperienceCard = navigationBar?.experience || {};
  const popularItems: any = siteContent?.popularItems || {};
  const offers: any = siteContent?.offers || {};
  
  
  // Fallback banner data if heroData or heroData.banners is not available
  const fallbackBanners = [
    {
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80",
      title: "Authentic Italian Pizza",
      subtitle: "Made with fresh ingredients and traditional recipes"
    },
    {
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80",
      title: "Handcrafted to Perfection",
      subtitle: "Every pizza is made with love and attention to detail"
    },
    {
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80",
      title: "Fast & Fresh Delivery",
      subtitle: "Hot and delicious pizza delivered to your doorstep"
    }
  ];
  
  // Use heroData.banners if available, otherwise use fallbackBanners
  const banners = heroData?.banners?.length > 0 ? heroData.banners : fallbackBanners;
  
  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        (prevIndex + 1) % banners.length
      );
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [banners.length]);
  
  const goToNextSlide = () => {
    setCurrentBannerIndex((prevIndex) => 
      (prevIndex + 1) % banners.length
    );
  };
  
  const goToPrevSlide = () => {
    setCurrentBannerIndex((prevIndex) => 
      (prevIndex - 1 + banners.length) % banners.length
    );
  };
  
  const currentBanner = banners[currentBannerIndex];

  // Function to render a menu item card
  const renderMenuItemCard = (menuItem: any, index: number, isCarousel: boolean = false) => {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * (isCarousel ? 0.1 : 0.2) }}
        className={`bg-white rounded-lg overflow-hidden shadow-lg ${isCarousel ? 'flex-shrink-0 w-80' : ''}`}
      >
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
            <p className="text-gray-600 mb-4">{menuItem.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-red-500">${menuItem.price}</span>
              <button
                className="inline-flex items-center bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const cartItem: CartItem = {
                    id: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    image: menuItem.image,
                    quantity: 1,
                  };
                  dispatch(addItem(cartItem));
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  // Fallback menu items
  const fallbackMenuItems = [
    {
      id: 1,
      name: "Wagyu Ribeye",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
      price: 120,
      description: "A5 grade Japanese Wagyu ribeye with roasted bone marrow and red wine reduction",
      category: "mains",
      available: true
    },
    {
      id: 2,
      name: "Pan-Seared Sea Bass",
      image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&q=80",
      price: 42,
      description: "Mediterranean sea bass with saffron risotto and lemon butter sauce",
      category: "mains",
      available: true
    },
    {
      id: 3,
      name: "Black Truffle Risotto",
      image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c1?auto=format&fit=crop&q=80",
      price: 38,
      description: "Creamy Arborio rice with black truffle, wild mushrooms, and aged Parmesan",
      category: "mains",
      available: true
    }
  ];

  return (
    <div>
      {/* Hero Section with Carousel */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {banners.map((banner: { image: string }, index: number) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentBannerIndex ? 1 : 0,
                zIndex: index === currentBannerIndex ? 1 : 0
              }}
              transition={{ duration: 0.8 }}
              style={{
                backgroundImage: `url('${banner.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
          <motion.div
            key={currentBannerIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {currentBanner?.title || 'Default Title'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto md:mx-0">
              {currentBanner?.subtitle || 'Default Subtitle'}
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                to="/menu"
                className="inline-flex items-center bg-red-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-600 transition-colors"
              >
                View Menu <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
          
          {/* Carousel arrows removed as requested */}
        </div>
      </section>
    
      {/* Features Section - Only render if experienceCard has data */}
      {(experienceCard.cards && experienceCard.cards.length > 0) && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">{experienceCard.section?.title || "The Art of Fine Dining"}</h2>
              <p className="text-xl text-gray-600">{experienceCard.section?.subtitle || "Discover the pillars of our gastronomic excellence"}</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {experienceCard.cards.map((card: ExperienceCardItem, index: number) => {
                // Map string icon names to imported icon components
                const iconMap: Record<string, IconComponent> = {
                  Wine: FaWineGlass,
                  UtensilsCrossed: FaUtensils,
                  Clock: FaClock,
                  Coffee: FaCoffee,
                  GlassMartini: FaGlassMartini,
                  Hamburger: FaHamburger,
                  Pizza: FaPizzaSlice,
                  ConciergeBell: FaConciergeBell,
                  Chair: FaChair,
                  Fire: FaFire,
                  BreadSlice: FaBreadSlice,
                  Truck: FaTruck,
                  Motorcycle: FaMotorcycle,
                  ShoppingBag: FaShoppingBag,
                  MapMarker: FaMapMarkerAlt,
                  Calendar: FaCalendarAlt,
                  Users: FaUsers,
                  Star: FaStar,
                  MoneyBill: FaMoneyBillWave,
                  Mobile: FaMobileAlt,
                  Car: FaCarSide,
                  Shipping: FaShippingFast,
                  Percent: FaPercent,
                  UserTie: FaUserTie,
                  Clipboard: FaClipboardList,
                  Receipt: FaReceipt
                };
                
                const IconComponent = iconMap[card.icon] || FaUtensils; // Default to FaUtensils if icon not found
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="bg-white p-6 text-center"
                  >
                    <IconComponent className="h-12 w-12 text-red-500 mx-auto my-4" />
                    <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Menu Items - Only render if popularItems.products exists and has items */}
      {popularItems.products && popularItems.products.length > 0 && (
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
              <>
                {popularItems.products.length > 3 ? (
                  // Carousel layout for more than 3 products
                  <div className="relative">
                    <div className="overflow-x-auto pb-4 hide-scrollbar">
                      <div className="flex space-x-6 px-2">
                        {popularItems.products.map((skuId: string, index: number) => {
                          // Find menu item with matching SKU ID
                          const menuItem = menuItems.find(item => item.sku_id === skuId);
                          if (!menuItem) return null;
                          
                          return renderMenuItemCard(menuItem, index, true);
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Grid layout for 3 or fewer products
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {popularItems.products.map((skuId: string, index: number) => {
                      // Find menu item with matching SKU ID
                      const menuItem = menuItems.find(item => item.sku_id === skuId);
                      if (!menuItem) return null;
                      
                      return renderMenuItemCard(menuItem, index);
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Delivery Info - Only render if offers exists and has items */}
      {offers && Array.isArray(offers) && offers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {offers.length > 1 ? (
              // Carousel layout for multiple offers
              <div className="relative">
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                  <div className="flex space-x-6 px-2">
                    {offers.map((offer: any, index: number) => (
                      <div key={index} className="flex-shrink-0 w-full max-w-4xl">
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
                          
                          {/* Right side - Product or banner */}
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-lg overflow-hidden shadow-lg"
                          >
                            {offer.product_sku && menuItems ? (
                              // Try to find the product with matching SKU
                              (() => {
                                const menuItem = menuItems.find(item => item.sku_id === offer.product_sku);
                                if (menuItem) {
                                  // Product found - show product
                                  return (
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
                                          onClick={() => {
                                            const cartItem: CartItem = {
                                              id: menuItem.id,
                                              name: menuItem.name,
                                              price: menuItem.price,
                                              image: menuItem.image,
                                              quantity: 1,
                                            };
                                            dispatch(addItem(cartItem));
                                          }}
                                        >
                                          <ShoppingCart className="h-5 w-5 mr-2" />
                                          Add to Cart
                                        </button>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  // Product not found - show banner image
                                  return (
                                    <div className="h-full">
                                      <img
                                        src={offer.image}
                                        alt="Special Offer"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  );
                                }
                              })()
                            ) : (
                              // No product SKU or no menu items - show banner image
                              <div className="h-full">
                                <img
                                  src={offer.image}
                                  alt="Special Offer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Single offer layout
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left side - Offer content */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-4xl font-bold mb-6">Special Offer</h2>
                  <p className="text-xl text-gray-600 mb-8">
                    {offers[0].content || "Check out our special offer!"}
                  </p>
                </motion.div>
                
                {/* Right side - Product or banner */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg overflow-hidden shadow-lg"
                >
                  {offers[0].product_sku && menuItems ? (
                    // Try to find the product with matching SKU
                    (() => {
                      const menuItem = menuItems.find(item => item.sku_id === offers[0].product_sku);
                      if (menuItem) {
                        // Product found - show product
                        return (
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
                                onClick={() => {
                                  const cartItem: CartItem = {
                                    id: menuItem.id,
                                    name: menuItem.name,
                                    price: menuItem.price,
                                    image: menuItem.image,
                                    quantity: 1,
                                  };
                                  dispatch(addItem(cartItem));
                                }}
                              >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        );
                      } else {
                        // Product not found - show banner image
                        return (
                          <div className="h-full">
                            <img
                              src={offers[0].image}
                              alt="Special Offer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      }
                    })()
                  ) : (
                    // No product SKU or no menu items - show banner image
                    <div className="h-full">
                      <img
                        src={offers[0].image}
                        alt="Special Offer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {/* <section className="bg-red-500 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Order?</h2>
            <p className="text-xl mb-8">Get your favorite pizza delivered to your doorstep!</p>
            <Link
              to="/order"
              className="inline-flex items-center bg-white text-red-500 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Order Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
}
