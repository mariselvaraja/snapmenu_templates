import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAppSelector } from '../../../common/redux';
import { TableReservation, BookingData } from '../shared/components/reservation';

export default function Reservation() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const contact = siteContent?.contact;
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
    alert(`Table booked for ${bookingData.name}, party of ${bookingData.partySize} on ${bookingData.date} at ${bookingData.time}`);
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
          restaurantInfo={{
            name: "Pizza Restaurant",
            phone: contact?.infoCards?.phone?.numbers && Array.isArray(contact.infoCards.phone.numbers) && contact.infoCards.phone.numbers.length > 0 
              ? (typeof contact.infoCards.phone.numbers[0] === 'string' 
                ? contact.infoCards.phone.numbers[0] 
                : JSON.stringify(contact.infoCards.phone.numbers[0]))
              : "+1 (555) 123-4567",
            email: contact?.infoCards?.email?.addresses && Array.isArray(contact.infoCards.email.addresses) && contact.infoCards.email.addresses.length > 0
              ? contact.infoCards.email.addresses[0]
              : "info@pizzarestaurant.com",
            address: `${contact?.infoCards?.address?.street || "123 Main Street"}, ${contact?.infoCards?.address?.city || "Anytown"}${contact?.infoCards?.address?.state ? `, ${contact.infoCards.address.state}` : ""} ${contact?.infoCards?.address?.zip || ""}`,
            operatingHours: [
              { day: reservation?.info?.hours?.monday?.label || "Monday", hours: reservation?.info?.hours?.monday?.time || "11:00 AM - 10:00 PM" },
              { day: reservation?.info?.hours?.tuesday?.label || "Tuesday", hours: reservation?.info?.hours?.tuesday?.time || "11:00 AM - 10:00 PM" },
              { day: reservation?.info?.hours?.wednesday?.label || "Wednesday", hours: reservation?.info?.hours?.wednesday?.time || "11:00 AM - 10:00 PM" },
              { day: reservation?.info?.hours?.thursday?.label || "Thursday", hours: reservation?.info?.hours?.thursday?.time || "11:00 AM - 10:00 PM" },
              { day: reservation?.info?.hours?.friday?.label || "Friday", hours: reservation?.info?.hours?.friday?.time || "11:00 AM - 11:00 PM" },
              { day: reservation?.info?.hours?.saturday?.label || "Saturday", hours: reservation?.info?.hours?.saturday?.time || "11:00 AM - 11:00 PM" },
              { day: reservation?.info?.hours?.sunday?.label || "Sunday", hours: reservation?.info?.hours?.sunday?.time || "12:00 PM - 9:00 PM" }
            ]
          }}
        />

        {/* Additional content can be added here if needed */}
      </div>
    </div>
  );
}
