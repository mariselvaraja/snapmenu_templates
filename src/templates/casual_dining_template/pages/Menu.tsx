import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';

interface MenuItem {
  id: string | number;
  name: string;
  description: string;
  price: string | number;
  image: string;
  category: string;
  subCategory?: string;
  calories?: number;
  nutrients?: {
    protein?: string;
    carbs?: string;
    fat?: string;
    sat?: string;
    unsat?: string;
    trans?: string;
    sugar?: string;
    fiber?: string;
  };
  dietary?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
  };
  allergens?: string[];
  ingredients?: string[];
  pairings?: string[];
}

export function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isNavSticky, setIsNavSticky] = useState(false);
  
  // Get menu items from Redux
  const menuItems = useAppSelector(state => state.menu.items);
  
  // Group menu items by category
  const menuByCategory: Record<string, MenuItem[]> = {};
  
  menuItems.forEach((item: MenuItem) => {
    if (!menuByCategory[item.category]) {
      menuByCategory[item.category] = [];
    }
    menuByCategory[item.category].push(item);
  });
  
  const categories = Object.entries(menuByCategory);
  
  const filteredCategories = activeCategory === "All"
    ? categories
    : categories.filter(([categoryName]) => categoryName === activeCategory);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsNavSticky(scrollPosition > window.innerHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    menuSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80"
            alt="Menu hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">Our Menu</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 animate-fade-in-delay-1">
            Authentic Mexican street food made with fresh ingredients and traditional recipes
          </p>
          <button 
            onClick={scrollToMenu}
            className="animate-fade-in-delay-2 mt-8 p-4 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 transition group"
          >
            <ChevronDown className="w-8 h-8 text-yellow-400 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Sticky Category Navigation */}
      <div className={`sticky top-0 z-50 transition-all duration-300 ${
        isNavSticky ? 'bg-black/90 backdrop-blur-lg shadow-xl' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                activeCategory === "All"
                  ? "bg-yellow-400 text-black"
                  : "bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50"
              }`}
            >
              All
            </button>
            {categories.map(([categoryName], index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(categoryName)}
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                  activeCategory === categoryName
                    ? "bg-yellow-400 text-black"
                    : "bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50"
                }`}
              >
                {categoryName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div id="menu-section" className="max-w-7xl mx-auto px-6 py-20">
        <div className="space-y-32">
          {filteredCategories.map(([categoryName, categoryData], index) => (
            <div key={index} className="relative scroll-mt-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image Side */}
                <div className="relative aspect-[4/3] lg:aspect-square">
                  <img
                    src={categoryData[0].image}
                    alt={categoryName}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h2>
                  </div>
                </div>

                {/* Menu Items Side */}
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-8 lg:p-12">
                  <div className="space-y-8">
                    {categoryData.map((item: MenuItem, itemIndex: number) => (
                        <Link
                          key={itemIndex}
                          to={`/menu/${item.id}`}
                          className="group hover:bg-zinc-800/50 p-4 rounded-xl transition-all duration-300 block"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-2xl font-bold group-hover:text-yellow-400 transition">
                              {item.name}
                            </h3>
                            <div className="flex items-center">
                              <span className="text-yellow-400 text-xl font-semibold">{item.price}</span>
                              <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1" />
                            </div>
                          </div>
                          <p className="text-gray-400 text-lg">{item.description}</p>
                        </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-32">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80"
            alt="CTA background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Visit one of our locations or order online for pickup. Experience the authentic taste of Mexico today.
          </p>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
