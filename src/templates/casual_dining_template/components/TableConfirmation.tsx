import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Check, Calendar, Clock, Users, UtensilsCrossed, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

interface TableConfirmationProps {
  reservationDetails: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    tableNumber: number;
    specialRequests?: string;
  };
}

const TableConfirmation: React.FC<TableConfirmationProps> = ({ reservationDetails }) => {
  const { siteContent } = useContent();

  if (!siteContent) {
    return <div>Site content not found.</div>;
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
                <Navigation />
      {/* Hero Section */}
      <div className="relative h-[40vh]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
            alt="Reservation confirmation background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
        </div>
        


        <div className="relative z-10 container mx-auto px-6 h-[calc(40vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6 py-10">
              {/* <div className="bg-green-500 rounded-full p-4">
                <Check className="w-12 h-12 text-white" />
              </div> */}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              Reservation Confirmed!
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay-1">
              We're looking forward to serving you
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Details Section */}
      <section className="py-16 px-6 bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-800 rounded-2xl p-8 md:p-12 shadow-xl border border-zinc-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">Your Table is Reserved</h2>
              <p className="text-gray-300 text-lg">
                A confirmation has been sent to your email. Please save this information for your records.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Date</h3>
                    <p className="text-gray-300">{formatDate(reservationDetails.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Time</h3>
                    <p className="text-gray-300">{reservationDetails.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Party Size</h3>
                    <p className="text-gray-300">{reservationDetails.guests} {reservationDetails.guests === 1 ? 'Guest' : 'Guests'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <UtensilsCrossed className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Table Number</h3>
                    <p className="text-gray-300">{reservationDetails.tableNumber}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1 text-yellow-400">
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
                  <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1 text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <p className="text-gray-300">{reservationDetails.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Phone</h3>
                    <p className="text-gray-300">{reservationDetails.phone}</p>
                  </div>
                </div>
                
                {reservationDetails.specialRequests && (
                  <div className="flex items-start">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1 text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Special Requests</h3>
                      <p className="text-gray-300">{reservationDetails.specialRequests}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-zinc-700 pt-8 mt-8">
              <div className="bg-zinc-700 p-6 rounded-xl mb-8">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Restaurant Location</h3>
                    <p className="text-gray-300">
                      {siteContent.reservation.info.location.street}<br />
                      {siteContent.reservation.info.location.city}, {siteContent.reservation.info.location.state} {siteContent.reservation.info.location.zip}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-gray-300">
                  Need to make changes to your reservation? Please contact us at {siteContent.reservation.info.contact.phone}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Link to="/menu" className="bg-yellow-400 text-black py-3 px-6 rounded-full hover:bg-yellow-300 transition text-lg font-medium flex items-center justify-center">
                    View Menu
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  
                  <Link to="/" className="bg-zinc-700 text-white py-3 px-6 rounded-full hover:bg-zinc-600 transition text-lg font-medium flex items-center justify-center">
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
