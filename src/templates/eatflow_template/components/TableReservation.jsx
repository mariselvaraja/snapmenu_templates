import React, { useState } from 'react';
import { Calendar, Clock, Users, UtensilsCrossed, MapPin, Phone } from 'lucide-react';

/**
 * TableReservation component for handling table booking
 * @param {Object} props - Component props
 * @param {Function} props.onBookingComplete - Callback when booking is completed
 * @param {string} props.initialDate - Initial date value
 * @param {string} props.initialTime - Initial time value
 * @param {Object} props.reservationContent - Content for the reservation form
 */
export function TableReservation({ onBookingComplete, initialDate, initialTime, reservationContent }) {
  const [date, setDate] = useState(initialDate || '');
  const [time, setTime] = useState(initialTime || '');
  const [guests, setGuests] = useState('2');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [guestsError, setGuestsError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const availableTimes = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM"
  ];

  const validateForm = () => {
    let isValid = true;

    if (!date) {
      setDateError('Please select a date');
      isValid = false;
    } else {
      setDateError('');
    }

    if (!time) {
      setTimeError('Please select a time');
      isValid = false;
    } else {
      setTimeError('');
    }

    if (!guests) {
      setGuestsError('Please select the number of guests');
      isValid = false;
    } else {
      setGuestsError('');
    }

    if (!name) {
      setNameError('Please enter your name');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!phone) {
      setPhoneError('Please enter your phone number');
      isValid = false;
    } else {
      setPhoneError('');
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Create booking data object
      const bookingData = {
        name,
        email,
        phone,
        date,
        time,
        partySize: parseInt(guests),
        specialRequests
      };

      // Call the onBookingComplete callback with the booking data
      onBookingComplete(bookingData);

      setSuccessMessage('Reservation submitted successfully!');
      setErrorMessage('');
      
      // Clear the form fields
      setDate(initialDate || '');
      setTime(initialTime || '');
      setGuests('2');
      setName('');
      setEmail('');
      setPhone('');
      setSpecialRequests('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
            alt="Reservation background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 h-[calc(50vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <UtensilsCrossed className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-8">
              {reservationContent?.header?.title || "Reserve a Table"}
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {reservationContent?.header?.description || "Book your dining experience with us"}
            </p>
          </div>
        </div>
      </div>

      {/* Reservation Form Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                        <span>{reservationContent?.form?.labels?.date || "Date"}</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 mr-2 text-green-600" />
                        <span>{reservationContent?.form?.labels?.time || "Time"}</span>
                      </div>
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select a time</option>
                      {availableTimes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
                  </div>

                  {/* Number of Guests */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Users className="w-5 h-5 mr-2 text-green-600" />
                        <span>{reservationContent?.form?.labels?.guests || "Number of Guests"}</span>
                      </div>
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                      <option value="more">More than 10 guests</option>
                    </select>
                    {guestsError && <p className="text-red-500 text-sm">{guestsError}</p>}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">{reservationContent?.form?.labels?.name || "Name"}</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={reservationContent?.form?.placeholders?.name || "Your full name"}
                      />
                      {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">{reservationContent?.form?.labels?.email || "Email"}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={reservationContent?.form?.placeholders?.email || "your@email.com"}
                      />
                      {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">{reservationContent?.form?.labels?.phone || "Phone"}</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={reservationContent?.form?.placeholders?.phone || "(123) 456-7890"}
                      />
                      {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                    </div>
                  </div>
                  {errorMessage && (
                    <div className="bg-red-200 text-red-800 p-3 rounded">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="bg-green-200 text-green-800 p-3 rounded">
                      {successMessage}
                    </div>
                  )}
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">{reservationContent?.form?.labels?.specialRequests || "Special Requests"}</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                    placeholder={reservationContent?.form?.placeholders?.specialRequests || "Any special requests or dietary restrictions?"}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 transition text-lg font-medium"
                >
                  Confirm Reservation
                </button>
              </form>
            </div>

            {/* Additional Information */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
                <p className="text-gray-600">
                  {reservationContent?.info?.hours?.weekdays?.label || "Monday - Thursday"}: {reservationContent?.info?.hours?.weekdays?.time || "5:00 PM - 10:00 PM"}<br />
                  {reservationContent?.info?.hours?.weekends?.label || "Friday - Saturday"}: {reservationContent?.info?.hours?.weekends?.time || "5:00 PM - 11:00 PM"}<br />
                  {reservationContent?.info?.hours?.sunday?.label || "Sunday"}: {reservationContent?.info?.hours?.sunday?.time || "5:00 PM - 9:00 PM"}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p className="text-gray-600">
                  {reservationContent?.info?.location?.street || "123 Main Street"}<br />
                  {reservationContent?.info?.location?.city || "New York"}, {reservationContent?.info?.location?.state || "NY"} {reservationContent?.info?.location?.zip || "10001"}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Contact</h3>
                <p className="text-gray-600">
                  Phone: {reservationContent?.info?.contact?.phone || "(212) 555-1234"}<br />
                  <span className="text-sm">{reservationContent?.info?.note || "Reservations recommended. Please call us for parties of 6 or more."}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
