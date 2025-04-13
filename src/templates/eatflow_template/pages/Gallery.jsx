import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Camera, X } from 'lucide-react';

const categories = [
  "All",
  "Restaurant",
  "Food",
  "Events",
  "Behind the Scenes"
];

const galleryItems = [
  {
    category: "Food",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80",
    title: "Healthy Bowl",
    description: "Fresh ingredients perfectly combined"
  },
  {
    category: "Restaurant",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
    title: "Main Dining Area",
    description: "Modern and comfortable atmosphere"
  },
  {
    category: "Events",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&q=80",
    title: "Farm-to-Table Dinner",
    description: "Special dining experience under the stars"
  },
  {
    category: "Behind the Scenes",
    image: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80",
    title: "Chef's Preparation",
    description: "Our chefs at work"
  },
  {
    category: "Food",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80",
    title: "Seasonal Salad",
    description: "Fresh and colorful ingredients"
  },
  {
    category: "Events",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
    title: "Cooking Workshop",
    description: "Learning healthy cooking techniques"
  },
  {
    category: "Restaurant",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&q=80",
    title: "Outdoor Seating",
    description: "Garden terrace dining area"
  },
  {
    category: "Behind the Scenes",
    image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80",
    title: "Kitchen Team",
    description: "Our dedicated staff at work"
  },
  {
    category: "Food",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80",
    title: "Breakfast Bowl",
    description: "Start your day right"
  }
];

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
            alt="Gallery background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <Navigation />

        <div className="relative z-10 container mx-auto px-6 h-[calc(70vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <Camera className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-8">
              Our Gallery
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Take a visual journey through our restaurant, events, and culinary creations
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto space-x-8 py-6">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`text-xl font-semibold whitespace-nowrap px-4 py-2 rounded-full transition-colors ${
                  category === activeCategory
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(item)}
                className="group cursor-pointer"
              >
                <div className="relative h-80 overflow-hidden rounded-2xl">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition duration-500">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-green-400 transition"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-white">
              <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}