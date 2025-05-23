import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { useAppSelector } from '../../../common/redux';

type MediaItem = {
  id: number;
  type: 'image' | 'video';
  title: string;
  category?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  videoUrl?: string;
};

export default function Gallery() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
    
  // Check if gallery data is available and has images
  const isGalleryAvailable = siteContent?.gallery !== undefined;
  const hasImages = isGalleryAvailable && Array.isArray(siteContent?.gallery?.images) && siteContent?.gallery?.images.length > 0;
  

  
  // Use API data if available, otherwise use default data for rendering
  const gallery = isGalleryAvailable ? siteContent.gallery : [];
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Transform gallery data from siteContent to match the component's expected format
  useEffect(() => {
    if (hasImages) {
      const transformedItems = gallery.images.map((item: any, index: number) => {
        // Safely check if description exists and contains certain keywords
        const hasDescription = typeof item.description === 'string';
        const isAmbiance = hasDescription && item.description.includes("ambiance");
        const isChef = hasDescription && item.description.includes("chef");
        
        return {
          id: index + 1,
          title: item.title || "Gallery Image",
          category: isAmbiance ? "Ambiance" : isChef ? "Food" : "Restaurant",
          type: "image" as const,
          image: item.image,
          description: item.description || ""
        };
      });
      setGalleryItems(transformedItems);
    } else {
      setGalleryItems([]);
    }
  }, [gallery, hasImages]);

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isGalleryAvailable ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">{gallery.header?.title || gallery.section?.title || "Our Gallery"}</h1>
            <p className="text-xl text-gray-600">
              {gallery.header?.subtitle || gallery.section?.subtitle || "Explore our restaurant and cuisine through our gallery"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Gallery is not Available</h1>
            <p className="text-xl text-gray-600">
              Our gallery content is currently unavailable. Please check back later.
            </p>
          </motion.div>
        )}

        {/* Gallery Grid - only show if gallery is available and has images */}
        {hasImages && galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg"
                onClick={() => setSelectedMedia({
                  id: Number(item.id),
                  type: item.type,
                  title: item.title,
                  image: item.type === 'image' ? item.image : undefined,
                  thumbnail: item.type === 'video' ? item.thumbnail : undefined,
                  videoUrl: item.type === 'video' ? item.videoUrl : undefined
                })}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.type === 'image' ? item.image : item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-500 rounded-full p-4 opacity-90">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Gallery is not found</h1>
            <p className="text-xl text-gray-600">
              No gallery images are available at this time. Please check back later.
            </p>
          </motion.div>
        )}

        {/* Lightbox */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.image}
                  alt={selectedMedia.title}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
                  <iframe
                    src={selectedMedia.videoUrl}
                    title={selectedMedia.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              <h3 className="text-white text-xl font-semibold mt-4">{selectedMedia.title}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
