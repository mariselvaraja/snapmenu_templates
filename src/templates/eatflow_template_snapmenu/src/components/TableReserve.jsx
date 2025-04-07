import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Calendar, Clock, Users, UtensilsCrossed, MapPin, Phone } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { createReservation } from '../services/reservationService';
import TableConfirmation from '../components/TableConfirmation';

// Define constants outside the component to avoid recreating them on each render
const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Business Dinner",
  "Date Night",
  "Family Gathering",
  "Other"
];

const AVAILABLE_TIMES = [
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

// Refactored component with consistent hook calls
const TableReserve = () => {
  // Group related state together
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '2',
    occasion: '',
    tableNumber: '',
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  // Group form validation errors
  const [formErrors, setFormErrors] = useState({
    date: '',
    time: '',
    guests: '',
    tableNumber: '',
    name: '',
    email: '',
    phone: ''
  });

  const api = "https://appliance.genaiembed.ai/p5093";

  // Status messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Confirmation state
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

  // Get site content
  const { siteContent, loading, error } = useSiteContent();
  const restaurant_id = sessionStorage.getItem("restaurant_id");

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Form validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };

    if (!formData.date) {
      newErrors.date = 'Please select a date';
      isValid = false;
    } else {
      newErrors.date = '';
    }

    if (!formData.time) {
      newErrors.time = 'Please select a time';
      isValid = false;
    } else {
      newErrors.time = '';
    }

    if (!formData.guests) {
      newErrors.guests = 'Please select the number of guests';
      isValid = false;
    } else {
      newErrors.guests = '';
    }

    if (!formData.tableNumber) {
      newErrors.tableNumber = 'Please enter a table number';
      isValid = false;
    } else {
      newErrors.tableNumber = '';
    }

    if (!formData.name) {
      newErrors.name = 'Please enter your name';
      isValid = false;
    } else {
      newErrors.name = '';
    }

    if (!formData.email) {
      newErrors.email = 'Please enter your email';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    if (!formData.phone) {
      newErrors.phone = 'Please enter your phone number';
      isValid = false;
    } else {
      newErrors.phone = '';
    }

    setFormErrors(newErrors);
    return isValid;
  };

  // Loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!siteContent) {
    return <div>Site content not found.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Create reservation data object
        const reservationData = {
          restaurant_id: sessionStorage.getItem('rid'), // Assuming restaurant_id is available
          table_id: formData.tableNumber,
          reservation_time: `${formData.date} ${formData.time}`,
          party_size: parseInt(formData.guests),
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          notes: formData.specialRequests
        };

        console.log("Reservation Payload:", reservationData); // Log payload

        // Call the API to create the reservation using fetch
        const response = await fetch(api+'/table/reservations', { // Replace '/reservations' with your actual API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData),
        });

        if (!response.ok) {
          const message = `Error! Status code: ${response.status}`;
          throw new Error(message);
        }

        const details = await response.json();

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
        setFormData({
          date: '',
          time: '',
          guests: '2',
          occasion: '',
          tableNumber: '',
          name: '',
          email: '',
          phone: '',
          specialRequests: ''
        });
      } catch (error) {
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

        <Navigation />

        <div className="relative z-10 container mx-auto px-6 h-[calc(50vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <UtensilsCrossed className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-8">
              {siteContent.reservation.header.title}
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {siteContent.reservation.header.description}
            </p>
          </div>
        </div>
      </div>

      {/* Banner Section */}
    

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
                        <span>{siteContent.reservation.form.labels.date}</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {formErrors.date && <p className="text-red-500 text-sm">{formErrors.date}</p>}
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 mr-2 text-green-600" />
                        <span>{siteContent.reservation.form.labels.time}</span>
                      </div>
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select a time</option>
                      {AVAILABLE_TIMES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {formErrors.time && <p className="text-red-500 text-sm">{formErrors.time}</p>}
                  </div>

                  {/* Number of Guests */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Users className="w-5 h-5 mr-2 text-green-600" />
                        <span>{siteContent.reservation.form.labels.guests}</span>
                      </div>
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => handleInputChange('guests', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                      <option value="more">More than 10 guests</option>
                    </select>
                    {formErrors.guests && <p className="text-red-500 text-sm">{formErrors.guests}</p>}
                  </div>

                  {/* Occasion */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                        <span>Special Occasion</span>
                      </div>
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => handleInputChange('occasion', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select occasion (optional)</option>
                      {OCCASIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* Table Number */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                        <span>Table Number</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      value={formData.tableNumber}
                      onChange={(e) => handleInputChange('tableNumber', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter table number"
                    />
                    {formErrors.tableNumber && <p className="text-red-500 text-sm">{formErrors.tableNumber}</p>}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">{siteContent.reservation.form.labels.name}</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={siteContent.reservation.form.placeholders.name}
                      />
                      {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">{siteContent.reservation.form.labels.email}</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={siteContent.reservation.form.placeholders.email}
                      />
                      {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">{siteContent.reservation.form.labels.phone}</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={siteContent.reservation.form.placeholders.phone}
                      />
                    {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
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
                  <label className="block text-gray-700 font-medium mb-2">{siteContent.reservation.form.labels.specialRequests}</label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                    placeholder={siteContent.reservation.form.placeholders.specialRequests}
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
                  {siteContent.reservation.info.hours.weekdays.label}: {siteContent.reservation.info.hours.weekdays.time}<br />
                  {siteContent.reservation.info.hours.weekends.label}: {siteContent.reservation.info.hours.weekends.time}<br />
                  {siteContent.reservation.info.hours.sunday.label}: {siteContent.reservation.info.hours.sunday.time}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p className="text-gray-600">
                  {siteContent.reservation.info.location.street}<br />
                  {siteContent.reservation.info.location.city}, {siteContent.reservation.info.location.state} {siteContent.reservation.info.location.zip}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Contact</h3>
                <p className="text-gray-600">
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

export default TableReserve;
