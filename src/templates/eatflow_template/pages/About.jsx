import React from 'react';
import { Leaf, ChefHat, UtensilsCrossed, Award, Users, Clock, Heart } from 'lucide-react';
import { useAppSelector } from '../../../redux';

// Function to render the appropriate icon
const renderIcon = (iconName) => {
  switch(iconName) {
    case 'Award':
      return <Award className="w-8 h-8 text-green-500" />;
    case 'Users':
      return <Users className="w-8 h-8 text-green-500" />;
    case 'Clock':
      return <Clock className="w-8 h-8 text-green-500" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="w-10 h-10 text-green-600" />;
    case 'Heart':
      return <Heart className="w-10 h-10 text-green-600" />;
    case 'Wine':
      return <Wine className="w-8 h-8 text-green-600" />;
    default:
      return <Utensils className="w-8 h-8 text-green-600" />;
  }
};

export function About() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const story = siteContent?.story;
  const brandName = siteContent?.brand?.name;
  



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img 
            src={story.hero.image}
            alt="About background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 h-[calc(70vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <Leaf className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-8">
              {story.hero.title}
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {story.hero.description}
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at {brandName}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {story.values.map((value, index) => {
              // Function to render the appropriate icon
              const renderValueIcon = (iconName) => {
                switch(iconName) {
                  case 'UtensilsCrossed':
                    return <UtensilsCrossed className="w-10 h-10 text-green-600" />;
                  case 'Heart':
                    return <Heart className="w-10 h-10 text-green-600" />;
                  case 'Users':
                    return <Users className="w-10 h-10 text-green-600" />;
                  default:
                    return <UtensilsCrossed className="w-10 h-10 text-green-600" />;
                }
              };
              
              return (
                <div key={index} className="bg-white p-12 rounded-2xl shadow-lg text-center">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    {renderValueIcon(value.icon)}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-600 text-lg">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
