import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Calendar, Clock, Users, UtensilsCrossed, MapPin, Phone, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { createReservation } from '../services/reservationService';
import TableConfirmation from './TableConfirmation';

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

  const { siteContent } = useContent();

  const restaurant_id = sessionStorage.getItem("restaurant_id");


  if (!siteContent) {
    return <div>Site content not found.</div>;
  }

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
      try {
        // Create reservation data object
        const reservationData = {
          name,
          email,
          phone,
          date,
          time,
          guests: parseInt(guests),
          tableNumber: parseInt(tableNumber),
          specialRequests
        };

        // Call the API to create the reservation
        const details = await createReservation(reservationData);

        // Store reservation details for confirmation page
        setReservationDetails({
          name: details.name,
          email: details.email,
          phone: details.phone,
          date: details.date,
          time: details.time,
          guests: details.guests,
          tableNumber: details.tableNumber,
          specialRequests: details.specialRequests || ''
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
        setErrorMessage(error.message || "An error occurred");
        setSuccessMessage('');
      }
    }
  };

  // If confirmation is shown, render the TableConfirmation component
  if (showConfirmation) {
    return <TableConfirmation reservationDetails={reservationDetails} />;
  }

  return (
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
        
        <Navigation />

        <div className="relative z-10 container mx-auto px-6 h-[calc(50vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6 ">
              <UtensilsCrossed className="w-16 h-16 text-yellow-400 mt-[200px]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-fade-in">
              {siteContent.reservation.header.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-1">
              {siteContent.reservation.header.description}
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
                        <span>{siteContent.reservation.form.labels.date}</span>
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
                        <span>{siteContent.reservation.form.labels.time}</span>
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
                        <span>{siteContent.reservation.form.labels.guests}</span>
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
                      <label className="block text-gray-300 font-medium mb-2">{siteContent.reservation.form.labels.name}</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder={siteContent.reservation.form.placeholders.name}
                      />
                      {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">{siteContent.reservation.form.labels.email}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder={siteContent.reservation.form.placeholders.email}
                      />
                      {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">{siteContent.reservation.form.labels.phone}</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder={siteContent.reservation.form.placeholders.phone}
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
                  <label className="block text-gray-300 font-medium mb-2">{siteContent.reservation.form.labels.specialRequests}</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-600 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    rows={4}
                    placeholder={siteContent.reservation.form.placeholders.specialRequests}
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
                  {siteContent.reservation.info.hours.weekdays.label}: {siteContent.reservation.info.hours.weekdays.time}<br />
                  {siteContent.reservation.info.hours.weekends.label}: {siteContent.reservation.info.hours.weekends.time}<br />
                  {siteContent.reservation.info.hours.sunday.label}: {siteContent.reservation.info.hours.sunday.time}
                </p>
              </div>
              <div className="text-center bg-zinc-800 p-6 rounded-xl">
                <div className="bg-zinc-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Location</h3>
                <p className="text-gray-300">
                  {siteContent.reservation.info.location.street}<br />
                  {siteContent.reservation.info.location.city}, {siteContent.reservation.info.location.state} {siteContent.reservation.info.location.zip}
                </p>
              </div>
              <div className="text-center bg-zinc-800 p-6 rounded-xl">
                <div className="bg-zinc-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Contact</h3>
                <p className="text-gray-300">
                  Phone: {siteContent.reservation.info.contact.phone}<br />
                  <span className="text-sm">{siteContent.reservation.info.note}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
