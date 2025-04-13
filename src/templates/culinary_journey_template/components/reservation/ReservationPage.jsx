import React, { useState, useEffect } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { Calendar, Clock, Users, Phone, Mail, FileText, UtensilsCrossed, MapPin } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useReservation } from '../../../context/contexts/ReservationContext';
import { useContent } from '../../../context/ContentContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ReservationPage error:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Reservation System</h2>
                <p className="text-gray-600">
                  {typeof this.state.error === 'string' 
                    ? this.state.error 
                    : this.state.error?.message || 'An unexpected error occurred'}
                </p>
                <p className="mt-4 text-gray-600">Please try again later or contact us directly at (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function ReservationPageContent() {
  const navigate = useNavigate();
  const { makeReservation, loading: reservationLoading, error: reservationError, config } = useReservation();
  const { siteContent, loading: contentLoading } = useContent();
  
  // Combine loading and error states
  const loading = reservationLoading || contentLoading;
  const error = reservationError;
  
  // Get reservation content from siteContent
  const reservationContent = siteContent?.reservation || {
    header: {
      title: "Reserve Your Table",
      description: "Join us for an unforgettable dining experience"
    },
    info: {
      hours: {
        weekdays: { label: "Monday - Thursday", time: "5:00 PM - 10:00 PM" },
        weekends: { label: "Friday - Saturday", time: "5:00 PM - 11:00 PM" },
        sunday: { label: "Sunday", time: "5:00 PM - 9:00 PM" }
      }
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

  // Form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Validation state
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [guestsError, setGuestsError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Available time slots
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Create reservation data object
        const reservationData = {
          customer_name: name,
          email,
          phone,
          reservation_date: date,
          reservation_time: time,
          party_size: parseInt(guests),
          special_requests: specialRequests
        };

        // Call the API to create the reservation
        const result = await makeReservation(reservationData);

        if (result?.id) {
          navigate(`/reserve/confirmation?id=${result.id}`);
        }

        setSuccessMessage('Reservation submitted successfully!');
        setErrorMessage('');
        
        // Clear the form fields
        setDate('');
        setTime('');
        setGuests('2');
        setName('');
        setEmail('');
        setPhone('');
        setSpecialRequests('');
      } catch (err) {
        setErrorMessage(err.message || "An error occurred");
        setSuccessMessage('');
      }
    }
  };

  // Show loading state
  if (loading || !config) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Reservation System</h2>
              <p className="text-gray-600">
                {typeof error === 'string' ? error : 'An unexpected error occurred'}
              </p>
              <p className="mt-4 text-gray-600">Please try again later or contact us directly at (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">{reservationContent.header.title}</h1>
          <p className="text-xl text-gray-600">
            {reservationContent.header.description}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-10"
          >
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                      <span>{reservationContent.form.labels.date}</span>
                    </div>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 mr-2 text-orange-500" />
                      <span>{reservationContent.form.labels.time}</span>
                    </div>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a time</option>
                    {availableTimes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {timeError && <p className="text-red-500 text-sm mt-1">{timeError}</p>}
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <div className="flex items-center mb-2">
                      <Users className="w-5 h-5 mr-2 text-orange-500" />
                      <span>{reservationContent.form.labels.guests}</span>
                    </div>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                    <option value="more">More than 10 guests</option>
                  </select>
                  {guestsError && <p className="text-red-500 text-sm mt-1">{guestsError}</p>}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{reservationContent.form.labels.name}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={reservationContent.form.placeholders.name}
                    />
                    {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{reservationContent.form.labels.email}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={reservationContent.form.placeholders.email}
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{reservationContent.form.labels.phone}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={reservationContent.form.placeholders.phone}
                    />
                    {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                  </div>
                </div>
                {errorMessage && (
                  <div className="bg-red-100 text-red-800 p-3 rounded">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-100 text-green-800 p-3 rounded">
                    {successMessage}
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">{reservationContent.form.labels.specialRequests}</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={4}
                  placeholder={reservationContent.form.placeholders.specialRequests}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition text-lg font-medium"
              >
                Confirm Reservation
              </button>
            </form>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 grid md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
              <p className="text-gray-600">
                {reservationContent.info.hours.weekdays.label}: {reservationContent.info.hours.weekdays.time}<br />
                {reservationContent.info.hours.weekends.label}: {reservationContent.info.hours.weekends.time}<br />
                {reservationContent.info.hours.sunday.label}: {reservationContent.info.hours.sunday.time}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-600">
                123 Culinary Street<br />
                New York, NY 10001
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contact</h3>
              <p className="text-gray-600">
                Phone: (555) 123-4567<br />
                <span className="text-sm">For parties larger than 8, please call us directly</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function ReservationPage() {
  return (
    <ErrorBoundary>
      <ReservationPageContent />
    </ErrorBoundary>
  );
}
