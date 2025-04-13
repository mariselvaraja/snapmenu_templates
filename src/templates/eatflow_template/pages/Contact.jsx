import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { useAppSelector } from '../../../redux';

export function Contact() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const navigationBar = siteContent?.navigationBar || {};
  const contact = navigationBar?.contact || {};
  
  // Safely access nested properties with fallbacks
  const infoCards = contact?.infoCards || {};
  const phone = infoCards?.phone || {};
  const email = infoCards?.email || {};
  const address = infoCards?.address || {};
  const hours = infoCards?.hours || {};
  
  const contactInfo = [
    {
      icon: <Phone className="w-8 h-8 text-green-500" />,
      title: phone.title || 'Phone',
      details: phone.numbers || ['Not available'],
      description: phone.hours || ''
    },
    {
      icon: <Mail className="w-8 h-8 text-green-500" />,
      title: email.title || 'Email',
      details: email.addresses || ['Not available'],
      description: email.support || ''
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-500" />,
      title: address.title || 'Address',
      details: [
        address.street || 'Street address not available',
        address.city && address.state && address.zip ? 
          `${address.city}, ${address.state} ${address.zip}` : 
          'Complete address not available'
      ],
      description: address.label || ''
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: hours.title || 'Hours',
      details: [
        hours.weekday || 'Weekday hours not available', 
        hours.weekend || 'Weekend hours not available'
      ],
      description: hours.note || ''
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
        
        <div className="relative z-10 container mx-auto px-6 h-[calc(70vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <MessageSquare className="w-16 h-16 text-green-400" />
            </div>
              <h1 className="text-7xl font-bold text-white mb-8">
                {contact?.header?.title || 'Contact Us'}
              </h1>
              <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                {contact?.header?.subtitle || 'We\'d love to hear from you'}
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
              <h2 className="text-5xl font-bold mb-8">{contact?.form?.title || 'Send us a message'}</h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {contact?.form?.description || 'Fill out the form below and we\'ll get back to you as soon as possible.'}
              </p>
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{contact?.callToAction?.call?.title || 'Call us'}</h4>
                    <p className="text-gray-600">{contact?.callToAction?.call?.phone || 'Phone number not available'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{contact?.callToAction?.email?.title || 'Email us'}</h4>
                    <p className="text-gray-600">{contact?.callToAction?.email?.address || 'Email address not available'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{contact?.callToAction?.visit?.title || 'Visit us'}</h4>
                    <p className="text-gray-600">{contact?.callToAction?.visit?.address || 'Address not available'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                      {contact?.form?.labels?.firstName || 'First Name'}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={contact?.form?.placeholders?.firstName || 'Enter your first name'}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                      {contact?.form?.labels?.lastName || 'Last Name'}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={contact?.form?.placeholders?.lastName || 'Enter your last name'}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    {contact?.form?.labels?.email || 'Email'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={contact?.form?.placeholders?.email || 'Enter your email address'}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    {contact?.form?.labels?.phone || 'Phone'}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={contact?.form?.placeholders?.phone || 'Enter your phone number'}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    {contact?.form?.labels?.subject || 'Subject'}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={contact?.form?.placeholders?.subject || 'Enter subject'}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    {contact?.form?.labels?.message || 'Message'}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={contact?.form?.placeholders?.message || 'Enter your message'}
                  ></textarea>
                </div>
                <button className="w-full bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 transition text-lg font-medium">
                  {contact?.form?.labels?.submitButton || 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
