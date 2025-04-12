import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../shared/redux';
import { fetchSiteContentRequest, SiteContent } from '../shared/redux/slices/siteContentSlice';

// Define types for the UI site content structure
export interface UISiteContent {
  navigationBar: {
    brand: {
      name: string;
      logo: {
        icon: string;
        text: string;
      }
    };
    navigation: {
      links: Array<{
        label: string;
        path: string;
        isEnabled: boolean;
      }>;
    };
    hero: {
      banners: Array<{
        image: string;
        title: string;
        subtitle: string;
      }>;
      autoPlayInterval: number;
    };
    experience: {
      section: {
        title: string;
        subtitle: string;
      };
      cards: Array<{
        icon: string;
        title: string;
        description: string;
        image: string;
      }>;
    };
  };
  story?: {
    hero: {
      image: string;
      title: string;
      description: string;
    };
    values: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  blog?: {
    header: {
      title: string;
      description: string;
    };
    posts: Array<{
      id: string;
      title: string;
      subtitle: string;
      content: string;
      image: string;
      videoThumbnail: string;
      videoUrl: string;
      chef: string;
      date: string;
      readTime: string;
    }>;
  };
  reservation?: {
    header: {
      title: string;
      description: string;
    };
    info: {
      hours: {
        weekdays: {
          label: string;
          time: string;
        };
        weekends: {
          label: string;
          time: string;
        };
        sunday: {
          label: string;
          time: string;
        };
      };
      location: {
        street: string;
        area: string;
        city: string;
        state: string;
        zip: string;
      };
      contact: {
        phone: string;
      };
      note: string;
    };
    form: {
      labels: {
        date: string;
        time: string;
        guests: string;
        name: string;
        email: string;
        phone: string;
        specialRequests: string;
      };
      placeholders: {
        name: string;
        email: string;
        phone: string;
        specialRequests: string;
      };
    };
  };
  gallery?: {
    section: {
      title: string;
      subtitle: string;
    };
    images: Array<{
      image: string;
      title: string;
      description: string;
    }>;
  };
  events?: {
    section: {
      title: string;
      subtitle: string;
    };
    items: Array<{
      image: string;
      title: string;
      description: string;
      date: string;
      time: string;
      location: string;
    }>;
  };
  contact?: {
    header: {
      title: string;
      subtitle: string;
    };
    infoCards: {
      phone: {
        title: string;
        numbers: string[];
        hours: string;
      };
      email: {
        title: string;
        addresses: string[];
        support: string;
      };
      address: {
        title: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        label: string;
      };
      hours: {
        title: string;
        weekday: string;
        weekend: string;
        note: string;
      };
    };
    form: {
      title: string;
      description: string;
      labels: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
        submitButton: string;
      };
      placeholders: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
      };
    };
    callToAction: {
      call: {
        title: string;
        phone: string;
      };
      email: {
        title: string;
        address: string;
      };
      visit: {
        title: string;
        address: string;
      };
    };
    location: {
      title: string;
      description: string;
      mapEnabled: boolean;
    };
  };
  footer: {
    newsletter: {
      title: string;
      description: string;
    };
    servicesSection: {
      title: string;
      links: Array<{
        label: string;
        url: string;
      }>;
    };
    copyright: {
      text: string;
    };
    social: {
      links: Array<{
        icon: string;
        url: string;
      }>;
    };
  };
}


// Create the context with proper typing
export const SiteContentContext = createContext<UISiteContent | undefined>(undefined);

// Props for the provider component
interface SiteContentProviderProps {
  children: ReactNode;
}

