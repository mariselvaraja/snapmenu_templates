import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../redux';
import { TableReservation } from '../components/TableReservation';

/**
 * Booking data structure
 * @typedef {Object} BookingData
 * @property {string} name - Customer name
 * @property {string} email - Customer email
 * @property {string} phone - Customer phone
 * @property {string} date - Reservation date
 * @property {string} time - Reservation time
 * @property {number} partySize - Number of guests
 * @property {string} specialRequests - Any special requests
 */

export function Reservation() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  
  // Default reservation data in case API data is not available
  const defaultReservation = {
    header: {
      title: "Reserve a Table",
      description: "Book your dining experience with us"
    },
    info: {
      hours: {
        weekdays: {
          label: "Monday - Thursday",
          time: "5:00 PM - 10:00 PM"
        },
        weekends: {
          label: "Friday - Saturday",
          time: "5:00 PM - 11:00 PM"
        },
        sunday: {
          label: "Sunday",
          time: "5:00 PM - 9:00 PM"
        }
      },
      location: {
        street: "123 Main Street",
        area: "Downtown",
        city: "New York",
        state: "NY",
        zip: "10001"
      },
      contact: {
        phone: "(212) 555-1234"
      },
      note: "Reservations recommended. Please call us for parties of 6 or more."
    },
    form: {
      labels: {
        date: "Date",
        time: "Time",
        guests: "Number of Guests",
        name: "Name",
        email: "Email",
        phone: "Phone",
        specialRequests: "Special Requests"
      },
      placeholders: {
        name: "Your full name",
        email: "your@email.com",
        phone: "(123) 456-7890",
        specialRequests: "Any special requests or dietary restrictions?"
      }
    }
  };
  
  // Use API data if available, otherwise use default data
  const reservation = siteContent?.reservation || defaultReservation;
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('18:00');

  const handleBookingComplete = (bookingData) => {
    // Handle booking logic here
    alert(`Table booked for ${bookingData.name}, party of ${bookingData.partySize} on ${bookingData.date} at ${bookingData.time}`);
    // In a real application, you would send this data to your backend
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  return (
    <div className="">
      <div className="max-w-full mx-auto px-4">
        {/* Table Reservation Component */}
        <TableReservation 
          onBookingComplete={handleBookingComplete}
          initialDate={selectedDate}
          initialTime={selectedTime}
          reservationContent={reservation}
        />

        {/* Additional content can be added here if needed */}
      </div>
    </div>
  );
}
