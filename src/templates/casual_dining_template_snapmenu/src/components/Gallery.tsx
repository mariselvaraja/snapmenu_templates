import React from 'react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

interface GalleryImage {
  image: string;
  title: string;
  description: string;
}

const Gallery: React.FC = () => {
  const { siteContent } = useRootSiteContent();
  const typedSiteContent = siteContent as any;
  const images = typedSiteContent?.gallery?.images || [];
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
