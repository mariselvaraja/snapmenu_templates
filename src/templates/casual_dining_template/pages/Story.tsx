import React, { useContext } from 'react';
import { Navigation } from '../components/Navigation';
import { Icon } from '../components/Icon';
import { ContentContext, ContentContextType } from '../context/ContentContext';
import { Footer } from '../components/Footer';


interface Value {
  icon: string;
  title: string;
  description: string;
}

export function Story() {
  const { siteContent } = useContext(ContentContext) as any;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={siteContent.story.hero.image}
            alt={siteContent.story.hero.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <Navigation />

        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            {siteContent.story.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 animate-fade-in-delay-1">
            {siteContent.story.hero.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <h2 className="text-4xl font-bold mb-6">Where It All Began</h2>
            <p className="text-gray-400 text-lg mb-6">
              Founded in 2020, Raging Tacos started as a simple food truck
              with a not-so-simple mission: to bring authentic Mexican street
              food to every neighborhood. Our recipes have been passed down
              through generations, each one telling a story of tradition,
              family, and passion.
            </p>
            <p className="text-gray-400 text-lg">
              What began as a single truck has grown into multiple locations,
              but our commitment to quality and authenticity remains unchanged.
              Every taco we serve is a piece of our heritage, made with the
              same care and attention as when we first started.
            </p>
          </div>
          <div className="relative aspect-square">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80"
              alt="Our beginnings"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
          <div className="order-2 md:order-1 relative aspect-square">
            <img
              src="https://images.unsplash.com/photo-1615557960916-5f4791effe9d?auto=format&fit=crop&q=80"
              alt="Our ingredients"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold mb-6">Fresh Ingredients</h2>
            <p className="text-gray-400 text-lg mb-6">
              Quality is at the heart of everything we do. We source our
              ingredients from local suppliers who share our passion for
              excellence. Every morning, our kitchens come alive with the
              preparation of fresh salsas, hand-pressed tortillas, and
              marinated meats.
            </p>
            <p className="text-gray-400 text-lg">
              We believe that great food starts with great ingredients, and we
              never compromise on quality. It's this dedication that makes
              every bite at Raging Tacos special.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {siteContent.story.values.map((value: Value, index: number) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center h-16 mb-4">
                <Icon name={value.icon} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{value.title}</h3>
              <p className="text-gray-400 text-lg">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
