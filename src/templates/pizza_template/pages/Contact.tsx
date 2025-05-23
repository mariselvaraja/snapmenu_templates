import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { useAppSelector } from '../../../common/redux';
import { useEffect } from 'react';

export default function Contact() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
          <h1 className="text-4xl font-bold mb-4">{contact?.title}</h1>
          <p className="text-xl text-gray-600">
            {contact?.subtitle}
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
            <h2 className="text-2xl font-semibold mb-6">{contact?.form?.title || "Send us a message"}</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {contact?.form?.labels?.firstName || "Name"}
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder={contact?.form?.placeholders?.firstName || "Enter your name"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {contact?.form?.labels?.email || "Email"}
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder={contact?.form?.placeholders?.email || "Enter your email"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {contact?.form?.labels?.phone || "Phone"}
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder={contact?.form?.placeholders?.phone || "Enter your phone number"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {contact?.form?.labels?.message || "Message"}
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder={contact?.form?.placeholders?.message || "Enter your message"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                {contact?.form?.labels?.submitButton || "Submit"}
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
                    <p>{contact?.address}</p>
                  </div>
                </div>
                
                {/* Phone Numbers */}
                {contact?.phone ? (
                  <div className="flex items-center">
                    <FaPhoneAlt className="h-5 w-5 text-red-500 mr-4" />
                    <div>
                    
                      {contact?.phone && <p className="text-sm">{contact?.phone}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    
                  </div>
                )}
                
                {/* Email Addresses */}
                {contact?.email? (
                  <div className="flex items-center">
                    <FaEnvelope className="h-5 w-5 text-red-500 mr-4" />
                    <div>
                    {contact?.email && <p className="text-sm">{contact?.email}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    
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
