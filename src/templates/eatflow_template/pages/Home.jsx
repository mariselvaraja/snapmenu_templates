import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  ArrowRight,
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  Utensils,
  Heart,
  Wine,
  ArrowUpCircle,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../redux';
import { motion } from 'framer-motion';

// Function to render the appropriate icon
const renderIcon = (iconName) => {
  switch(iconName) {
    case 'Wine':
      return <Wine className="w-8 h-8 text-green-600" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="w-8 h-8 text-green-600" />;
    case 'Clock':
      return <Clock className="w-8 h-8 text-green-600" />;
    case 'Utensils':
      return <Utensils className="w-8 h-8 text-green-600" />;
    case 'Heart':
      return <Heart className="w-8 h-8 text-green-600" />;
    default:
      return <Utensils className="w-8 h-8 text-green-600" />;
  }
};

// Use SiteContent context - Context is used directly in JSX now

const howItWorks = [
  {
    icon: <Utensils className="w-10 h-10 text-green-600" />,
    title: "Choose Your Meal",
    description: "Browse our diverse menu of healthy, chef-crafted meals."
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
    title: "We Prepare",
    description: "Our chefs prepare your meals with fresh ingredients."
  },
  {
    icon: <Truck className="w-10 h-10 text-green-600" />,
    title: "Fast Delivery",
    description: "Enjoy convenient delivery right to your doorstep."
  },
  {
    icon: <Heart className="w-10 h-10 text-green-600" />,
    title: "Enjoy Your Food",
    description: "Savor your delicious and nutritious meal."
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fitness Enthusiast",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    text: "EatFlow has transformed my meal planning. The food is not only healthy but absolutely delicious!"
  },
  {
    name: "Michael Chen",
    role: "Business Professional",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    text: "Perfect for my busy lifestyle. The quality and taste are consistently excellent."
  },
  {
    name: "Emma Williams",
    role: "Yoga Instructor",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    text: "I love how fresh and nutritious every meal is. It's made healthy eating effortless."
  }
];

