import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, ChevronRight, ArrowRight } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';
import { useRootMenu } from '../../../../context/RootMenuContext';
import { Footer } from '../components/Footer';
import { useMenu } from '../context/MenuContext';
import Blog from '../components/Blog';


export function Home() {
  const { siteContent: rootSiteContent } = useRootSiteContent() as { siteContent: any };
  const { menu: localMenu } = useMenu();
  const { menu: rootMenu } = useRootMenu() as { menu: any, loading: boolean, error: any };
  
  // Default site content with required properties
  const defaultSiteContent = {
    brand: {
      name: "Default Restaurant",
      logo: {
        icon: "Utensils",
        text: "Default Restaurant"
      }
    },
    hero: {
      banners: [
        {
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
          title: "A Culinary Journey",
          subtitle: "Experience the art of fine dining in the heart of the city"
        }
      ]
    },
    story: {
      hero: { 
        title: 'Our Story', 
        description: 'Our restaurant story', 
        image: '' 
      },
      values: []
    },
    contact: {
      infoCards: {}
    }
  };

  // Transform the site content structure if needed
  const siteContent = rootSiteContent ? {
    // Use navigationBar properties if available, otherwise use top-level properties or defaults
    brand: rootSiteContent.navigationBar?.brand || rootSiteContent.brand || defaultSiteContent.brand,
    hero: rootSiteContent.navigationBar?.hero || rootSiteContent.hero || defaultSiteContent.hero,
    story: rootSiteContent.story || defaultSiteContent.story,
    contact: rootSiteContent.contact || defaultSiteContent.contact
  } : defaultSiteContent;
  
  // Add a check to ensure hero and banners exist and have at least one item
  const heroBanner = siteContent?.hero?.banners && siteContent.hero.banners.length > 0 
    ? siteContent.hero.banners[0] 
    : { image: '', title: 'Default Title', subtitle: 'Default Subtitle' };
  
  // Get the first 3 items from the root menu context
  const featuredItems = React.useMemo(() => {
    // First try to get items from root menu
    if (rootMenu && typeof rootMenu === 'object') {
      // Check if rootMenu has a menu property
      if (rootMenu.menu) {
        // Flatten all categories into a single array
        const allItems = Object.values(rootMenu.menu).flat();
        
        // Get the first 3 items
        return allItems.slice(0, 3).map((item: any) => ({
          name: item.name || 'Unnamed Item',
          image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80',
          price: `$${item.price || '0.00'}`,
          description: item.description || 'No description available',
          id: item.id || `item-${Math.random().toString(36).substr(2, 9)}`
        }));
      }
      
      // If rootMenu is an array itself (some implementations might return the menu directly)
      if (Array.isArray(rootMenu)) {
        const allItems = rootMenu;
        
        // Get the first 3 items
        return allItems.slice(0, 3).map((item: any) => ({
          name: item.name || 'Unnamed Item',
          image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80',
          price: `$${item.price || '0.00'}`,
          description: item.description || 'No description available',
          id: item.id || `item-${Math.random().toString(36).substr(2, 9)}`
        }));
      }
      
      // If we reach here, rootMenu exists but doesn't have a recognizable structure
      // Return an empty array
      return [];
    }
    
    // Fallback to local menu if root menu is not available
    return localMenu?.starters?.slice(0, 3).map((item: any) => ({
      name: item.name,
      image: item.image,
      price: `$${item.price}`,
      description: item.description,
      id: item.id
    })) || [];
  }, [rootMenu, localMenu]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <header className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src={heroBanner.image}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
        </div>
        
        <Navigation />

        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Authentic Mexican Street Tacos
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-delay-1">
              Experience the true taste of Mexico with our handcrafted tacos, made fresh daily with traditional recipes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
              <button className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition flex items-center justify-center">
                Order Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <Link to="/menu" className="border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition text-center">
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Section */}
      <section id="featured" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Items</h2>
            <p className="text-xl text-gray-400">Try our most popular dishes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item: any, index: number) => (
              <Link key={index} to={`/menu/${item.id}`} className="bg-zinc-900 rounded-xl overflow-hidden group hover:scale-105 transition duration-300 block">
                <div className="relative h-64">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <h3 className="text-2xl font-bold">{item.name}</h3>
                      <span className="text-yellow-400 text-xl font-semibold">{item.price}</span>
                    </div>
                    <p className="text-gray-300 mt-2">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/menu" className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-300 transition inline-flex items-center">
              View Full Menu
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{rootSiteContent?.story?.hero?.title || 'Our Story'}</h2>
              <p className="text-gray-400 mb-6 text-lg">
                {rootSiteContent?.story?.hero?.description || 'Our restaurant story'}
              </p>
              <p className="text-gray-400 mb-8 text-lg">
                What started as a single food truck has grown into multiple locations, each maintaining the same dedication to quality and authenticity that we began with.
              </p>
              <button className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition text-lg">
                <span>Learn more about our story</span>
                <ChevronRight className="ml-2 w-6 h-6" />
              </button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80"
                alt="Our story"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

       {/* <section id="contact" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{rootSiteContent?.contact?.header?.title || "Contact Us"}</h2>
            <p className="text-xl text-gray-400">{rootSiteContent?.contact?.header?.subtitle || "Get in touch with us"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rootSiteContent?.contact?.infoCards && Object.values(rootSiteContent.contact.infoCards).map((location: any, index) => {
              let contactInfo: React.ReactNode = null;

              // Check if this is an address card
              if ('street' in location && 'city' in location && 'state' in location && 'zip' in location) {
                contactInfo = (
                  <p className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0" />
                    {location.street}, {location.city}, {location.state}, {location.zip}
                  </p>
                );
              } 
              // Check if this is a hours card
              else if ('hours' in location) {
                contactInfo = (
                  <p className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0" />
                    {location.hours}
                  </p>
                );
              } 
              // Check if this is a phone card
              else if ('numbers' in location) {
                contactInfo = (
                  <p className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0" />
                    {location.numbers.join(', ')}
                  </p>
                );
              } 
              // Check if this is an email card
              else if ('addresses' in location) {
                contactInfo = (
                  <p className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0" />
                    {location.addresses.join(', ')}
                  </p>
                );
              } 
              // Fallback for any other type of card
              else {
                contactInfo = (
                  <p>No contact information available</p>
                );
              }

              return (
                <div key={index} className="bg-zinc-900 rounded-xl overflow-hidden group hover:scale-105 transition duration-300">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4">{location.title}</h3>
                    <div className="space-y-3 text-gray-400">
                      {contactInfo}
                    </div>
                   
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}
      <Footer />
    </div>
  );
}
