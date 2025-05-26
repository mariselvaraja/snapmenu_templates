import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Banner {
  image: string;
  title?: string;
  subtitle?: string;
}

interface HeroBannerProps {
  banners: Banner[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ banners }) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => 
          (prevIndex + 1) % banners.length
        );
      }, 5000); // Change slide every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Don't render if no banners
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="relative h-64 sm:h-80 flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {banners.map((banner: Banner, index: number) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentBannerIndex ? 1 : 0,
              zIndex: index === currentBannerIndex ? 1 : 0
            }}
            transition={{ duration: 0.8 }}
            style={{
              backgroundImage: `url('${banner.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
        <motion.div
          key={currentBannerIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {banners[currentBannerIndex]?.title || 'Welcome to Our Restaurant'}
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            {banners[currentBannerIndex]?.subtitle || 'Discover our delicious menu'}
          </p>
        </motion.div>
        
        {/* Carousel indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentBannerIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