// Provider component that will wrap the app
export function SiteContentProvider({ children }: SiteContentProviderProps) {
  const dispatch = useAppDispatch();
  const { content, rawApiResponse, loading, error } = useAppSelector(state => state.siteContent);
  const [siteContent, setSiteContent] = useState<UISiteContent | undefined>(undefined);

  // Fetch site content data when the component mounts
  useEffect(() => {
    dispatch(fetchSiteContentRequest());
  }, [dispatch]);

  // Transform API data to UI format when content changes
  useEffect(() => {
    if (content && rawApiResponse) {
      try {
        // Check if data is already an object or needs parsing
        let data;
        if (typeof rawApiResponse.data === 'string') {
          data = JSON.parse(rawApiResponse.data);
        } else {
          data = rawApiResponse.data;
        }
        
        // Log the data to debug
        console.log('SiteContentContext: Transformed data from API', data);
        
        // Make sure blog data is properly mapped from the API response
        if (content.blog && content.blog.length > 0) {
          // If we have blog data in the content, make sure it's properly formatted for the UI
          const blogData = {
            header: {
              title: "Our Blog",
              description: "Culinary insights, recipes, and stories from our kitchen"
            },
            posts: content.blog.map(post => ({
              id: post.id.toString(),
              title: post.title,
              subtitle: post.excerpt,
              content: post.content,
              image: post.image,
              videoThumbnail: "",
              videoUrl: "",
              chef: post.author,
              date: post.date,
              readTime: "5 min"
            }))
          };
          
          // Ensure blog data is included in the site content
          data = {
            ...data,
            blog: blogData
          };
          
          console.log('SiteContentContext: Blog data mapped', blogData);
        }
        
        // Make sure gallery data is properly mapped from the API response
        if (content.gallery && content.gallery.length > 0) {
          // If we have gallery data in the content, make sure it's properly formatted for the UI
          const galleryData = {
            section: {
              title: "Our Gallery",
              subtitle: "Explore our restaurant and cuisine through our gallery"
            },
            images: content.gallery.map(item => ({
              image: item.image,
              title: item.title,
              description: item.description
            }))
          };
          
          // Ensure gallery data is included in the site content
          data = {
            ...data,
            gallery: galleryData
          };
          
          console.log('SiteContentContext: Gallery data mapped', galleryData);
        }
        
        // Make sure events data is properly mapped from the API response
        if (content.events && content.events.length > 0) {
          // If we have events data in the content, make sure it's properly formatted for the UI
          const eventsData = {
            section: {
              title: "Upcoming Events",
              subtitle: "Join us for special culinary experiences and celebrations"
            },
            items: content.events.map(event => ({
              image: event.image,
              title: event.title,
              description: event.description,
              date: event.date,
              time: "7:00 PM - 10:00 PM", // Default time if not provided
              location: "Main Dining Room" // Default location if not provided
            }))
          };
          
          // Ensure events data is included in the site content
          data = {
            ...data,
            events: eventsData
          };
          
          console.log('SiteContentContext: Events data mapped', eventsData);
        }
        
        setSiteContent(data);
      } catch (error) {
        console.error('Error parsing site content data:', error);
      }
    }
  }, [content, rawApiResponse]);

  // Log loading and error states
  useEffect(() => {
    if (loading) {
      console.log('SiteContentContext: Loading site content data...');
    }
    
    if (error) {
      console.error('SiteContentContext: Error loading site content data:', error);
    }
  }, [loading, error]);

  // Provide a fallback value if siteContent is undefined
  const fallbackValue: UISiteContent = {
    navigationBar: {
      brand: {
        name: "Pizza Restaurant",
        logo: {
          icon: "/logo.png",
          text: "Pizza Restaurant"
        }
      },
      navigation: {
        links: [
          { label: "Home", path: "/", isEnabled: true },
          { label: "Menu", path: "/menu", isEnabled: true },
          { label: "About", path: "/about", isEnabled: true },
          { label: "Gallery", path: "/gallery", isEnabled: true },
          { label: "Contact", path: "/contact", isEnabled: true }
        ]
      },
      hero: {
        banners: [
          {
            image: "/hero-1.jpg",
            title: "Welcome to Pizza Restaurant",
            subtitle: "Delicious pizzas made with fresh ingredients"
          }
        ],
        autoPlayInterval: 5000
      },
      experience: {
        section: {
          title: "Our Experience",
          subtitle: "What makes us special"
        },
        cards: [
          {
            icon: "pizza",
            title: "Fresh Ingredients",
            description: "We use only the freshest ingredients",
            image: "/ingredients.jpg"
          }
        ]
      }
    },
    footer: {
      newsletter: {
        title: "Subscribe to our newsletter",
        description: "Get updates on our latest offers"
      },
      servicesSection: {
        title: "Our Services",
        links: [
          { label: "Delivery", url: "#" },
          { label: "Catering", url: "#" }
        ]
      },
      copyright: {
        text: "© 2025 Pizza Restaurant. All rights reserved."
      },
      social: {
        links: [
          { icon: "facebook", url: "#" },
          { icon: "instagram", url: "#" },
          { icon: "twitter", url: "#" }
        ]
      }
    }
  };

  // Show loading indicator while content is being fetched
  if (loading && !siteContent) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-gray-700 font-medium">Your website is loading...</p>
        </div>
      </div>
    );
  }

  // Show error message if there was an error loading the content
  if (error && !siteContent) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Content</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchSiteContentRequest())}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Provide the context value with proper error handling
  return (
    <SiteContentContext.Provider value={siteContent || fallbackValue}>
      {children}
    </SiteContentContext.Provider>
  );
}

// Custom hook to use the site content context with proper typing
export function useSiteContent(): UISiteContent {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }

  return context;
}
