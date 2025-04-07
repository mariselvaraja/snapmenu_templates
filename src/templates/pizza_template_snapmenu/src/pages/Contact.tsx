import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

export default function Contact() {
  // Get contact data directly from useRootSiteContent
  const { siteContent } = useRootSiteContent();
  
  // More comprehensive default contact data
  const defaultContact = {
    header: { 
      title: "Contact Us", 
      subtitle: "Get in touch with us for any questions or concerns. We're here to help!" 
    },
    form: { 
      title: "Send us a message",
      description: "Have questions about our menu, services, or want to provide feedback? We'd love to hear from you.",
      labels: { 
        firstName: "Name", 
        lastName: "Last Name",
        email: "Email", 
        phone: "Phone Number",
        subject: "Subject",
        message: "Message", 
        submitButton: "Send Message" 
      },
      placeholders: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1 (555) 000-0000",
        subject: "How can we help?",
        message: "Your message..."
      }
    },
    infoCards: {
      phone: { 
        title: "Contact Information", 
        numbers: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
        hours: "Mon-Fri from 8am to 8pm"
      },
      email: { 
        title: "Email",
        addresses: ["info@pizzaplanet.com", "support@pizzaplanet.com"],
        support: "Online support"
      },
      address: { 
        title: "Address",
        street: "123 Pizza Street", 
        city: "New York", 
        state: "NY",
        zip: "10001",
        label: "Headquarters"
      },
      hours: { 
        title: "Working Hours",
        weekday: "Monday - Friday: 8am - 8pm",
        weekend: "Saturday - Sunday: 9am - 7pm",
        note: "Open 7 days a week"
      }
    },
    callToAction: {
      call: {
        title: "Call Us",
        phone: "+1 (555) 123-4567"
      },
      email: {
        title: "Email Us",
        address: "info@pizzaplanet.com"
      },
      visit: {
        title: "Visit Us",
        address: "123 Pizza Street, New York"
      }
    },
    location: {
      title: "Our Location",
      description: "Visit us at our restaurant or headquarters. We're conveniently located in the heart of New York City.",
      mapEnabled: true
    }
  };
  
  // Use contact data from siteContent with fallback to default
  const contact = (siteContent as any)?.contact || defaultContact;
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
              <h2 className="text-2xl font-semibold mb-6">{contact.infoCards.phone.title}</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-red-500 mr-4" />
                  <span>{contact.infoCards.phone.numbers[0]}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-red-500 mr-4" />
                  <span>{contact.infoCards.email.addresses[0]}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-red-500 mr-4" />
                  <span>{contact.infoCards.address.street}, {contact.infoCards.address.city}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-red-500 mr-4" />
                  <span>{contact.infoCards.hours.weekday}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">FAQ</h2>
              <div className="space-y-4">
                {[
                  {
                    question: "Do you offer delivery?",
                    answer: "Yes, we deliver to all locations within our delivery zones."
                  },
                  {
                    question: "What are your busiest hours?",
                    answer: "We're typically busiest during lunch (12-2pm) and dinner (6-8pm)."
                  },
                  {
                    question: "Do you cater for events?",
                    answer: "Yes! Contact us for special event and catering inquiries."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
