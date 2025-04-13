import React from 'react';
import { Icon } from '../components/Icon';
import { useAppSelector } from '../../../common/redux';


interface Value {
  icon: string;
  title: string;
  description: string;
}

export function Story() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const storyContent = siteContent?.story;
  
  console.log("Story content:", storyContent);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={storyContent?.hero?.image}
            alt={storyContent?.hero?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            {storyContent?.hero?.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 animate-fade-in-delay-1">
            {storyContent?.hero?.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Content sections - using data from storyContent if available */}
        {storyContent?.sections && storyContent.sections.map((section: any, index: number) => {
          // Determine if this section should have reversed layout (alternating)
          const isReversed = index % 2 !== 0;
          
          return (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
              <div className={isReversed ? "order-1 md:order-2" : ""}>
                <h2 className="text-4xl font-bold mb-6">{section.title}</h2>
                <p className="text-gray-400 text-lg mb-6">
                  {section.description}
                </p>
                {section.additionalText && (
                  <p className="text-gray-400 text-lg">
                    {section.additionalText}
                  </p>
                )}
              </div>
              <div className={`relative aspect-square ${isReversed ? "order-2 md:order-1" : ""}`}>
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
          );
        })}
        
        {/* No fallback content - will only display sections if they exist in siteContent */}

        {/* Values Section */}
        {storyContent?.values && storyContent.values.length > 0 && (
          <div className="mb-32">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {storyContent.values.map((value: Value, index: number) => (
              <div key={index} className="bg-zinc-900/50 p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name={value.icon} className="text-black" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400 text-lg">{value.description}</p>
              </div>
              ))}
            </div>
          </div>
        )}
      </div>
    
    </div>
  );
}
