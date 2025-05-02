import { motion } from 'framer-motion';
import { Heart, Users, Clock, Award, Star, Quote, ChefHat, MapPin, Utensils } from 'lucide-react';
import { useAppSelector } from '../../../common/redux';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6
    }
  })
};

export default function About() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  
  // Extract data for the sections
  const story = siteContent?.story || {};
  const hero = story?.hero || {};
  const mission = story?.mission || {};
  const journey = story?.journey || {};
  const customerSays = story?.customerSays || {};
  const visitUs = story?.visitUs || {};
  
  // Check if data is available
  const isStoryAvailable = story && story.hero && story.hero.image;
  const isMissionAvailable = mission && mission.title && mission.description;
  const isJourneyAvailable = journey && journey.title && journey.description;
  const isCustomerSaysAvailable = customerSays && customerSays.name && customerSays.description;
  const isVisitUsAvailable = visitUs && visitUs.title && visitUs.description;
  
  // Format the hero description by replacing \r\n with proper paragraph breaks
  const formattedHeroDescription = hero.description ? 
    hero.description.split('\r\n\r\n').filter((para: string) => para.trim() !== '') : 
    [];
  
  // Use values from API if available, otherwise use fallback values
  const values = story?.values || [];
  
  // Map icons to values or use fallback values if the API data is empty
  const coreValues = values.length > 0 ? 
    values.map((value: any) => ({
      icon: getIconForValue(value.icon || value.title),
      title: value.title,
      description: value.description
    })) : 
    [
      {
        icon: <Award className="h-10 w-10 text-red-500" />,
        title: "Excellence",
        description: "We strive for excellence in every dish we prepare, ensuring the highest quality and authentic flavors."
      },
      {
        icon: <Heart className="h-10 w-10 text-red-500" />,
        title: "Passion",
        description: "Our passion for traditional cuisine drives us to preserve authentic recipes while innovating for modern tastes."
      },
      {
        icon: <Users className="h-10 w-10 text-red-500" />,
        title: "Community",
        description: "We believe in bringing people together through the shared experience of exceptional food."
      },
      {
        icon: <Utensils className="h-10 w-10 text-red-500" />,
        title: "Tradition",
        description: "Honoring culinary traditions while creating memorable dining experiences for our guests."
      }
    ];
  
  // Helper function to get icon based on value name or icon string
  function getIconForValue(iconName: string): JSX.Element {
    const iconMap: Record<string, JSX.Element> = {
      'excellence': <Award className="h-10 w-10 text-red-500" />,
      'award': <Award className="h-10 w-10 text-red-500" />,
      'passion': <Heart className="h-10 w-10 text-red-500" />,
      'heart': <Heart className="h-10 w-10 text-red-500" />,
      'community': <Users className="h-10 w-10 text-red-500" />,
      'users': <Users className="h-10 w-10 text-red-500" />,
      'tradition': <Utensils className="h-10 w-10 text-red-500" />,
      'utensils': <Utensils className="h-10 w-10 text-red-500" />,
      'chef': <ChefHat className="h-10 w-10 text-red-500" />,
      'star': <Star className="h-10 w-10 text-red-500" />
    };
    
    // Convert to lowercase and check if we have a matching icon
    const key = iconName?.toLowerCase() || '';
    return iconMap[key] || <Award className="h-10 w-10 text-red-500" />;
  }
  
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
                <div className="border-l-4 border-red-500 pl-4">
                  {formattedHeroDescription.map((paragraph: string, index: number) => (
                    <p key={index} className="text-lg text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium">
                  <Heart className="h-4 w-4 mr-2" />
                  <span>Crafted with passion and tradition</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Mission Section */}
        {/* <motion.div 
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {mission.title}
              </motion.h2>
              <motion.div 
                className="w-24 h-1 bg-red-500 mx-auto mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </div>
            
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-xl text-gray-700 leading-relaxed">
                {mission.description}
              </p>
            </motion.div>
          </div>
        </motion.div> */}
                    {/* <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-10">Our Core Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreValues.map((value: any, index: number) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md text-center"
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                  >
                    <div className="flex justify-center mb-4">
                      {value.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-2">{value.title}</h4>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div> */}
        {/* Journey Section */}
        {/* <motion.div 
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {journey.title}
              </motion.h2>
              <motion.div 
                className="w-24 h-1 bg-red-500 mx-auto mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </div>
            
            <div className="max-w-3xl mx-auto">
              <motion.p 
                className="text-xl text-gray-700 leading-relaxed text-center mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {journey.description}
              </motion.p>
           
              {isJourneyAvailable && (
                <div className="relative">
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-200"></div>
                  
               
                  <div className="space-y-16">
                 
                    {(story?.timeline || [
                      { year: "2005", title: "Our Beginning", description: "The first restaurant opened its doors, introducing authentic flavors." },
                      { year: "2010", title: "Expansion", description: "Growing popularity led to our expansion across multiple locations." },
                      { year: "2015", title: "Award Winning", description: "Our commitment to quality earned us recognition as one of the best restaurants." },
                      { year: "2023", title: "Today", description: "We continue to honor tradition while innovating for our guests." }
                    ]).map((event: any, index: number) => (
                    <motion.div 
                      key={index}
                      className="relative"
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={slideIn}
                    >
                      
                      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      
                      
                      <div className={`w-5/12 ${index % 2 === 0 ? 'ml-auto pl-8' : 'mr-auto pr-8 text-right'}`}>
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-2">
                            {event.year}
                          </span>
                          <h4 className="text-xl font-bold mb-2">{event.title}</h4>
                          <p className="text-gray-600">{event.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
        </motion.div>
         */}
        {/* Testimonial Section */}
        {/* <motion.div 
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="h-12 w-12 text-red-500 mx-auto mb-6 opacity-50" />
              
              <motion.p 
                className="text-2xl md:text-3xl font-light italic mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                "{customerSays.description}"
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-xl font-bold">{customerSays.name}</p>
                <p className="text-gray-400">{customerSays.profession}</p>
              </motion.div>
            </div>
          </div>
        </motion.div> */}
        
        {/* Visit Us Section */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-red-50 rounded-2xl p-8 md:p-12 shadow-lg text-center">
            <MapPin className="h-12 w-12 text-red-500 mx-auto mb-6" />
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {visitUs.title}
            </motion.h2>
            
            <motion.div 
              className="w-24 h-1 bg-red-500 mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            
            <motion.p 
              className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {visitUs.description}
            </motion.p>
            
            <motion.button
              className="px-8 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find a Location
            </motion.button>
          </div>
        </motion.div> */}
      </div>
    </div>
  );
}
