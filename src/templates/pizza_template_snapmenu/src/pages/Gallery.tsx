import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

type GalleryItem = {
  id: number;
  title: string;
  image: string;
  description: string;
};

export default function Gallery() {
  // Get gallery data directly from useRootSiteContent
  const { siteContent } = useRootSiteContent();
  
  // Default gallery data with sample images
  const defaultGallery = {
    section: {
      title: "Our Gallery",
      subtitle: "Explore our beautiful moments and creations"
    },
    images: [
      {
        title: "Signature Pizza",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80",
        description: "Our famous wood-fired Margherita pizza with fresh basil"
      },
      {
        title: "Restaurant Interior",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80",
        description: "The warm and inviting atmosphere of our main dining area"
      },
      {
        title: "Chef's Special",
        image: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?auto=format&fit=crop&q=80",
        description: "Our chef preparing a special seasonal pizza"
      },
      {
        title: "Outdoor Dining",
        image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80",
        description: "Enjoy your meal in our beautiful outdoor patio"
      },
      {
        title: "Fresh Ingredients",
        image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?auto=format&fit=crop&q=80",
        description: "We use only the freshest ingredients in all our dishes"
      },
      {
        title: "Pizza Making",
        image: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&q=80",
        description: "Behind the scenes of our pizza making process"
      }
    ]
  };
  
  // Use gallery data from siteContent with fallback to default
  const gallery = (siteContent as any)?.gallery || defaultGallery;
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Transform gallery data from siteContent to match the component's expected format
  useEffect(() => {
    if (gallery?.images?.length) {
      const transformedItems = gallery.images.map((item, index) => ({
        id: index + 1,
        title: item.title || 'Untitled',
        image: item.image || '',
        description: item.description || ''
      }));
      setGalleryItems(transformedItems);
    } else {
      // Set empty array if no gallery data
      setGalleryItems([]);
    }
  }, [gallery]);

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">
            {gallery?.section?.title || "Our Gallery"}
          </h1>
          <p className="text-xl text-gray-600">
            {gallery?.section?.subtitle || "Explore our beautiful moments and creations"}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        {galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg"
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.title}
                  </p>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No gallery images available.</p>
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4 text-white">
                <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-gray-300 mt-2">{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
