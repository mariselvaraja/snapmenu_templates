import React, { useState, useEffect } from 'react';
import { HeroBanner } from './HeroBanner';
import { useRootSiteContent } from '../../../../../../context/RootSiteContentContext';

export function Hero() {
  const { siteContent: rootSiteContent } = useRootSiteContent();
  
  // Default site content with required properties
  const defaultSiteContent = {
    hero: {
      banners: [
        {
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
          title: "A Culinary Journey",
          subtitle: "Experience the art of fine dining in the heart of the city"
        }
      ],
      autoPlayInterval: 5000
    }
  };

  // Transform the site content structure if needed
  const siteContent = rootSiteContent ? {
    // Use navigationBar properties if available, otherwise use top-level properties or defaults
    hero: rootSiteContent.navigationBar?.hero || rootSiteContent.hero || defaultSiteContent.hero,
  } : defaultSiteContent;
  
  const heroData = siteContent.hero;
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
