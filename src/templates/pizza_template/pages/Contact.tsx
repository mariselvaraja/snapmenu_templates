import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { useAppSelector } from '../../../common/redux';

export default function Contact() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const contact = siteContent?.contact;

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">{contact.header.title}</h1>
          <p className="text-xl text-gray-600">
            {contact.header.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold mb-6">{contact.form.title}</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {contact.form.labels.firstName}
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder={contact.form.placeholders.firstName}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {contact.form.labels.email}
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder={contact.form.placeholders.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {contact.form.labels.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder={contact.form.placeholders.phone}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {contact.form.labels.message}
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder={contact.form.placeholders.message}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                {contact.form.labels.submitButton}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-red-500 mr-4 mt-1" />
                  <div>
                    <p>{contact.infoCards.address.street}</p>
                    <p>{contact.infoCards.address.city}{contact.infoCards.address.state ? `, ${contact.infoCards.address.state}` : ''}{contact.infoCards.address.zip ? ` ${contact.infoCards.address.zip}` : ''}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-red-500 mr-4" />
                  <div>
                    <p>{contact.infoCards.hours.weekday}</p>
                    <p>{contact.infoCards.hours.weekend}</p>
                    {contact.infoCards.hours.note && <p className="text-sm text-gray-500">{contact.infoCards.hours.note}</p>}
                  </div>
                </div>
                
                {/* Phone Numbers */}
                {contact.infoCards.phone.numbers && Array.isArray(contact.infoCards.phone.numbers) && contact.infoCards.phone.numbers.length > 0 ? (
                  <div className="flex items-center">
                    <FaPhoneAlt className="h-5 w-5 text-red-500 mr-4" />
                    <div>
                      {contact.infoCards.phone.numbers.map((phoneNumber: any, index: number) => (
                        <p key={`phone-${index}`}>
                          {typeof phoneNumber === 'string' ? phoneNumber : (typeof phoneNumber === 'object' ? JSON.stringify(phoneNumber) : "(555) 123-4567")}
                        </p>
                      ))}
                      {contact.infoCards.phone.hours && <p className="text-sm text-gray-500">{contact.infoCards.phone.hours}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaPhoneAlt className="h-5 w-5 text-red-500 mr-4" />
                    <span>(555) 123-4567</span>
                  </div>
                )}
                
                {/* Email Addresses */}
                {contact.infoCards.email.addresses && Array.isArray(contact.infoCards.email.addresses) && contact.infoCards.email.addresses.length > 0 ? (
                  <div className="flex items-center">
                    <FaEnvelope className="h-5 w-5 text-red-500 mr-4" />
                    <div>
                      {contact.infoCards.email.addresses.map((emailAddress: any, index: number) => (
                        <p key={`email-${index}`}>
                          {emailAddress || "info@pizzaplanet.com"}
                        </p>
                      ))}
                      {contact.infoCards.email.support && <p className="text-sm text-gray-500">{contact.infoCards.email.support}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaEnvelope className="h-5 w-5 text-red-500 mr-4" />
                    <span>info@pizzaplanet.com</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
