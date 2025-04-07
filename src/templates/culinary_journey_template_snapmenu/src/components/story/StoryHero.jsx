import React from 'react';
import { useContent } from '../../context';

// Default hero image
const defaultHeroImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

export function StoryHero() {
  const { content, rootContent } = useContent();
  
  // Use rootContent if available, otherwise fall back to content
  const storyData = rootContent?.siteContent?.story || content?.story || {
    hero: {
      image: defaultHeroImage,
      title: "Our Story",
      description: "A culinary journey through tradition and innovation"
    }
  };
  
  const { hero } = storyData;

  return (
    <div className="relative h-[70vh] flex items-center">
      <div className="absolute inset-0">
        <img
          src={hero.image || defaultHeroImage}
          alt={hero.title || "Vintage restaurant interior"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-5xl sm:text-7xl font-serif mb-6">{hero.title}</h1>
        <p className="text-xl sm:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
          {hero.description}
        </p>
      </div>
    </div>
  );
}
