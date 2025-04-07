import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Check, Calendar, Clock, Users, UtensilsCrossed, MapPin, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import { getReservation } from '../services/reservationService';

// Make sure the component is properly exported for lazy loading
const TableConfirmation = ({ reservationDetails }) => {
  const { siteContent, loading: siteContentLoading, error: siteContentError } = useSiteContent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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

  if (siteContentLoading) {
    return <div>Loading site content...</div>;
  }

  if (siteContentError) {
    return <div>Error: {siteContentError.message}</div>;
  }

  if (!siteContent) {
    return <div>Site content not found.</div>;
  }
  
  // Generate a confirmation code
  const confirmationCode = reservationDetails.id 
    ? reservationDetails.id.substring(0, 8).toUpperCase() 
    : Math.random().toString(36).substring(2, 10).toUpperCase();

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-xl">Loading reservation details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Reservation</h2>
          <p className="mb-6">{error}</p>
          <Link
            to="/reservation"
            className="bg-green-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-600 transition-colors inline-block"
          >
            Return to Reservations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      
      {/* Hero Section */}
      <div className="relative h-[40vh]">
      <Navigation />
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
            alt="Reservation confirmation background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 h-[calc(40vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <div className="bg-green-500 rounded-full p-4">
                <Check className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Reservation Confirmed!
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              We're looking forward to serving you
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Details Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 md:p-12 shadow-xl border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-600 mb-4">Your Table is Reserved</h2>
              <p className="text-gray-600 text-lg">
                A confirmation has been sent to your email. Please save this information for your records.
              </p>
              <div className="mt-4 bg-green-50 text-green-700 py-2 px-4 rounded-lg inline-block">
                Confirmation Code: <span className="font-bold">{confirmationCode}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="w-6 h-6 mr-3 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Date</h3>
                    <p className="text-gray-600">{formatDate(reservationDetails.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-6 h-6 mr-3 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Time</h3>
                    <p className="text-gray-600">{reservationDetails.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-6 h-6 mr-3 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Party Size</h3>
                    <p className="text-gray-600">{reservationDetails.guests} {reservationDetails.guests === 1 ? 'Guest' : 'Guests'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <UtensilsCrossed className="w-6 h-6 mr-3 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Table Number</h3>
                    <p className="text-gray-600">{reservationDetails.tableNumber}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Name</h3>
                    <p className="text-gray-600">{reservationDetails.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="text-gray-600">{reservationDetails.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-3 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Phone</h3>
                    <p className="text-gray-600">{reservationDetails.phone}</p>
                  </div>
                </div>
                
                {reservationDetails.specialRequests && (
                  <div className="flex items-start">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1 text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Special Requests</h3>
                      <p className="text-gray-600">{reservationDetails.specialRequests}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-3 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">Restaurant Location</h3>
                    <p className="text-gray-600">
                      {siteContent.reservation.info.location.street}<br />
                      {siteContent.reservation.info.location.city}, {siteContent.reservation.info.location.state} {siteContent.reservation.info.location.zip}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Need to make changes to your reservation? Please contact us at {siteContent.reservation.info.contact.phone}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Link to="/menu" className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition text-lg font-medium flex items-center justify-center">
                    View Menu
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  
                  <Link to="/" className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition text-lg font-medium flex items-center justify-center">
                    Return to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TableConfirmation;
