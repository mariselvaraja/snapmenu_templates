import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

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
  const siteContent = useSiteContent();
  const events = siteContent?.events || {
    section: {
      title: "Upcoming Events",
      subtitle: "Join us for special culinary experiences and celebrations"
    },
    items: [
      {
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
        title: "Wine Tasting Evening",
        description: "Sample our curated selection of fine wines paired with gourmet appetizers",
        date: "2025-05-15",
        time: "7:00 PM - 10:00 PM",
        location: "Main Dining Room"
      },
      {
        image: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80",
        title: "Chef's Table Experience",
        description: "An intimate dining experience with our executive chef",
        date: "2025-05-22",
        time: "6:30 PM - 9:30 PM",
        location: "Private Dining Room"
      },
      {
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
        title: "Summer Cocktail Party",
        description: "Celebrate the season with refreshing cocktails and summer-inspired dishes",
        date: "2025-06-05",
        time: "8:00 PM - 11:00 PM",
        location: "Rooftop Terrace"
      }
    ]
  };
  
  // Transform events data from siteContent to include additional properties
  const eventItems: EventItem[] = events.items.map((item, index) => ({
    id: index + 1,
    title: item.title,
    date: item.date,
    time: item.time,
    location: item.location,
    capacity: 20 + (index * 5), // Example capacity (not in siteContent)
    price: `$${49.99 + (index * 10)}`, // Example price (not in siteContent)
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

        {/* Custom Events Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
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
            <button className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition-colors">
              Inquire About Private Events
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
