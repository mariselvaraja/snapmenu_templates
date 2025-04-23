import React from 'react';

interface GalleryImage {
  image: string;
  title: string;
  description: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-900/50 backdrop-blur-sm rounded-3xl">
        <h2 className="text-3xl font-bold mb-4">Gallery data not found</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Our gallery images are currently unavailable. Please check back later.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image.image}
            alt={image.title}
            className="w-full rounded-lg shadow-md"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white rounded-lg">
            <h3 className="text-lg font-semibold">{image.title}</h3>
            <p className="text-sm">{image.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
