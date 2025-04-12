import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Truck, Clock, Award, Pizza, Play, UtensilsCrossed, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';

import { SiteContentContext } from '../context/SiteContentContext';
import { useAppDispatch, useAppSelector, fetchMenuRequest, addItem, CartItem } from '../shared/redux';

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const siteContent = useContext(SiteContentContext);
  const dispatch = useAppDispatch();
  const { items: menuItems, loading: menuLoading } = useAppSelector(state => state.menu);
  const heroData = siteContent?.navigationBar?.hero;
  const currentBanner = heroData?.banners[0]; // Assuming you want to use the first banner for now
  
  // Fetch menu data when component mounts
  useEffect(() => {
    dispatch(fetchMenuRequest());
  }, [dispatch]);

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

      {/* Featured Menu Items */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Menu Items</h2>
            <p className="text-xl text-gray-600">Try our most popular creations</p>
          </motion.div>
          
          {menuLoading ? (
            <div className="text-center py-8">
              <p className="text-xl">Loading featured items...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(menuItems.length >= 3 ? 
                menuItems.slice(0, 3) : 
                [
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
                ]
              ).map((menuItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white rounded-lg overflow-hidden shadow-lg"
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
              ))}
            </div>
          )}
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
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              {menuItems.length > 0 ? (
                <div className="h-full flex flex-col">
                  <div className="relative h-64">
                    {menuItems[0].image ? (
                      <img
                        src={menuItems[0].image}
                        alt={menuItems[0].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-red-100 flex items-center justify-center text-4xl font-bold text-red-500">
                        {menuItems[0].name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${menuItems[0].price}
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-semibold mb-2">{menuItems[0].name}</h3>
                    <p className="text-gray-600 mb-4">{menuItems[0].description}</p>
                    <button
                      className="w-full inline-flex items-center justify-center bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => {
                        const cartItem: CartItem = {
                          id: menuItems[0].id,
                          name: menuItems[0].name,
                          price: menuItems[0].price,
                          image: menuItems[0].image,
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
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <p className="text-xl text-gray-500">Loading menu item...</p>
                </div>
              )}
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
