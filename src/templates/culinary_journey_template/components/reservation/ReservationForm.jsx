import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../../../context/contexts/ReservationContext';
import { useContent } from '../../../context/ContentContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { format } from 'date-fns';
import { Calendar, Clock, Users, Phone, Mail } from 'lucide-react';

export function ReservationForm({ date, time, partySize, onClose }) {
  const navigate = useNavigate();
  const { makeReservation, loading: reservationLoading, error, config, clearError } = useReservation();
  const { siteContent, loading: contentLoading } = useContent();
  
  // Combine loading states
  const loading = reservationLoading || contentLoading;
  
  // Get reservation content from siteContent
  const reservationContent = siteContent?.reservation || {
    form: {
      labels: {
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
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    special_requests: '',
    date,
    time,
    party_size: partySize
  });

  // Validation state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  if (!config) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Validate form
  const validateForm = () => {
    let isValid = true;

    // Reset all error messages
    setNameError('');
    setEmailError('');
    setPhoneError('');

    // Validate name
    if (!formData.customer_name.trim()) {
      setNameError('Please enter your name');
      isValid = false;
    }

    // Validate email
    if (config.requireEmail) {
      if (!formData.email.trim()) {
        setEmailError('Please enter your email');
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setEmailError('Please enter a valid email address');
        isValid = false;
      }
    }

    // Validate phone
    if (config.requirePhone) {
      if (!formData.phone.trim()) {
        setPhoneError('Please enter your phone number');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const reservation = await makeReservation(formData);
      if (reservation?.id) {
        navigate(`/reserve/confirmation?id=${reservation.id}`);
      }
    } catch (err) {
      console.error('Error making reservation:', err);
      // Error is already set in context
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateStr) => {
    return format(new Date(dateStr), 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-serif mb-2">Complete Your Reservation</h2>
          <div className="text-gray-600">
            <p>{formatDate(date)}</p>
            <p>{formatTime(time)} • {partySize} {partySize === 1 ? 'Guest' : 'Guests'}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formatDate(date)}
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-gray-50 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formatTime(time)}
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-gray-50 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Party Size
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={`${partySize} ${partySize === 1 ? 'Guest' : 'Guests'}`}
              disabled
              className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-gray-50 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {reservationContent.form.labels.name} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="customer_name"
            required
            value={formData.customer_name}
            onChange={handleChange}
            placeholder={reservationContent.form.placeholders.name}
            className={`w-full px-4 py-2 border ${nameError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          />
          {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {reservationContent.form.labels.email} {config.requireEmail && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                required={config.requireEmail}
                value={formData.email}
                onChange={handleChange}
                placeholder={reservationContent.form.placeholders.email}
                className={`w-full pl-10 pr-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
              />
              {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {reservationContent.form.labels.phone} {config.requirePhone && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="tel"
                name="phone"
                required={config.requirePhone}
                value={formData.phone}
                onChange={handleChange}
                placeholder={reservationContent.form.placeholders.phone}
                className={`w-full pl-10 pr-4 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
              />
              {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {reservationContent.form.labels.specialRequests}
            <span className="text-gray-500 text-xs ml-2">
              (Max {config.maxSpecialRequestLength} characters)
            </span>
          </label>
          <textarea
            name="special_requests"
            value={formData.special_requests}
            onChange={handleChange}
            maxLength={config.maxSpecialRequestLength}
            rows="4"
            placeholder={reservationContent.form.placeholders.specialRequests}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Reservation Policies</h3>
          <div className="text-sm text-gray-500 space-y-2">
            <p>• Reservations are held for {config.reservationHoldTime} minutes past the scheduled time</p>
            <p>• For parties larger than {config.maxPartySize}, please call us directly</p>
            <p>• For same-day reservations, please call us at (555) 123-4567</p>
            <p>• A confirmation email will be sent to your email address</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner className="h-5 w-5" />
                <span>Processing...</span>
              </div>
            ) : (
              'Complete Reservation'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
