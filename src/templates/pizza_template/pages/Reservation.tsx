import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { TableReservation, BookingData } from '../shared/components/reservation';

export default function Reservation() {
  const siteContent = useSiteContent();
  const reservation = siteContent?.reservation || {
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));

  const handleBookingComplete = (bookingData: BookingData): void => {
    // Handle booking logic here
    alert(`Table ${bookingData.tableId} booked for ${bookingData.date} at ${bookingData.time}`);
    // In a real application, you would send this data to your backend
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  return (
    <div className="">
      <div className="max-w-full mx-auto px-4 ">
        {/* Date and Time inputs are now moved to the TableReservation component */}

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
