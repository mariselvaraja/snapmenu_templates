import React, { useState, useEffect } from 'react';
import { HeroBanner } from './HeroBanner';

export function Hero() {
  // Using fallback data directly instead of useRootSiteContent
  const heroData = {
    banners: [
      {
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
        title: "A Culinary Journey",
        subtitle: "Experience the art of fine dining in the heart of the city"
      },
      {
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80",
        title: "Crafted with Passion",
        subtitle: "Every dish tells a story of tradition and innovation"
      },
      {
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
        title: "Memorable Experiences",
        subtitle: "Creating moments that last a lifetime"
      }
    ],
    autoPlayInterval: 5000
  };
  const banners = heroData?.banners || [];
  const autoPlayInterval = heroData?.autoPlayInterval || 5000;
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[85vh] overflow-hidden">
      {banners.map((banner, index) => (
        <HeroBanner
          key={index}
          image={banner.image}
          title={banner.title}
          subtitle={banner.subtitle}
          isActive={currentBanner === index}
        />
      ))}
      
      {/* Banner Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentBanner === index 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
