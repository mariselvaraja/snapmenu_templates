import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Clock, Award, Pizza, Play, UtensilsCrossed, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useRootSiteContent } from '../../../../context/RootSiteContentContext';
import { useContext } from 'react';
import { MenuContext, MenuItem } from '../context/MenuContext';

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const { siteContent: rootSiteContent } = useRootSiteContent();
  const menuContext = useContext(MenuContext);
  
  // Default site content with required properties
  const defaultSiteContent = {
    brand: {
      name: "Pizza Restaurant",
      logo: {
        icon: "Pizza",
        text: "Pizza Restaurant"
      }
    },
    hero: {
      banners: [
        {
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80",
          title: "Authentic Italian Pizza",
          subtitle: "Made with fresh ingredients and traditional recipes"
        }
      ]
    },
    story: {
      hero: {
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80",
        title: "Our Story",
        description: "The journey of our restaurant from its humble beginnings to where we are today."
      },
      values: [
        {
          icon: "Heart",
          title: "Passion",
          description: "We put our heart into every pizza we make."
        },
        {
          icon: "Users",
          title: "Community",
          description: "We believe in building a community around good food."
        },
        {
          icon: "UtensilsCrossed",
          title: "Tradition",
          description: "We honor traditional Italian pizza-making techniques."
        }
      ]
    }
  };

  // Transform the site content structure if needed
  const typedSiteContent = rootSiteContent ? {
    // Use navigationBar properties if available, otherwise use top-level properties or defaults
    brand: (rootSiteContent as any).navigationBar?.brand || (rootSiteContent as any).brand || defaultSiteContent.brand,
    hero: (rootSiteContent as any).navigationBar?.hero || (rootSiteContent as any).hero || defaultSiteContent.hero,
    story: (rootSiteContent as any).story || defaultSiteContent.story
  } : defaultSiteContent;

  const heroData = typedSiteContent.hero;
  // Add a check to ensure banners exists and has at least one item
  const currentBanner = heroData?.banners && heroData.banners.length > 0 ? heroData.banners[0] : null;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {currentBanner && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('${currentBanner.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {currentBanner?.title || 'Default Title'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              {currentBanner?.subtitle || 'Default Subtitle'}
            </p>
            <div className="flex gap-4">
              <Link
                to="/order"
                className="inline-flex items-center bg-red-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Order Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center bg-white bg-opacity-20 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-30 transition-colors"
              >
                <Play className="mr-2 h-5 w-5" /> Watch Video
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Video Modal */}
      {videoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Pizza Planet Story"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Pizza,
                title: "Fresh Ingredients",
                description: "We use only the freshest ingredients, sourced daily from local suppliers."
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Hot and fresh pizza delivered to your door in 30 minutes or less."
              },
              {
                icon: Award,
                title: "Award Winning",
                description: "Voted best pizza in the galaxy for 5 years running."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <feature.icon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(() => {
            // Get story content directly from useRootSiteContent
            const { siteContent } = useRootSiteContent();
            const story = (siteContent as any)?.story;
            
            // Default values for story content
            const defaultHero = {
              title: "Our Story",
              description: "The journey of our restaurant from its humble beginnings to where we are today.",
              image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80"
            };
            
            const defaultValues = [
              {
                icon: "Heart",
                title: "Passion",
                description: "We put our heart into every pizza we make."
              },
              {
                icon: "Users",
                title: "Community",
                description: "We believe in building a community around good food."
              },
              {
                icon: "UtensilsCrossed",
                title: "Tradition",
                description: "We honor traditional Italian pizza-making techniques."
              }
            ];
            
            // Use story data with fallbacks to defaults
            const hero = story?.hero || defaultHero;
            const values = story?.values?.length > 0 ? story.values : defaultValues;
            
            return (
              <>
                {/* Hero Section with Image */}
                <div className="relative rounded-xl overflow-hidden mb-16 h-96">
                  <div 
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: `url('${hero.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-5xl font-bold mb-6">{hero.title}</h2>
                      <p className="text-xl max-w-3xl mx-auto">
                        {hero.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
                
                {/* Values Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  {values.map((value: any, index: number) => {
                    // Determine which icon to use based on the icon name in the value
                    let IconComponent = UtensilsCrossed;
                    if (value.icon === "Heart") IconComponent = Heart;
                    else if (value.icon === "Users") IconComponent = Users;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="text-center p-6 bg-gray-800 rounded-lg"
                      >
                        <div className="bg-red-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                        <p className="text-gray-300">{value.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Pizzas</h2>
            <p className="text-xl text-gray-600">Try our most popular creations</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(() => {
              // Get pizza items from all categories
              const pizzaItems = [
                ...(menuContext?.menuData?.menu?.mains?.filter(item => 
                  item.category.toLowerCase().includes('pizza') || 
                  item.name.toLowerCase().includes('pizza')
                ) || []),
                ...(menuContext?.menuData?.menu?.starters?.filter(item => 
                  item.category.toLowerCase().includes('pizza') || 
                  item.name.toLowerCase().includes('pizza')
                ) || []),
                // Flatten all menu categories and filter for pizza items
                ...Object.values(menuContext?.menuData?.menu || {})
                  .flat()
                  .filter((item: any) => 
                    item && (
                      (item.category && item.category.toLowerCase().includes('pizza')) || 
                      (item.name && item.name.toLowerCase().includes('pizza'))
                    )
                  )
              ];
              
              // Get first three unique pizza items (by id)
              const uniquePizzaItems = Array.from(
                new Map(pizzaItems.map(item => [item.id, item])).values()
              ).slice(0, 3);
              
              // Use fallback items if needed
              const featuredItems = uniquePizzaItems.length > 0 ? uniquePizzaItems : [
                {
                  name: "Margherita Pizza",
                  image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80",
                  price: "15",
                  description: "Classic pizza with tomato sauce, mozzarella, and basil"
                },
                {
                  name: "Pepperoni Pizza",
                  image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80",
                  price: "18",
                  description: "Traditional pizza topped with pepperoni slices"
                },
                {
                  name: "Vegetarian Pizza",
                  image: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?auto=format&fit=crop&q=80",
                  price: "17",
                  description: "Fresh vegetables on a crispy crust with tomato sauce and cheese"
                }
              ];
              
              return featuredItems;
            })().map((menuItem: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={menuItem.image}
                  alt={menuItem.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{menuItem.name}</h3>
                  <p className="text-gray-600 mb-4">{menuItem.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-red-500">${menuItem.price}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-6">Fast & Free Delivery</h2>
              <p className="text-xl text-gray-600 mb-8">
                We deliver to all locations in our service area. Order now and get your pizza delivered hot and fresh to your doorstep.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-red-500 mr-4" />
                  <span>30 Minutes or Less</span>
                </div>
                <div className="flex items-center">
                  <Truck className="h-6 w-6 text-red-500 mr-4" />
                  <span>Free Delivery on Orders Over $20</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-96 rounded-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                alt="Pizza delivery"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-500 py-20 text-white">
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
      </section>
    </div>
  );
}
