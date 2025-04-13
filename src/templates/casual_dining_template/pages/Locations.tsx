import React, { useState } from 'react';
import { MapPin, Clock, Phone, Calendar, Users, ChevronDown } from 'lucide-react';

const locations = [
  {
    name: "Downtown",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80",
    address: "123 Taco Street, Downtown",
    hours: "11:00 AM - 10:00 PM",
    phone: "(555) 123-4567",
    mapUrl: "#"
  },
  {
    name: "Beachside",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80",
    address: "456 Ocean Drive, Beachside",
    hours: "11:00 AM - 11:00 PM",
    phone: "(555) 234-5678",
    mapUrl: "#"
  },
  {
    name: "Uptown",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80",
    address: "789 Plaza Avenue, Uptown",
    hours: "11:00 AM - 9:00 PM",
    phone: "(555) 345-6789",
    mapUrl: "#"
  }
];

export function Locations() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].name);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80"
            alt="Locations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        


        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">Our Locations</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 animate-fade-in-delay-1">
            Find your nearest Raging Tacos and experience authentic Mexican street food
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Reservation Form */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Make a Reservation</h2>
            <p className="text-xl text-gray-400">Book your table at any of our locations</p>
          </div>
          
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Location</label>
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-zinc-800 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {locations.map((location) => (
                    <option key={location.name} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-zinc-800 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
                <option value="9+">9+ Guests</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-4">
              <button className="w-full bg-yellow-400 text-black py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition">
                Book Now
              </button>
            </div>
          </form>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <div 
              key={index}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl overflow-hidden group hover:scale-105 transition duration-300"
            >
              <div className="relative h-64">
                <img 
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold">{location.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-gray-300">
                  <p className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-yellow-400" />
                    {location.address}
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-yellow-400" />
                    {location.hours}
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-yellow-400" />
                    {location.phone}
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button className="bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
                    Get Directions
                  </button>
                  <button className="border-2 border-yellow-400 text-yellow-400 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold mb-6">Coming Soon</h2>
          <p className="text-xl text-gray-400 mb-8">
            We're expanding! New locations opening soon. Stay tuned for updates.
          </p>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition">
            Join Our Newsletter
          </button>
        </div>
      </div>
    </div>
  );
}
