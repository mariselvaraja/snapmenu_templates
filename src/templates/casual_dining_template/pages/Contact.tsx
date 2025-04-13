import React from 'react';
import { useContent } from '../context/ContentContext';
import { MapPin, Clock, Phone, Mail, Users } from 'lucide-react';
import { Footer } from '../components/Footer';

export function Contact() {
  const { siteContent } = useContent();
  const contactInfo = siteContent.contact;

  return (
<>
    <div className="min-h-screen bg-black text-white">

      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src="https://plus.unsplash.com/premium_photo-1682125235036-d1ab54136ff4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29udGFjdHN8ZW58MHx8MHx8fDA%3D"
            alt="Contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            {contactInfo.header.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 animate-fade-in-delay-1">
            {contactInfo.header.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(contactInfo.infoCards).map((card: any, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl overflow-hidden group hover:scale-105 transition duration-300"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                <div className="space-y-3 text-gray-300 mb-6">
                  {card.numbers && (
                    <p className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-yellow-400" />
                      {card.numbers.join(', ')}
                    </p>
                  )}
                  {card.addresses && (
                    <p className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-yellow-400" />
                      {card.addresses.join(', ')}
                    </p>
                  )}
                  {card.street && card.city && card.state && card.zip && (
                    <p className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-yellow-400" />
                      {card.street}, {card.city}, {card.state} {card.zip}
                    </p>
                  )}
                  {card.weekday && card.weekend && (
                    <div className="space-y-1">
                      <p className="flex items-center">
                        <Clock className="w-5 h-5 mr-3 text-yellow-400" />
                        {card.weekday}
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-5 h-5 mr-3 text-yellow-400" />
                        {card.weekend}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 mb-6">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
