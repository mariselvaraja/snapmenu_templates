import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Check, Phone, Mail, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useSiteContent } from '../context/SiteContentContext';
import { getReservation } from '../services/reservationService';

interface TableConfirmationProps {
  reservationDetails: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    tableNumber?: number;
    specialRequests?: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
    createdAt?: string;
  };
}

const TableConfirmation: React.FC<TableConfirmationProps> = ({ reservationDetails }) => {
  const { reservation } = useSiteContent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // If the component receives an ID but not full details, fetch the details
  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (reservationDetails.id && !reservationDetails.name) {
        try {
          setLoading(true);
          const details = await getReservation(reservationDetails.id);
          // Update the reservationDetails with the fetched data
          // In a real app, you might use a state setter or Redux action here
          Object.assign(reservationDetails, details);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching reservation details:', err);
          setError('Failed to load reservation details. Please try again.');
          setLoading(false);
        }
      }
    };
    
    fetchReservationDetails();
  }, [reservationDetails]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString; // fallback to original format
    }
  };

  // Format time for display (convert 24h to 12h format)
  const formatTime = (timeString: string) => {
    try {
      // Handle different time formats
      let hours, minutes;
      
      if (timeString.includes(':')) {
        [hours, minutes] = timeString.split(':').map(Number);
      } else {
        // Handle numeric time format (e.g. "1700")
        const timeNum = parseInt(timeString);
        hours = Math.floor(timeNum / 100);
        minutes = timeNum % 100;
      }
      
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch (err) {
      console.error('Error formatting time:', err);
      return timeString; // fallback to original format
    }
  };

  // Use the ID as the confirmation code if available, otherwise generate one
  const confirmationCode = reservationDetails.id 
    ? reservationDetails.id.substring(0, 8).toUpperCase() 
    : Math.random().toString(36).substring(2, 10).toUpperCase();

  if (loading) {
    return (
      <div className="py-20 bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl">Loading reservation details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-20 bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Reservation</h2>
          <p className="mb-6">{error}</p>
          <Link
            to="/reservation"
            className="bg-red-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-600 transition-colors inline-block"
          >
            Return to Reservations
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-6">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Reservation Confirmed!</h1>
          <p className="text-xl text-gray-300">
            We're looking forward to serving you the best pizza in town.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900 rounded-xl p-8 shadow-xl border border-gray-800 mb-10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <Calendar className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Date</h3>
                  <p className="text-gray-300">{formatDate(reservationDetails.date)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Time</h3>
                  <p className="text-gray-300">{formatTime(reservationDetails.time)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Party Size</h3>
                  <p className="text-gray-300">{reservationDetails.guests} {reservationDetails.guests === 1 ? 'Guest' : 'Guests'}</p>
                </div>
              </div>

              {reservationDetails.tableNumber && (
                <div className="flex items-start">
                  <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Table Number</h3>
                    <p className="text-gray-300">{reservationDetails.tableNumber}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Name</h3>
                  <p className="text-gray-300">{reservationDetails.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Email</h3>
                  <p className="text-gray-300">{reservationDetails.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Phone</h3>
                  <p className="text-gray-300">{reservationDetails.phone}</p>
                </div>
              </div>
              
              {reservationDetails.specialRequests && (
                <div className="flex items-start">
                  <FileText className="w-6 h-6 mr-3 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Special Requests</h3>
                    <p className="text-gray-300">{reservationDetails.specialRequests}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 mt-8">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Confirmation Code</div>
              <div className="font-mono text-xl text-red-500 font-bold">{confirmationCode}</div>
              <p className="text-sm text-gray-400 mt-2">
                A confirmation email has been sent to {reservationDetails.email}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-900 rounded-xl p-8 shadow-xl border border-gray-800 mb-10"
        >
          <h3 className="text-xl font-semibold mb-4 text-red-500">Restaurant Information</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Address</h4>
              <p className="text-gray-300">
                {reservation.info.location.street}<br />
                {reservation.info.location.city}, {reservation.info.location.state} {reservation.info.location.zip}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Contact</h4>
              <p className="text-gray-300">
                Phone: {reservation.info.contact.phone}<br />
                <span className="text-sm">{reservation.info.note}</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Hours</h4>
              <p className="text-gray-300">
                {reservation.info.hours.weekdays.label}: {reservation.info.hours.weekdays.time}<br />
                {reservation.info.hours.weekends.label}: {reservation.info.hours.weekends.time}<br />
                {reservation.info.hours.sunday.label}: {reservation.info.hours.sunday.time}
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
            className="bg-red-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            View Our Menu
          </Link>
          
          <Link
            to="/"
            className="bg-gray-800 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return Home
          </Link>
          
          <button
            onClick={() => window.print()}
            className="bg-gray-800 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            Print Confirmation
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TableConfirmation;
