import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

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
  const siteContent = useSiteContent();
  const gallery = siteContent?.gallery || {
    section: {
      title: "Our Gallery",
      subtitle: "Explore our restaurant and cuisine through our gallery"
    },
    images: [
      {
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
        title: "Restaurant Interior",
        description: "The elegant ambiance of our main dining area"
      },
      {
        image: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80",
        title: "Signature Dish",
        description: "Our chef's special creation"
      },
      {
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
        title: "Private Dining",
        description: "Exclusive space for special occasions"
      }
    ]
  };
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Transform gallery data from siteContent to match the component's expected format
  useEffect(() => {
    if (gallery && gallery.images) {
      const transformedItems = gallery.images.map((item, index) => ({
        id: index + 1,
        title: item.title,
        category: item.description.includes("ambiance") ? "Ambiance" : 
                 item.description.includes("chef") ? "Food" : "Restaurant",
        type: "image" as const,
        image: item.image,
        description: item.description
      }));
      setGalleryItems(transformedItems);
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
          <h1 className="text-4xl font-bold mb-4">{gallery.section.title}</h1>
          <p className="text-xl text-gray-600">
            {gallery.section.subtitle}
          </p>
        </motion.div>

        {/* Gallery Grid */}
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
