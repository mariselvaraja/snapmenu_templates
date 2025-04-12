import { useState } from 'react';
import { Phone, Mail, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface TableReservationProps {
  onBookingComplete?: (bookingData: BookingData) => void;
  initialDate?: string;
  initialTime?: string;
  reservationContent: {
    form: {
      labels: {
        name: string;
      };
    };
  };
  restaurantInfo?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    operatingHours: {
      day: string;
      hours: string;
    }[];
  };
}

export interface BookingData {
  partySize: number;
  date: string;
  time: string;
  name: string;
}

export default function TableReservation({ 
  onBookingComplete,
  initialDate,
  initialTime, 
  reservationContent,
  restaurantInfo = {
    name: "Pizza Restaurant",
    phone: "+1 (555) 123-4567",
    email: "info@pizzarestaurant.com",
    address: "123 Main Street, Anytown, USA",
    operatingHours: [
      { day: "Monday - Thursday", hours: "11:00 AM - 10:00 PM" },
      { day: "Friday - Saturday", hours: "11:00 AM - 11:00 PM" },
      { day: "Sunday", hours: "12:00 PM - 9:00 PM" }
    ]
  }
}: TableReservationProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate || ''); 
  const [selectedTime, setSelectedTime] = useState(initialTime || '');
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(2);

  // Available party sizes
  const partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];
  
  // Time slots for the time selector
  const timeSlots = ['11:00', '12:00', '13:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  const handleBooking = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    const bookingData: BookingData = {
      partySize,
      date: selectedDate,
      time: selectedTime,
      name
    };
    
    if (onBookingComplete) {
      onBookingComplete(bookingData);
    } else {
      // Default behavior if no callback is provided
      alert(`Reservation for ${name}, party of ${partySize} on ${selectedDate} at ${selectedTime}`);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 mx-auto max-w-full"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Reservation Form */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Make a Reservation</h2>
            
            <form onSubmit={handleBooking} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              {/* Party Size Field */}
              <div>
                <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="inline-block mr-1 h-4 w-4" /> Party Size
                </label>
                <select
                  id="partySize"
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  {partySizes.map(size => (
                    <option key={size} value={size}>
                      {size} {size === 1 ? 'person' : 'people'}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Date Field */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline-block mr-1 h-4 w-4" /> Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline-block mr-1 h-4 w-4" /> Available Time Slots
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                        selectedTime === time
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 px-4 rounded-md font-semibold hover:bg-red-600 transition-colors shadow-sm hover:shadow-md mt-6"
              >
                Reserve Table
              </button>
            </form>
          </div>
          
          {/* Right side - Restaurant Information */}
          <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Restaurant Information</h2>
            
            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Phone className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                  <span>{restaurantInfo.phone}</span>
                </div>
                <div className="flex items-start">
                  <Mail className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                  <span>{restaurantInfo.email}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                  <span>{restaurantInfo.address}</span>
                </div>
              </div>
            </div>
            
            {/* Operating Hours */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Operating Hours</h3>
              <div className="space-y-3">
                {restaurantInfo.operatingHours.map((item, index) => (
                  <div key={index} className="flex flex-col border-b border-gray-200 pb-2 last:border-0">
                    <span className="font-medium">{item.day}</span>
                    <span className="text-gray-600">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-md border border-yellow-100">
              <h4 className="font-medium text-yellow-800 mb-2">Reservation Policy</h4>
              <p className="text-sm text-yellow-700">
                Reservations are held for 15 minutes past the scheduled time. For parties of 8 or more, 
                please call us directly. A credit card may be required for larger reservations.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
