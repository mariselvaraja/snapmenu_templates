
import { Link } from 'react-router-dom';
import { 
  MapPin, Clock, Phone, Mail, ChevronRight, ArrowRight, ChevronLeft, 
  ChevronRight as ChevronRightIcon, UtensilsCrossed, Heart, Users 
} from 'lucide-react';
import { useAppDispatch, useAppSelector, addItem, CartItem } from '../../../common/redux';
import { useEffect, useState } from 'react';


export function Home() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const { items: menuItems, loading: menuLoading } = useAppSelector(state => state.menu);
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
    const gallery = siteContent?.gallery;
    const storyContent = siteContent?.story;
  const navigationBar = siteContent?.navigationBar;
  const heroData = navigationBar?.hero;

  console.log("Site Content", siteContent)
  
  
  // Handle banner transitions
  const nextBanner = () => {
    if (heroData?.banners?.length > 0) {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === heroData.banners.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevBanner = () => {
    if (heroData?.banners?.length > 0) {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === 0 ? heroData.banners.length - 1 : prevIndex - 1
      );
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (heroData?.banners?.length > 1 && heroData?.autoPlayInterval) {
      const interval = setInterval(() => {
        nextBanner();
      }, heroData.autoPlayInterval);
      
      return () => clearInterval(interval);
    }
  }, [heroData, currentBannerIndex]);
  
  const featuredItems = menuItems?.slice(0, 3).map((item: any) => ({
    name: item.name,
    image: item.image,
    price: `$${item.price}`,
    description: item.description,
    id: item.id
  })) || [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Carousel */}
      <header className="relative h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {heroData?.banners?.map((banner: { image: string; title?: string; subtitle?: string }, index: number) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={banner?.image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
            </div>
          ))}
          
          {/* Carousel Controls */}
          {heroData?.banners?.length > 1 && (
            <>
              <button 
                onClick={prevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20"
                aria-label="Previous banner"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20"
                aria-label="Next banner"
              >
                <ChevronRightIcon size={24} />
              </button>
              
              {/* Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {heroData.banners.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentBannerIndex ? 'bg-yellow-400' : 'bg-white/50'
                    }`}
                    aria-label={`Go to banner ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              {heroData?.banners?.[currentBannerIndex]?.title || "Authentic Mexican Street Tacos"}
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-delay-1">
              {heroData?.banners?.[currentBannerIndex]?.subtitle || "Experience the true taste of Mexico with our handcrafted tacos, made fresh daily with traditional recipes."}
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
                  {item.image ? (
                    // If image exists, display it
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // If no image, fill entire space with yellow background and first character
                    <div className="w-full h-full bg-yellow-400 flex items-center justify-center">
                      <span className="text-black text-6xl font-bold">
                        {item.name ? item.name.charAt(0).toUpperCase() : 'F'}
                      </span>
                    </div>
                  )}
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{storyContent?.hero?.title || "Our Story"}</h2>
              <p className="text-gray-400 mb-6 text-lg">
                {storyContent?.hero?.description || "Experience the passion behind our cuisine and the journey that brought us here."}
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
                src={storyContent?.hero?.image || "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80"}
                alt="Our story"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
          
          {/* Values Section */}
          {storyContent?.values && storyContent.values.length > 0 && (
            <div className="mt-20">
              <h3 className="text-3xl font-bold mb-10 text-center">Our Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {storyContent.values.map((value: { icon: string; title: string; description: string }, index: number) => {
                  // Render the appropriate icon based on the icon name
                  let IconComponent;
                  switch (value.icon) {
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
                      IconComponent = UtensilsCrossed; // Default fallback
                  }
                  
                  return (
                    <div key={index} className="bg-black/30 p-8 rounded-xl text-center">
                      <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        {IconComponent && <IconComponent size={32} className="text-black" />}
                      </div>
                      <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                      <p className="text-gray-400">{value.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

       <section id="locations" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Locations</h2>
            <p className="text-xl text-gray-400">Find your nearest Taco Spot</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteContent.contact.infoCards && Object.values(siteContent.contact.infoCards).map((location: any, index) => {
              let contactInfo = null;

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
      </section>
      
    </div>
  );
}
