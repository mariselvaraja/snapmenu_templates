import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
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
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { useState, useEffect } from 'react';

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
      {/* Hero Section */}
      <header className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={useSiteContent().siteContent?.hero?.banners?.[0]?.image}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <Navigation />

        <div className="relative z-10 container mx-auto px-6 h-[calc(100vh-120px)] flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-7xl font-bold text-white mb-8">
              {useSiteContent().siteContent?.brand?.name}
            </h1>
            <p className="text-2xl text-gray-200 mb-12 leading-relaxed">
              {useSiteContent().siteContent?.hero?.banners?.[0]?.subtitle}
            </p>
            <Link
              to="/menu"
              className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-green-600 transition flex items-center space-x-2 w-fit"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">{useSiteContent().siteContent?.experience?.section?.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {useSiteContent().siteContent?.experience?.section?.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {useSiteContent().siteContent?.experience?.cards?.map((feature, index) => (
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
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Buddha Bowl",
                description: "Quinoa, roasted vegetables, avocado, and tahini dressing",
                price: "$15.99",
                image: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9"
              },
              {
                name: "Grilled Salmon",
                description: "Wild-caught salmon with roasted vegetables and quinoa",
                price: "$24.99",
                image: "https://images.unsplash.com/photo-1567337710282-00832b415979"
              },
              {
                name: "Acai Bowl",
                description: "Fresh acai blend topped with granola, banana, and seasonal fruits",
                price: "$12.99",
                image: "https://images.unsplash.com/photo-1547592180-85f173990554"
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="relative h-80 mb-6 overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition duration-500"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-3">{item.name}</h3>
                  <p className="text-gray-600 mb-4 text-lg">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">{item.price}</span>
                    <button className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition text-lg font-medium">
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear what our satisfied customers have to say
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-semibold">{testimonial.name}</h4>
                    <p className="text-green-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-lg italic mb-6">"{testimonial.text}"</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
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
              <h2 className="text-4xl font-bold mb-8">Get in Touch</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Have questions about our menu or services? We'd love to hear from you. Contact us using the form or visit us at our location.
              </p>
              <div className="space-y-6">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-lg">Location</h4>
                    <p className="text-gray-600">123 Healthy Street, New York, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-lg">Phone</h4>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-lg">Email</h4>
                    <p className="text-gray-600">info@eatflow.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-lg">Hours</h4>
                    <p className="text-gray-600">Mon-Fri: 8am - 8pm</p>
                    <p className="text-gray-600">Sat-Sun: 9am - 7pm</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your email"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-lg font-medium">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
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
