import React, { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, Mail, Loader2 } from 'lucide-react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setReservation, setReservationError, setReservationLoading, ReservationDetails } from '../reservationSlice';
import { createReservation } from '../services/reservationService';
import TableConfirmation from '../components/TableConfirmation';

export default function Reservation() {
  // Get reservation data directly from useRootSiteContent
  const { siteContent } = useRootSiteContent();
  
  // Default reservation data
  const defaultReservation = {
    header: {
      title: "Reserve Your Table",
      description: "Join us for an unforgettable dining experience"
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
        street: "123 Pizza Street",
        area: "Downtown",
        city: "New York",
        state: "NY",
        zip: "10001"
      },
      contact: {
        phone: "(212) 555-0123"
      },
      note: "For parties larger than 8, please call us directly to arrange your reservation."
    },
    form: {
      labels: {
        date: "Select Date",
        time: "Select Time",
        guests: "Number of Guests",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        specialRequests: "Special Requests"
      },
      placeholders: {
        name: "Enter your full name",
        email: "Enter your email address",
        phone: "Enter your phone number",
        specialRequests: "Any dietary restrictions or special occasions?"
      }
    }
  };
  
  // Use reservation data from siteContent with fallback to default
  const reservation = (siteContent as any)?.reservation || defaultReservation;
  const dispatch = useDispatch();
  const { loading = false, error = null } = useSelector((state: RootState) => state.reservation || {});
  
  // Form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [tableNumber, setTableNumber] = useState('1'); // Default table number
  
  // Validation state
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  // Confirmation state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails | null>(null);

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // Available time slots
  const timeSlots = [
    { value: "11:00", label: "11:00 AM" },
    { value: "11:30", label: "11:30 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "12:30", label: "12:30 PM" },
    { value: "13:00", label: "1:00 PM" },
    { value: "13:30", label: "1:30 PM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "14:30", label: "2:30 PM" },
    { value: "17:00", label: "5:00 PM" },
    { value: "17:30", label: "5:30 PM" },
    { value: "18:00", label: "6:00 PM" },
    { value: "18:30", label: "6:30 PM" },
    { value: "19:00", label: "7:00 PM" },
    { value: "19:30", label: "7:30 PM" },
    { value: "20:00", label: "8:00 PM" },
    { value: "20:30", label: "8:30 PM" },
    { value: "21:00", label: "9:00 PM" }
  ];

  // Validate form
  const validateForm = () => {
    let isValid = true;

    // Reset all error messages
    setDateError('');
    setTimeError('');
    setNameError('');
    setEmailError('');
    setPhoneError('');

    // Validate date
    if (!date) {
      setDateError('Please select a date');
      isValid = false;
    }

    // Validate time
    if (!time) {
      setTimeError('Please select a time');
      isValid = false;
    }

    // Validate name
    if (!name.trim()) {
      setNameError('Please enter your name');
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError('Please enter your phone number');
      isValid = false;
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(setReservationLoading());

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

      // Store in Redux
      dispatch(setReservation(details));
      
      // Store for confirmation component
      setReservationDetails(details);
      
      // Show confirmation
      setShowConfirmation(true);
      
      // Reset form (not needed since we're showing confirmation)
      // resetForm();
    } catch (err) {
      console.error('Error creating reservation:', err);
      dispatch(setReservationError('Failed to create reservation. Please try again.'));
    }
  };

  // Reset form fields
  const resetForm = () => {
    setDate('');
    setTime('');
    setGuests('2');
    setName('');
    setEmail('');
    setPhone('');
    setSpecialRequests('');
    setTableNumber('1');
    
    // Reset errors
    setDateError('');
    setTimeError('');
    setNameError('');
    setEmailError('');
    setPhoneError('');
  };

  // If showing confirmation, render the TableConfirmation component
  if (showConfirmation && reservationDetails) {
    return <TableConfirmation reservationDetails={reservationDetails} />;
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">{reservation.header.title}</h1>
          <p className="text-xl text-gray-600">
            {reservation.header.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Reservation Details</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {reservation.form.labels.date}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                      min={today}
                      className={`w-full pl-10 pr-4 py-2 border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                    />
                    {dateError && <p className="mt-1 text-sm text-red-600">{dateError}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {reservation.form.labels.time}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={time}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setTime(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border ${timeError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    {timeError && <p className="mt-1 text-sm text-red-600">{timeError}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {reservation.form.labels.guests}
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={guests}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setGuests(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {reservation.form.labels.name}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder={reservation.form.placeholders.name}
                    className={`w-full px-4 py-2 border ${nameError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                  />
                  {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {reservation.form.labels.phone}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                      placeholder={reservation.form.placeholders.phone}
                      className={`w-full pl-10 pr-4 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                    />
                    {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {reservation.form.labels.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder={reservation.form.placeholders.email}
                    className={`w-full pl-10 pr-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                  />
                  {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {reservation.form.labels.specialRequests}
                </label>
                <textarea
                  rows={4}
                  value={specialRequests}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder={reservation.form.placeholders.specialRequests}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  'Book Table'
                )}
              </button>
            </form>
          </motion.div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-6">Reservation Information</h2>
              <div className="prose prose-lg">
                <p className="text-gray-600">
                  We're excited to host you at Pizza Planet! Please note the following:
                </p>
                <ul className="space-y-4 mt-4">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Reservations are recommended for parties of all sizes
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    For parties larger than 10, please call us directly
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    We hold reservations for 15 minutes past the booking time
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Special requests are accommodated based on availability
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Hours of Operation</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>{reservation.info.hours.weekdays.label}:</span>
                  <span>{reservation.info.hours.weekdays.time}</span>
                </p>
                <p className="flex justify-between">
                  <span>{reservation.info.hours.weekends.label}:</span>
                  <span>{reservation.info.hours.weekends.time}</span>
                </p>
                <p className="flex justify-between">
                  <span>{reservation.info.hours.sunday.label}:</span>
                  <span>{reservation.info.hours.sunday.time}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Private Events</h3>
              <p className="text-gray-600 mb-4">
                Looking to host a private event? We offer special packages for:
              </p>
              <ul className="space-y-2">
                <li>• Birthday Parties</li>
                <li>• Corporate Events</li>
                <li>• Wedding Rehearsals</li>
                <li>• Special Celebrations</li>
              </ul>
              <button 
                onClick={() => window.location.href = 'mailto:events@pizzaplanet.com?subject=Private Event Inquiry'}
                className="mt-6 w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                Inquire About Private Events
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
