import React from 'react';
import GalleryComponent from '../components/Gallery';
import { useContent } from '../context/ContentContext';
import { Footer } from '../components/Footer';

const Gallery: React.FC = () => {
  const { siteContent } = useContent();

  return (
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
              {siteContent.gallery.section.title}
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-delay-1">
              {siteContent.gallery.section.subtitle}
            </p>
          </div>
        </div>
      </header>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <GalleryComponent images={siteContent.gallery.images} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
