import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useAppSelector } from '../../../common/redux';

export function Events() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const events = siteContent?.events || {
    items: [],
    section: {
      title: "Upcoming Events",
      subtitle: "Join us for special occasions and culinary experiences"
    }
  };

  return (
    <>
    <div className="min-h-screen bg-black text-white">
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
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            {events?.section?.title || "Upcoming Events"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 animate-fade-in-delay-1">
            {events?.section?.subtitle || "Join us for special occasions and culinary experiences"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Featured Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {events?.items?.length > 0 ? events.items.map((event: any, index: number) => (
            <div 
              key={index}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl overflow-hidden group hover:scale-105 transition duration-300"
            >
              <div className="relative h-64">
                <img 
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                <div className="space-y-3 text-gray-300 mb-6">
                  <p className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-yellow-400" />
                    {event.date}
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-yellow-400" />
                    {event.time}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-yellow-400" />
                    {event.location}
                  </p>
                </div>
                <p className="text-gray-400 mb-6">{event.description}</p>
                <button className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
                  Learn More
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center">
              <p className="text-xl text-gray-400">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Private Events - Only show if privateEvents data exists */}
        {events?.privateEvents && (
          <div className="mt-32 text-center">
            <h2 className="text-4xl font-bold mb-6">{events.privateEvents?.title || "Host Your Private Event"}</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              {events.privateEvents?.description || "Contact us to learn more about hosting your private event."}
            </p>
            {events.privateEvents?.features && events.privateEvents.features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                {events.privateEvents.features.map((feature: any, index: number) => {
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
            )}
            {events.privateEvents?.ctaButton && (
              <button className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition">
                {events.privateEvents.ctaButton.text || "Inquire About Private Events"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  
    </>
  );
}