export function Home() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  const { items: menuItems, loading: menuLoading } = useAppSelector(state => state.menu);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const navigationBar = siteContent?.navigationBar;
  const heroData = navigationBar?.hero;
  const storyData = navigationBar?.story;
  const contactData = navigationBar?.contact;
  
  // Auto-rotate carousel
  useEffect(() => {
    if (!heroData.banners || heroData.banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        (prevIndex + 1) % heroData.banners.length
      );
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [heroData.banners]);
  
  const goToNextSlide = () => {
    if (!heroData.banners || heroData.banners.length <= 1) return;
    setCurrentBannerIndex((prevIndex) => 
      (prevIndex + 1) % heroData.banners.length
    );
  };
  
  const goToPrevSlide = () => {
    if (!heroData.banners || heroData.banners.length <= 1) return;
    setCurrentBannerIndex((prevIndex) => 
      (prevIndex - 1 + heroData.banners.length) % heroData.banners.length
    );
  };
  
  const currentBanner = heroData?.banners?.[currentBannerIndex] || {
    title: "EatFlow",
    subtitle: "Healthy, delicious meals delivered to your door",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroData.banners.map((banner, index) => (
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

        <div className="relative z-10 container mx-auto px-6 text-white w-full">
          <motion.div
            key={currentBannerIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {currentBanner?.title || "EatFlow"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto md:mx-0">
              {currentBanner?.subtitle || "Healthy, delicious meals delivered to your door"}
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                to={heroData?.ctaLink || "/menu"}
                className="inline-flex items-center bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors"
              >
                {heroData?.ctaText || "Explore Menu"} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center bg-white bg-opacity-20 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-30 transition-colors"
              >
                <Play className="mr-2 h-5 w-5" /> Watch Video
              </button>
            </div>
          </motion.div>
          
          {/* Carousel Navigation */}
          {heroData.banners.length > 1 && (
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 z-20">
              {heroData.banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentBannerIndex ? 'bg-green-500' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Carousel arrows */}
          {heroData.banners.length > 1 && (
            <>
              <button
                onClick={goToPrevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={goToNextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}
        </div>
      </section>
      
      {/* Video Modal */}
      {videoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-green-500 transition-colors"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="EatFlow Story"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of nutrition, taste, and convenience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: "Utensils",
                title: "Chef-Crafted Meals",
                description: "Our expert chefs create delicious, nutritionally balanced meals"
              },
              {
                icon: "Heart",
                title: "Fresh Ingredients",
                description: "We use only the freshest, highest quality ingredients"
              },
              {
                icon: "Clock",
                title: "Convenient Delivery",
                description: "Meals delivered right to your door on your schedule"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {renderIcon(feature.icon)}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting your healthy meals is easy with our simple process
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-12">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition">
                    {step.icon}
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-green-200"></div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Featured Menu</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular healthy and delicious meals
            </p>
          </div>
          {menuLoading ? (
            <div className="text-center py-8">
              <p className="text-xl">Loading featured items...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-12">
              {(menuItems && menuItems.length >= 3 ? 
                menuItems.filter(item => item.available !== false).slice(0, 3) : 
                [
                  {
                    id: 1,
                    name: "Buddha Bowl",
                    description: "Quinoa, roasted vegetables, avocado, and tahini dressing",
                    price: 15.99,
                    image: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9",
                    category: "mains",
                    available: true
                  },
                  {
                    id: 2,
                    name: "Grilled Salmon",
                    description: "Wild-caught salmon with roasted vegetables and quinoa",
                    price: 24.99,
                    image: "https://images.unsplash.com/photo-1567337710282-00832b415979",
                    category: "mains",
                    available: true
                  },
                  {
                    id: 3,
                    name: "Acai Bowl",
                    description: "Fresh acai blend topped with granola, banana, and seasonal fruits",
                    price: 12.99,
                    image: "https://images.unsplash.com/photo-1547592180-85f173990554",
                    category: "mains",
                    available: true
                  }
                ]
              ).map((menuItem, index) => (
                <div key={index} className="group">
                  <Link to={`/product/${menuItem.id}`} className="block">
                    <div className="relative h-80 mb-6 overflow-hidden rounded-2xl">
                      {menuItem.image ? (
                        <img
                          src={menuItem.image}
                          alt={menuItem.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-green-100 flex items-center justify-center text-4xl font-bold text-green-500">
                          {menuItem.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition duration-500"></div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold mb-3">{menuItem.name}</h3>
                      <p className="text-gray-600 mb-4 text-lg">{menuItem.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">${menuItem.price}</span>
                        <button 
                          className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition text-lg font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            // Add to cart functionality would go here
                          }}
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-16">
            <Link
              to="/menu"
              className="inline-flex items-center space-x-2 text-xl font-semibold text-green-600 hover:text-green-700 transition"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Store Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">{storyData?.hero?.title || "Our Store"}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {storyData?.hero?.description || "Discover the passion and tradition behind our culinary journey."}
            </p>
          </div>
          
          {/* Image Section - only show if image exists */}
          {storyData?.hero?.image && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-96 mb-16 rounded-xl overflow-hidden"
            >
              <img
                src={storyData.hero.image}
                alt="Our story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h2 className="text-4xl font-bold text-white">{storyData.hero.title || "Our Story"}</h2>
              </div>
            </motion.div>
          )}

          {/* Values Section - only show if values exist */}
          {storyData?.values && storyData.values.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {storyData.values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-center p-6"
                >
                  {renderIcon(value.icon)}
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: "UtensilsCrossed",
                  title: "Culinary Excellence",
                  description: "We are committed to creating exceptional dishes using the finest ingredients."
                },
                {
                  icon: "Heart",
                  title: "Passion for Service",
                  description: "Every guest is treated with warmth, care, and attention to detail."
                },
                {
                  icon: "Users",
                  title: "Community Focus",
                  description: "We believe in building relationships and being an active part of our community."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-center p-6"
                >
                  {renderIcon(value.icon)}
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8">Ready to Start Eating Healthy?</h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of satisfied customers who have transformed their eating habits with EatFlow
            </p>
            <Link
              to="/menu"
              className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-green-600 transition inline-flex items-center space-x-2"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-8">{contactData?.header?.title || "Get in Touch"}</h2>
              <p className="text-gray-600 mb-8 text-lg">
                {contactData?.header?.subtitle || "Have questions about our menu or services? We'd love to hear from you. Contact us using the form or visit us at our location."}
              </p>
              <div className="space-y-6">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-lg">{contactData?.infoCards?.address?.title || "Location"}</h4>
                    <p className="text-gray-600">
                      {contactData?.infoCards?.address?.street || "123 Healthy Street"}, {contactData?.infoCards?.address?.city || "New York"}, {contactData?.infoCards?.address?.state || "NY"} {contactData?.infoCards?.address?.zip || "10001"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-lg">{contactData?.infoCards?.phone?.title || "Phone"}</h4>
                    <p className="text-gray-600">{contactData?.infoCards?.phone?.numbers?.[0] || "(555) 123-4567"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-lg">{contactData?.infoCards?.email?.title || "Email"}</h4>
                    <p className="text-gray-600">{contactData?.infoCards?.email?.addresses?.[0] || "info@eatflow.com"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-lg">{contactData?.infoCards?.hours?.title || "Hours"}</h4>
                    <p className="text-gray-600">{contactData?.infoCards?.hours?.weekday || "Mon-Fri: 8am - 8pm"}</p>
                    <p className="text-gray-600">{contactData?.infoCards?.hours?.weekend || "Sat-Sun: 9am - 7pm"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    {contactData?.form?.labels?.firstName || "Name"}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={contactData?.form?.placeholders?.firstName || "Your name"}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    {contactData?.form?.labels?.email || "Email"}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={contactData?.form?.placeholders?.email || "Your email"}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    {contactData?.form?.labels?.message || "Message"}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={contactData?.form?.placeholders?.message || "Your message"}
                  ></textarea>
                </div>
                <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-lg font-medium">
                  {contactData?.form?.labels?.submitButton || "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {showScrollButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 border-white hover:bg-green-600 transition-colors duration-300"
          >
            <ArrowUpCircle className="w-8 h-8" />
          </button>
        )}
    </div>
  );
}
