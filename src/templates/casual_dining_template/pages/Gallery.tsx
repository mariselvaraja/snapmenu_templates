import React from 'react';
import GalleryComponent from '../components/Gallery';
import { useAppSelector } from '../../../common/redux';


const Gallery: React.FC = () => {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const gallery = siteContent?.gallery || {
    section: {
      title: "Our Gallery",
      subtitle: "A visual journey through our culinary creations and restaurant atmosphere"
    },
    images: []
  };

  return (
    <>
    <div className="min-h-screen bg-black text-white">

      <header className="relative h-96">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1545324053-41b04f1a8e8a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2QlMjBnYWxhcnl8ZW58MHx8MHx8fDA%3D"
            alt="Gallery background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
        </div>

        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              {gallery?.section?.title || "Our Gallery"}
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-delay-1">
              {gallery?.section?.subtitle || "A visual journey through our culinary creations"}
            </p>
          </div>
        </div>
      </header>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <GalleryComponent images={gallery?.images || []} />
        </div>
      </div>
      
    </div>

    </>
  );
};

export default Gallery;
