import React from 'react';
import { UtensilsCrossed, Heart, Users } from 'lucide-react';
import { useContent } from '../../context';

const iconComponents = {
  UtensilsCrossed,
  Heart,
  Users
};

export function StoryValues() {
  const { content, siteContent } = useContent();
  
  // Use siteContent if available, otherwise fall back to content
  const storyData = siteContent?.story || content?.story || {
    values: []
  };
  
  const { values } = storyData;

  return (
    <div className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {values && values.map((value, index) => {
            const IconComponent = value.icon ? iconComponents[value.icon] : UtensilsCrossed;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-6">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-serif mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
