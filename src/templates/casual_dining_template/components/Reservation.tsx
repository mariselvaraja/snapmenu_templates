import React, { useState } from 'react';
import { Calendar, Clock, Users, UtensilsCrossed, MapPin, Phone, ArrowRight } from 'lucide-react';
import axios from 'axios';
import TableConfirmation from './TableConfirmation';
import { useAppSelector } from '../../../common/redux';

export default function Reservation() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [occasion, setOccasion] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [guestsError, setGuestsError] = useState('');
  const [tableNumberError, setTableNumberError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const reservation = siteContent?.reservation || {
    header: {
      title: "Reserve a Table",
      description: "Book your table online and enjoy a seamless dining experience with us."
    },
    form: {
      labels: {
        date: "Date",
        time: "Time",
        guests: "Number of Guests",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        specialRequests: "Special Requests"
      },
      placeholders: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        specialRequests: "Let us know if you have any special requests or dietary restrictions..."
      }
    },
    info: {
      hours: {
        weekdays: { label: "Monday - Friday", time: "11:00 AM - 10:00 PM" },
        weekends: { label: "Saturday", time: "10:00 AM - 11:00 PM" },
        sunday: { label: "Sunday", time: "10:00 AM - 9:00 PM" }
      },
      location: {
        street: "123 Restaurant Street",
        city: "New York",
        state: "NY",
        zip: "10001"
      },
      contact: {
        phone: "+1 (555) 123-4567"
      },
      note: "For parties larger than 10, please call us directly."
    }
  };

  const restaurant_id = sessionStorage.getItem("restaurant_id") || "1";

  const api = "http://localhost:5093";

  const occasions = [
    "Birthday",
    "Anniversary",
    "Business Dinner",
    "Date Night",
    "Family Gathering",
    "Other"
  ];

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

    if (!tableNumber) {
      setTableNumberError('Please enter a table number');
      isValid = false;
    } else {
      setTableNumberError('');
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

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationDetails, setReservationDetails] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 0,
    tableNumber: 0,
    specialRequests: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit the form
      const payload = {
        "user_id": Math.floor(Math.random() * 1000), // Randomly generated user ID
        "restaurant_id": restaurant_id,
        "table_id": parseInt(tableNumber),
        "reservation_time": time,
        "party_size": parseInt(guests),
        "customer_name": name,
        "customer_email": email,
        "customer_phone": phone,
        "notes": specialRequests
      };

      try {
        const response = await axios.post(api + '/table/reservations', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Store reservation details for confirmation page
        setReservationDetails({
          name,
          email,
          phone,
          date,
          time,
          guests: parseInt(guests),
          tableNumber: parseInt(tableNumber),
          specialRequests
        });

        // Show confirmation component
        setShowConfirmation(true);

        setSuccessMessage('Reservation submitted successfully!');
        setErrorMessage('');
        
        // Clear the form fields (will only matter if user navigates back)
        setDate('');
        setTime('');
        setGuests('2');
        setOccasion('');
        setTableNumber('');
        setName('');
        setEmail('');
        setPhone('');
        setSpecialRequests('');
      } catch (error: any) {
        setErrorMessage(error.response?.data?.detail?.[0]?.msg || error.message || "An error occurred");
        setSuccessMessage('');
      }
    }
  };

  // If confirmation is shown, render the TableConfirmation component
  if (showConfirmation) {
    return <TableConfirmation reservationDetails={reservationDetails} />;
  }

  return (
    <>
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[50vh]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
            alt="Reservation background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
        </div>
        
        

        <div className="relative z-10 container mx-auto px-6 h-[calc(50vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6 ">
              <UtensilsCrossed className="w-16 h-16 text-yellow-400 mt-[200px]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-fade-in">
              {reservation?.header?.title || "Reserve a Table"}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-1">
              {reservation?.header?.description || "Book your table online and enjoy a seamless dining experience with us."}
            </p>
          </div>
        </div>
      </div>

      {/* Reservation Form Section */}
      <section className="py-24 px-6 bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-800 rounded-2xl p-8 md:p-12 shadow-xl">
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 mr-2 text-yellow-400" />
                        <span>{reservation?.form?.labels?.date || "Date"}</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                        <span>{reservation?.form?.labels?.time || "Time"}</span>
                      </div>
                    </label>
                    <select
                      value={time}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTime(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
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
                    <label className="block text-gray-300 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Users className="w-5 h-5 mr-2 text-yellow-400" />
                        <span>{reservation?.form?.labels?.guests || "Number of Guests"}</span>
                      </div>
                    </label>
                    <select
                      value={guests}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGuests(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                      <option value="more">More than 10 guests</option>
                    </select>
                    {guestsError && <p className="text-red-500 text-sm">{guestsError}</p>}
                  </div>

                  {/* Occasion */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 mr-2 text-yellow-400" />
                        <span>Special Occasion</span>
                      </div>
                    </label>
                    <select
                      value={occasion}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOccasion(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      <option value="">Select occasion (optional)</option>
                      {occasions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* Table Number */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <UtensilsCrossed className="w-5 h-5 mr-2 text-yellow-400" />
                        <span>Table Number</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={tableNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTableNumber(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Enter table number"
                    />
                    {tableNumberError && <p className="text-red-500 text-sm">{tableNumberError}</p>}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-yellow-400">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">{reservation?.form?.labels?.name || "Full Name"}</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder={reservation?.form?.placeholders?.name || "John Doe"}
                      />
                      {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">{reservation?.form?.labels?.email || "Email Address"}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder={reservation?.form?.placeholders?.email || "john@example.com"}
                      />
                      {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">{reservation?.form?.labels?.phone || "Phone Number"}</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder={reservation?.form?.placeholders?.phone || "+1 (555) 123-4567"}
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
                  <label className="block text-gray-300 font-medium mb-2">{reservation?.form?.labels?.specialRequests || "Special Requests"}</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    rows={4}
                    placeholder={reservation?.form?.placeholders?.specialRequests || "Let us know if you have any special requests or dietary restrictions..."}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-black py-4 rounded-full hover:bg-yellow-300 transition text-lg font-medium flex items-center justify-center"
                >
                  Confirm Reservation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Additional Information */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center bg-zinc-800 p-6 rounded-xl">
                <div className="bg-zinc-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Opening Hours</h3>
                <p className="text-gray-300">
                  {reservation?.info?.hours?.weekdays?.label || "Monday - Friday"}: {reservation?.info?.hours?.weekdays?.time || "11:00 AM - 10:00 PM"}<br />
                  {reservation?.info?.hours?.weekends?.label || "Saturday"}: {reservation?.info?.hours?.weekends?.time || "10:00 AM - 11:00 PM"}<br />
                  {reservation?.info?.hours?.sunday?.label || "Sunday"}: {reservation?.info?.hours?.sunday?.time || "10:00 AM - 9:00 PM"}
                </p>
              </div>
              <div className="text-center bg-zinc-800 p-6 rounded-xl">
                <div className="bg-zinc-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Location</h3>
                <p className="text-gray-300">
                  {reservation?.info?.location?.street || "123 Restaurant Street"}<br />
                  {reservation?.info?.location?.city || "New York"}, {reservation?.info?.location?.state || "NY"} {reservation?.info?.location?.zip || "10001"}
                </p>
              </div>
              <div className="text-center bg-zinc-800 p-6 rounded-xl">
                <div className="bg-zinc-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Contact</h3>
                <p className="text-gray-300">
                  Phone: {reservation?.info?.contact?.phone || "+1 (555) 123-4567"}<br />
                  <span className="text-sm">{reservation?.info?.note || "For parties larger than 10, please call us directly."}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
