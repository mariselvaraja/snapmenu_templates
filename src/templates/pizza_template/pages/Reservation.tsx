import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../common/redux';
import { TableReservation, BookingData } from '../shared/components/reservation';

export default function Reservation() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const contact = siteContent?.contact;
  const reservation = siteContent?.reservation;
  console.log("reservation", reservation.info.hours)
   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

 // Convert 24-hour time to 12-hour format
 function to12Hour(time: string): string {
  if (!time) return '';
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = ((hour + 11) % 12) + 1;
  return `${hour12.toString().padStart(2, '0')}:${minuteStr} ${suffix}`;
}

// Convert schedule object to { [day]: "hh:mm AM to hh:mm PM" }
function convertScheduleTo12HourFormat(schedule: any): any {
  const result: any = {};
  for (const day in schedule) {
    const { firstHalf, secondHalf } = schedule[day] || {};
    const first = firstHalf?.start && firstHalf?.end
      ? `${to12Hour(firstHalf.start)} to ${to12Hour(firstHalf.end)}`
      : '';
    const second = secondHalf?.start && secondHalf?.end
      ? ` - ${to12Hour(secondHalf.start)} to ${to12Hour(secondHalf.end)}`
      : '';
    result[day] = first + second || 'Closed';
  }
  return result;
}

// Prepare formatted operating hours
const rawHours = reservation?.info?.hours;
const scheduleConverted = convertScheduleTo12HourFormat(
  Object.fromEntries(
    Object.entries(rawHours || {}).map(([day, data]: any) => [
      day,
      data
    ])
  )
);

const operatingHoursFormatted = Object.entries(scheduleConverted).map(([day, hours]) => ({
  day: rawHours?.[day]?.label || day.charAt(0).toUpperCase() + day.slice(1),
  hours
}));

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
            operatingHours: operatingHoursFormatted
          }}
        />

        {/* Additional content can be added here if needed */}
      </div>
    </div>
  );
}
