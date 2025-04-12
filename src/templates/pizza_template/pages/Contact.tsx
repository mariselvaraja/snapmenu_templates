import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export default function Contact() {
  const siteContent = useSiteContent();
  const contact = siteContent?.contact || {
    header: {
      title: "Contact Us",
      subtitle: "We'd love to hear from you"
    },
    infoCards: {
      phone: {
        title: "Phone",
        numbers: ["(212) 555-1234"],
        hours: "Available 7 days a week, 9am-10pm"
      },
      email: {
        title: "Email",
        addresses: ["info@chrisrestaurant.com"],
        support: "We'll respond as soon as possible"
      },
      address: {
        title: "Location",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zip: "10001",
        label: "Downtown"
      },
      hours: {
        title: "Hours",
        weekday: "Mon-Thu: 5pm-10pm",
        weekend: "Fri-Sat: 5pm-11pm",
        note: "Closed on major holidays"
      }
    },
    form: {
      title: "Send Us a Message",
      description: "Have a question or feedback? Fill out the form below and we'll get back to you.",
      labels: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone",
        subject: "Subject",
        message: "Message",
        submitButton: "Send Message"
      },
      placeholders: {
        firstName: "Your first name",
        lastName: "Your last name",
        email: "your@email.com",
        phone: "(123) 456-7890",
        subject: "What is this regarding?",
        message: "Your message here..."
      }
    },
    callToAction: {
      call: {
        title: "Call Us",
        phone: "(212) 555-1234"
      },
      email: {
        title: "Email Us",
        address: "info@chrisrestaurant.com"
      },
      visit: {
        title: "Visit Us",
        address: "123 Main St, New York, NY 10001"
      }
    },
    location: {
      title: "Find Us",
      description: "Located in the heart of downtown",
      mapEnabled: true
    }
  };
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
