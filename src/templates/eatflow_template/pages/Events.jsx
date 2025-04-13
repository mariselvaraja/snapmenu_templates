import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { useAppSelector } from '../../../redux';

/**
 * Event item structure
 * @typedef {Object} EventItem
 * @property {number} id - Unique identifier
 * @property {string} title - Event title
 * @property {string} date - Event date
 * @property {string} time - Event time
 * @property {string} location - Event location
 * @property {number} capacity - Maximum capacity
 * @property {string} price - Event price
 * @property {string} image - Image URL
 * @property {string} description - Event description
 */

export function Events() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  
  // Default events data in case API data is not available
  const defaultEvents = {
    section: {
      title: "Our Events",
      subtitle: "Join us for unique culinary experiences and wellness events"
    },
    items: [
      {
        title: "Farm-to-Table Dinner Experience",
        date: "2024-03-25",
        time: "6:30 PM - 9:30 PM",
        location: "EatFlow Main Restaurant",
        image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&q=80",
        description: "Join us for an exclusive dining experience featuring fresh, locally-sourced ingredients prepared by our expert chefs."
      },
      {
        title: "Cooking Masterclass: Healthy Desserts",
        date: "2024-03-28",
        time: "2:00 PM - 4:00 PM",
        location: "EatFlow Culinary Studio",
        image: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&q=80",
        description: "Learn to create delicious, healthy desserts with our head pastry chef. Perfect for health-conscious food lovers."
      },
      {
        title: "Wellness Workshop & Brunch",
        date: "2024-04-02",
        time: "10:00 AM - 1:00 PM",
        location: "EatFlow Garden Terrace",
        image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80",
        description: "Start your day with a yoga session followed by a nutritious brunch and wellness discussion with our nutritionist."
      }
    ]
  };
  
  // Use API data if available, otherwise use default data
  const events = siteContent?.event || defaultEvents;
  
  // Transform events data to include additional properties
  const eventItems = events.items.map((item, index) => ({
    id: index + 1,
    title: item.title,
    date: item.date,
    time: item.time,
    location: item.location,
    capacity: 20 + (index * 5), // Example capacity
    price: `$${49.99 + (index * 10)}`, // Example price
    image: item.image,
    description: item.description
  }));

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">{events.section.title}</h1>
          <p className="text-xl text-gray-600">
            {events.section.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventItems.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-48">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full">
                  {event.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>Capacity: {event.capacity} people</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition-colors">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Events Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-gray-100 rounded-xl p-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Plan Your Private Event</h2>
            <p className="text-xl text-gray-600">
              Looking to host a special celebration? We offer custom event packages!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Birthday Parties",
                description: "Make your birthday celebration special with our party packages"
              },
              {
                title: "Corporate Events",
                description: "Perfect for team building and business meetings"
              },
              {
                title: "Special Occasions",
                description: "Customize your event exactly how you want it"
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors">
              Inquire About Private Events
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
