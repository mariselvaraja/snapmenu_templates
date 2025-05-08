import { motion } from 'framer-motion';
import { Heart, Users, Award, Star, ChefHat, Utensils } from 'lucide-react';
import { useAppSelector } from '../../../common/redux';

export default function About() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  
  // Extract data for the sections
  const story = siteContent?.story?.storyContent || '';
  const hero = siteContent?.story?.hero || '';

  console.log("story", siteContent.story)

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Title within Image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
            {/* Image Section with Title Overlay */}
            <div className="relative">
              <div className="h-80 md:h-96 overflow-hidden">
                <motion.img
                  src={hero.image}
                  alt="Restaurant story"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                />
                
                {/* Overlay with title */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent flex flex-col items-center justify-center text-center p-8">
                  <motion.h1 
                    className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {hero.title}
                  </motion.h1>
                  <motion.div 
                    className="w-24 h-1 bg-red-500 mb-6"
                    initial={{ width: 0 }}
                    whileInView={{ width: 96 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-20 h-20 border-l-4 border-t-4 border-white opacity-70"></div>
                <div className="absolute bottom-4 right-4 w-20 h-20 border-r-4 border-b-4 border-white opacity-70"></div>
              </div>
            </div>
            
            {/* Description Section */}
            <div className="p-8 md:p-12">
              <motion.div 
                className="flex items-start mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
             <div
  className="border-l-4 border-red-500 pl-4"
  dangerouslySetInnerHTML={{ __html: story }}
/>

              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
