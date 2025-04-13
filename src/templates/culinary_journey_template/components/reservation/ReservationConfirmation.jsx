import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Calendar, Clock, Users, Check, Phone, Mail, FileText, ArrowLeft } from 'lucide-react';
import { useReservation } from '../../context/contexts/ReservationContext';
import { to12Hour } from '../utils/timeUtils';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { motion } from 'framer-motion';

function formatTimeWithFallback(time) {
  try {
    console.log('Attempting to format time:', time);
    const formatted = to12Hour(time);
    console.log('Successfully formatted time:', formatted);
    return formatted;
  } catch (err) {
    console.error('Error formatting time:', err);
    return time; // fallback to original format
  }
}

export function ReservationConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getReservation } = useReservation();
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const reservationId = searchParams.get('id');
    if (!reservationId) {
      navigate('/reserve');
      return;
    }

    const loadReservation = async () => {
      try {
        setLoading(true);
        const data = await getReservation(reservationId);
        if (!data) {
          throw new Error('Reservation not found');
        }
        console.log('Loaded reservation:', data);
        setReservation(data);
      } catch (err) {
        console.error('Error loading reservation:', err);
        setError(err.message || 'Failed to load reservation');
      } finally {
        setLoading(false);
      }
    };

    loadReservation();
  }, [navigate, searchParams, getReservation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h1 className="text-2xl font-serif text-red-600 mb-4">Error Loading Reservation</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/reserve')}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Make New Reservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return null;
  }

  const formatDate = (dateString) => {
    try {
      console.log('Attempting to format date:', dateString);
      const formatted = new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      console.log('Successfully formatted date:', formatted);
      return formatted;
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString; // fallback to original format
    }
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full mb-6">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Reservation Confirmed!</h1>
          <p className="text-xl text-gray-600">
            We're looking forward to serving you a culinary journey to remember.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <Calendar className="w-6 h-6 mr-3 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Date</h3>
                  <p className="text-gray-600">{formatDate(reservation.reservation_date)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-6 h-6 mr-3 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Time</h3>
                  <p className="text-gray-600">{formatTimeWithFallback(reservation.reservation_time)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="w-6 h-6 mr-3 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Party Size</h3>
                  <p className="text-gray-600">
                    {reservation.party_size} {reservation.party_size === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1 text-orange-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Name</h3>
                  <p className="text-gray-600">{reservation.customer_name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-6 h-6 mr-3 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">{reservation.customer_email || reservation.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-6 h-6 mr-3 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                  <p className="text-gray-600">{reservation.customer_phone || reservation.phone}</p>
                </div>
              </div>
              
              {reservation.special_requests && (
                <div className="flex items-start">
                  <FileText className="w-6 h-6 mr-3 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Special Requests</h3>
                    <p className="text-gray-600">{reservation.special_requests}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Confirmation Code</div>
              <div className="font-mono text-xl text-orange-500 font-bold">{reservation.id.slice(0, 8).toUpperCase()}</div>
              <p className="text-sm text-gray-500 mt-2">
                A confirmation email has been sent to {reservation.customer_email || reservation.email}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-10"
        >
          <h3 className="text-xl font-semibold mb-4 text-orange-500">Restaurant Information</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Address</h4>
              <p className="text-gray-600">
                123 Culinary Street<br />
                Foodie City, FC 12345
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Contact</h4>
              <p className="text-gray-600">
                Phone: (555) 123-4567<br />
                <span className="text-sm">Please call if you need to modify your reservation</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Hours</h4>
              <p className="text-gray-600">
                Monday - Thursday: 11:30 AM - 10:00 PM<br />
                Friday - Saturday: 11:30 AM - 11:00 PM<br />
                Sunday: 11:30 AM - 9:00 PM
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
        >
          <Link
            to="/menu"
            className="bg-orange-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
          >
            View Our Menu
          </Link>
          
          <Link
            to="/"
            className="bg-gray-200 text-gray-800 py-3 px-8 rounded-full font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return Home
          </Link>
          
          <button
            onClick={() => window.print()}
            className="bg-gray-200 text-gray-800 py-3 px-8 rounded-full font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            Print Confirmation
          </button>
        </motion.div>
      </div>
    </div>
  );
}
