import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';

const upcomingEvents = [
  {
    title: "Farm-to-Table Dinner Experience",
    date: "March 25, 2024",
    time: "6:30 PM - 9:30 PM",
    location: "EatFlow Main Restaurant",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&q=80",
    description: "Join us for an exclusive dining experience featuring fresh, locally-sourced ingredients prepared by our expert chefs.",
    price: "$85 per person",
    capacity: "40 seats available"
  },
  {
    title: "Cooking Masterclass: Healthy Desserts",
    date: "March 28, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "EatFlow Culinary Studio",
    image: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&q=80",
    description: "Learn to create delicious, healthy desserts with our head pastry chef. Perfect for health-conscious food lovers.",
    price: "$65 per person",
    capacity: "15 seats available"
  },
  {
    title: "Wellness Workshop & Brunch",
    date: "April 2, 2024",
    time: "10:00 AM - 1:00 PM",
    location: "EatFlow Garden Terrace",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80",
    description: "Start your day with a yoga session followed by a nutritious brunch and wellness discussion with our nutritionist.",
    price: "$55 per person",
    capacity: "25 seats available"
  }
];

const pastEvents = [
  {
    title: "Seasonal Menu Launch Party",
    date: "March 1, 2024",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
    description: "A celebration of our new spring menu featuring live cooking demonstrations and tastings."
  },
  {
    title: "Kids Healthy Cooking Class",
    date: "February 25, 2024",
    image: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80",
    description: "Teaching children the basics of nutrition and healthy cooking through fun, hands-on activities."
  },
  {
    title: "Wine & Dine Pairing Evening",
    date: "February 15, 2024",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80",
    description: "An elegant evening of perfectly paired wines and healthy gourmet courses."
  }
];

export function Events() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80"
            alt="Events background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <Navigation />

        <div className="relative z-10 container mx-auto px-6 h-[calc(70vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <Calendar className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-8">
              Our Events
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Join us for unique culinary experiences and wellness events
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Upcoming Events</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition duration-500"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-3" />
                      <span>{event.capacity}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600">{event.price}</span>
                    <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Past Events</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {pastEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition duration-500"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-600 mb-4">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                  <p className="text-gray-600 mb-6">{event.description}</p>
                  <Link 
                    to="#" 
                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition"
                  >
                    <span>View Gallery</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-green-50 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive updates about upcoming events and exclusive offers.
            </p>
            <form className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full border focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition text-lg font-medium">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}