import React from 'react';
import { Wine, UtensilsCrossed, Clock } from 'lucide-react';
import { ExperienceCard } from './ExperienceCard';
import { ExperienceImage } from './ExperienceImage';
import { useInView } from '../../../hooks/useInView';

const iconComponents = {
  Wine: Wine,
  UtensilsCrossed: UtensilsCrossed,
  Clock: Clock
};

export function Experience() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  
  // Using fallback data directly instead of useRootSiteContent
  const experienceData = {
    section: {
      title: "Our Experience",
      subtitle: "Discover what makes our restaurant special"
    },
    cards: [
      {
        icon: "UtensilsCrossed",
        title: "Culinary Excellence",
        description: "Our chefs blend traditional techniques with innovative approaches to create dishes that delight the senses and nourish the soul.",
        image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80"
      },
      {
        icon: "Wine",
        title: "Curated Wine Selection",
        description: "Our sommelier has carefully selected wines from around the world to perfectly complement our menu and enhance your dining experience.",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80"
      },
      {
        icon: "Clock",
        title: "Timeless Atmosphere",
        description: "Step into a space where time slows down, allowing you to savor each moment and create lasting memories with loved ones.",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80"
      }
    ]
  };
  
  const { section, cards } = experienceData;

  return (
    <div id="experience" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className={`text-center mb-16 transform transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-400 rounded-lg blur opacity-25"></div>
            <h2 className="relative text-4xl sm:text-5xl font-serif mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-400">
              {section.title}
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {section.subtitle}
          </p>
        </div>

        <div className="space-y-24">
          {cards && cards.map((card, index) => {
            const IconComponent = card.icon ? iconComponents[card.icon] : Wine;
            return (
              <div
                key={index}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}
              >
                {index % 2 === 0 ? (
                  <>
                    <ExperienceCard
                      icon={<IconComponent className="h-8 w-8" />}
                      title={card.title}
                      description={card.description}
                      index={index}
                    />
                    <ExperienceImage
                      image={card.image}
                      alt={card.title}
                      index={index}
                    />
                  </>
                ) : (
                  <>
                    <ExperienceImage
                      image={card.image}
                      alt={card.title}
                      index={index}
                    />
                    <ExperienceCard
                      icon={<IconComponent className="h-8 w-8" />}
                      title={card.title}
                      description={card.description}
                      index={index}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
