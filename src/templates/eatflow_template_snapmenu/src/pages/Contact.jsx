import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

export function Contact() {
  const { siteContent } = useRootSiteContent();
  
  // Default contact data with comprehensive information
  const defaultContact = {
    header: { 
      title: "Contact Us", 
      subtitle: "Get in touch with us for any questions or concerns. We're here to help!" 
    },
    infoCards: {
      phone: { 
        title: "Phone", 
        numbers: ["+1 (555) 123-4567", "+1 (555) 987-6543"], 
        hours: "Mon-Fri from 8am to 8pm" 
      },
      email: { 
        title: "Email", 
        addresses: ["info@eatflow.com", "support@eatflow.com"], 
        support: "24/7 Online Support" 
      },
      address: { 
        title: "Address", 
        street: "123 Healthy Street", 
        city: "New York", 
        state: "NY", 
        zip: "10001", 
        label: "Main Restaurant" 
      },
      hours: { 
        title: "Hours", 
        weekday: "Monday - Friday: 11am - 10pm", 
        weekend: "Saturday - Sunday: 10am - 11pm", 
        note: "Kitchen closes 30 minutes before closing" 
      }
    },
    form: { 
      title: "Send us a message", 
      description: "We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible." 
    },
    callToAction: {
      call: { 
        title: "Call Us", 
        phone: "+1 (555) 123-4567" 
      },
      email: { 
        title: "Email Us", 
        address: "info@eatflow.com" 
      },
      visit: { 
        title: "Visit Us", 
        address: "123 Healthy Street, New York, NY 10001" 
      }
    },
    location: { 
      title: "Our Location", 
      description: "Find us in the heart of the city, easily accessible by public transportation." 
    }
  };
  
  // Use contact data from siteContent with fallback to default
  const contactData = siteContent?.contact || defaultContact;
  
  // Create contact info array from siteContent
  const contactInfo = [
    {
      icon: <Phone className="w-8 h-8 text-green-500" />,
      title: contactData.infoCards.phone.title,
      details: contactData.infoCards.phone.numbers,
      description: contactData.infoCards.phone.hours
    },
    {
      icon: <Mail className="w-8 h-8 text-green-500" />,
      title: contactData.infoCards.email.title,
      details: contactData.infoCards.email.addresses,
      description: contactData.infoCards.email.support
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-500" />,
      title: contactData.infoCards.address.title,
      details: [
        contactData.infoCards.address.street,
        `${contactData.infoCards.address.city}, ${contactData.infoCards.address.state} ${contactData.infoCards.address.zip}`
      ],
      description: contactData.infoCards.address.label
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: contactData.infoCards.hours.title,
      details: [
        contactData.infoCards.hours.weekday,
        contactData.infoCards.hours.weekend
      ],
      description: contactData.infoCards.hours.note
    }
  ];
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80"
            alt="Contact background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <Navigation />

        <div className="relative z-10 container mx-auto px-6 h-[calc(70vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <MessageSquare className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-8">
              {contactData.header.title}
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {contactData.header.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center group hover:bg-green-50 transition duration-300">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition duration-300">
                  {info.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 mb-1">{detail}</p>
                ))}
                <p className="text-sm text-gray-500 mt-2">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-8">{contactData.form.title}</h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {contactData.form.description}
              </p>
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{contactData.callToAction.call.title}</h4>
                    <p className="text-gray-600">{contactData.callToAction.call.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{contactData.callToAction.email.title}</h4>
                    <p className="text-gray-600">{contactData.callToAction.email.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{contactData.callToAction.visit.title}</h4>
                    <p className="text-gray-600">{contactData.callToAction.visit.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button className="w-full bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 transition text-lg font-medium">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">{contactData.location.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {contactData.location.description}
              </p>
          </div>
          <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304603!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564756836!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
