import { motion } from 'framer-motion';
import { UtensilsCrossed, Heart, Users, Clock, Award, Star, Quote, ChefHat, MapPin } from 'lucide-react';
import { useAppSelector } from '../../../common/redux';

// Define interfaces for story content
interface StoryValue {
  icon: string;
  title: string;
  description: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export default function About() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const story = siteContent?.story;
  
  // Check if story data is available
  const isStoryAvailable = story && story.hero;
  
  // Example timeline data (would come from API in production)
  const timelineEvents: TimelineEvent[] = [
    {
      year: "2010",
      title: "Our Beginning",
      description: "We opened our first small pizzeria with just three tables and a dream."
    },
    {
      year: "2015",
      title: "Expansion",
      description: "After gaining popularity, we moved to a larger location and expanded our menu."
    },
    {
      year: "2020",
      title: "Award Winning",
      description: "Our dedication to quality earned us the 'Best Pizza in Town' award."
    },
    {
      year: "2025",
      title: "Today",
      description: "We continue our tradition of excellence with multiple locations across the city."
    }
  ];
  
  // Example testimonials data (would come from API in production)
  const testimonials = [
    {
      quote: "The best pizza I've ever had! The crust is perfect and the ingredients are always fresh.",
      author: "Maria S.",
      role: "Food Blogger"
    },
    {
      quote: "This place has become our family's Friday night tradition. The staff treats us like family.",
      author: "James T.",
      role: "Local Customer"
    }
  ];
  
  // Example team data (would come from API in production)
  const teamMembers: TeamMember[] = [
    {
      name: "Marco Rossi",
      role: "Head Chef",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80"
    },
    {
      name: "Sofia Bianchi",
      role: "Pizzaiolo",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80"
    },
    {
      name: "Antonio Russo",
      role: "Restaurant Manager",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
    }
  ];
  
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
  
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Title within Image */}
        {isStoryAvailable && story.hero.image && (
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
                    src={story.hero.image}
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
                      {story.hero.title}
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
                    <p className="text-lg text-gray-700 italic leading-relaxed">
                      {story.hero.description}
                    </p>
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
                    <span>Crafted with passion since 2010</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {!isStoryAvailable && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20 py-16 bg-gray-50 rounded-2xl"
          >
            <h1 className="text-4xl font-bold mb-4">Our Story</h1>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our story content is currently unavailable. Please check back later.
            </p>
          </motion.div>
        )}

        {/* Our Mission Section */}
        {isStoryAvailable && (
          <motion.div 
            className="mb-24 flex flex-col md:flex-row items-center gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="md:w-1/2">
              <motion.h2 
                className="text-3xl font-bold mb-4 relative inline-block"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our Mission
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-red-500"></div>
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 mb-6 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                At our core, we believe that great pizza brings people together. Our mission is to create memorable dining experiences through authentic flavors, quality ingredients, and warm hospitality.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Every pizza we serve is crafted with passion and tradition, honoring our Italian heritage while embracing innovative techniques and local ingredients.
              </motion.p>
            </div>
            <motion.div 
              className="md:w-1/2 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80" 
                  alt="Pizza making" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80" 
                  alt="Restaurant interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&q=80" 
                  alt="Cooking pizza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80" 
                  alt="Restaurant customers" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Values Section - with improved styling */}
        {isStoryAvailable && story.values && story.values.length > 0 && (
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our Values
              </motion.h2>
              <motion.div 
                className="w-24 h-1 bg-red-500 mx-auto mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 96 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.p 
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                These core principles guide everything we do, from sourcing ingredients to serving our customers.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {story.values.map((value: StoryValue, index: number) => {
                // Map icon string to actual icon component
                let IconComponent;
                switch(value.icon) {
                  case 'UtensilsCrossed':
                    IconComponent = UtensilsCrossed;
                    break;
                  case 'Heart':
                    IconComponent = Heart;
                    break;
                  case 'Users':
                    IconComponent = Users;
                    break;
                  default:
                    IconComponent = UtensilsCrossed; // Default icon
                }
                
                return (
                  <motion.div
                    key={value.title}
                    custom={index}
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-500"
                  >
                    <div className="bg-red-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-center">{value.title}</h3>
                    <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
        
        {/* Timeline Section */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Our Journey
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-red-500 mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              From humble beginnings to where we are today, our passion for great pizza has never wavered.
            </motion.p>
          </div>
        </motion.div>
        
        {/* Testimonials Section */}
        <motion.div 
          className="mb-24 bg-gray-50 py-16 px-8 rounded-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              What Our Customers Say
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-red-500 mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-md relative"
              >
                <Quote className="h-12 w-12 text-red-100 absolute top-4 left-4" />
                <div className="relative z-10">
                  <p className="text-lg text-gray-700 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="ml-4">
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
 
        
        {/* Visit Us Section */}
        <motion.div 
          className="bg-red-500 text-white rounded-xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Come Visit Us Today</h2>
          <p className="mb-6 max-w-2xl mx-auto">Experience our warm hospitality and delicious food in person. We'd love to welcome you to our restaurant.</p>
          <div className="flex items-center justify-center">
            <MapPin className="h-5 w-5 mr-2" />
            <span>123 Pizza Street, New York, NY 10001</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
