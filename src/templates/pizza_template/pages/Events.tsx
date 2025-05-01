import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { useAppSelector } from '../../../common/redux';

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

export default function Events() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
    
  // Check if events data is available
  const isEventsAvailable = siteContent?.events !== undefined;
  
  // Default events data in case API data is not available
  const defaultEvents = {
    section: {
      title: "Our Events",
      subtitle: "Join us for special culinary experiences and celebrations"
    },
    items: [
      {
        title: "Pizza Making Workshop",
        date: "2025-05-15",
        time: "6:00 PM - 8:00 PM",
        location: "Main Restaurant",
        image: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&q=80",
        description: "Learn the art of pizza making from our master chef"
      },
      {
        title: "Wine Tasting Evening",
        date: "2025-05-22",
        time: "7:00 PM - 9:00 PM",
        location: "Wine Cellar",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80",
        description: "Sample our finest wine selection with expert guidance"
      }
    ]
  };
  
  // Use API data if available, otherwise use default data for rendering
  const events = isEventsAvailable ? siteContent.events : defaultEvents;
  
  // Check if events items array exists and has items
  const hasEventItems = events.items && events.items.length > 0;
  
  // Transform events data from siteContent to include additional properties
  const eventItems: EventItem[] = (isEventsAvailable && hasEventItems) ? events.items.map((item: any, index: number) => ({
    id: index + 1,
    title: item.title,
    date: item.date || "TBD",
    time: item.time || "TBD",
    location: item.location || "Main Restaurant",
    capacity: item.capacity || 20 + (index * 5), // Use API capacity or fallback
    price: item.price || `$${49.99 + (index * 10)}`, // Use API price or fallback
    image: item.image || "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&q=80",
    description: item.description || "Join us for this special event"
  })) : [];
  
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {hasEventItems ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">{events.section.title}</h1>
            {events.section.subtitle && (
              <p className="text-xl text-gray-600">
                {events.section.subtitle}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Events are not Available</h1>
            <p className="text-xl text-gray-600">
              Our events content is currently unavailable. Please check back later.
            </p>
          </motion.div>
        )}

        {hasEventItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventItems.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full">
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
                  <button className="w-full mt-6 bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition-colors">
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
