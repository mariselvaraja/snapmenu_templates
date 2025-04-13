import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { useAppSelector } from '../../../common/redux';
import { Navigation } from '../components/Navigation';

// Define interface for event item with additional properties
interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  price: string;
  image: string;
  description: string;
}

export function Events() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  
  // Default events data in case API data is not available
  const defaultEvents = {
    section: {
      title: "Upcoming Events",
      subtitle: "Join us for special occasions and culinary experiences"
    },
    items: [
      {
        title: "Wine Tasting Evening",
        date: "2024-04-25",
        time: "7:00 PM - 10:00 PM",
        location: "Main Dining Room",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80",
        description: "Join our sommelier for an exclusive wine tasting featuring selections from renowned vineyards."
      },
      {
        title: "Chef's Table Experience",
        date: "2024-05-10",
        time: "6:30 PM - 9:30 PM",
        location: "Private Dining Room",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
        description: "An intimate dining experience where our executive chef prepares a special tasting menu right before your eyes."
      },
      {
        title: "Live Jazz Night",
        date: "2024-05-17",
        time: "8:00 PM - 11:00 PM",
        location: "Bar & Lounge",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80",
        description: "Enjoy an evening of exceptional cuisine accompanied by the smooth sounds of live jazz."
      }
    ]
  };
  
  // Use API data if available, otherwise use default data
  const events = siteContent?.event || defaultEvents;
  
  // Transform events data to include additional properties
  const eventItems: EventItem[] = events.items.map((item: any, index: number) => ({
    id: index + 1,
    title: item.title,
    date: item.date,
    time: item.time,
    location: item.location,
    capacity: 20 + (index * 5), // Example capacity
    price: `$${79.99 + (index * 10)}`, // Example price
    image: item.image,
    description: item.description
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80"
            alt="Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            {events.section.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12"
          >
            {events.section.subtitle}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {eventItems.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl overflow-hidden group hover:scale-105 transition duration-300"
            >
              <div className="relative h-64">
                <img 
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full">
                  {event.price}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <div className="space-y-3 text-gray-300 mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-yellow-400" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-yellow-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-yellow-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-yellow-400" />
                    <span>Capacity: {event.capacity} people</span>
                  </div>
                </div>
                <button className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
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
          className="mt-32 text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Host Your Private Event</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Looking to host a special celebration? We offer custom event packages tailored to your needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            {[
              {
                icon: 'Calendar',
                title: "Special Occasions",
                description: "Birthdays, anniversaries, and celebrations of all kinds"
              },
              {
                icon: 'Users',
                title: "Corporate Events",
                description: "Impress clients and colleagues with exceptional service"
              },
              {
                icon: 'MapPin',
                title: "Private Dining",
                description: "Intimate gatherings in our exclusive private rooms"
              }
            ].map((feature, index) => {
              let IconComponent: React.FC<any> = Users;
              if (feature.icon === 'MapPin') IconComponent = MapPin;
              else if (feature.icon === 'Calendar') IconComponent = Calendar;
              
              return (
                <div key={index} className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <IconComponent className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition">
            Inquire About Private Events
          </button>
        </motion.div>
      </div>
    </div>
  );
}
