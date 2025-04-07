import React, { createContext, useContext } from 'react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

// Create SiteContentContext
export const SiteContentContext = createContext(null);

// SiteContentProvider Component
export const SiteContentProvider = ({ children, restaurant_id, isPreview }) => {
  // Get data from root context
  const { siteContent: rootSiteContent, loading: rootLoading, error: rootError } = useRootSiteContent();

  // Default site content with required properties
  const defaultSiteContent = {
    brand: {
      name: "Default Restaurant",
      logo: {
        icon: "Utensils",
        text: "Default Restaurant"
      }
    },
    navigation: {
      links: []
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
    experience: {
      section: {
        title: "The Art of Fine Dining",
        subtitle: "Discover the pillars of our gastronomic excellence"
      },
      cards: []
    },
    reservation: {
      header: {
        title: "Book a Table",
        description: "Reserve your table for an unforgettable dining experience"
      },
      form: {
        labels: {
          date: "Date",
          time: "Time",
          guests: "Guests",
          name: "Name",
          email: "Email",
          phone: "Phone",
          specialRequests: "Special Requests"
        },
        placeholders: {
          name: "Your Name",
          email: "Your Email",
          phone: "Your Phone",
          specialRequests: "Any special requests?"
        }
      },
      info: {
        hours: {
          weekdays: { label: "Weekdays", time: "11 AM - 10 PM" },
          weekends: { label: "Weekends", time: "10 AM - 11 PM" },
          sunday: { label: "Sunday", time: "10 AM - 9 PM" }
        },
        location: {
          street: "123 Main Street",
          city: "Cityville",
          state: "State",
          zip: "12345"
        },
        contact: {
          phone: "(123) 456-7890"
        },
        note: "Kitchen closes 30 minutes before closing"
      }
    },
    story: {
      hero: {
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80",
        title: "Our Story",
        description: "The journey of our restaurant from its humble beginnings to where we are today."
      },
      values: [
        {
          icon: "Heart",
          title: "Passion",
          description: "We put our heart into every dish we serve."
        },
        {
          icon: "Leaf",
          title: "Fresh Ingredients",
          description: "We source only the freshest ingredients for our dishes."
        },
        {
          icon: "Users",
          title: "Community",
          description: "We believe in building a community around good food."
        }
      ]
    },
    blog: {
      header: {
        title: "Our Blog",
        description: "Latest news and updates from our restaurant."
      },
      posts: []
    },
    gallery: {
      section: {
        title: "Our Gallery",
        subtitle: "A visual journey through our culinary creations."
      },
      images: []
    },
    events: {
      section: {
        title: "Upcoming Events",
        subtitle: "Join us for special events and celebrations."
      },
      items: []
    },
    contact: {
      header: {
        title: "Contact Us",
        subtitle: "Get in touch with us for reservations or inquiries."
      },
      infoCards: {
        phone: {
          title: "Phone",
          numbers: ["(123) 456-7890"],
          hours: "Mon-Fri, 9am-5pm"
        },
        email: {
          title: "Email",
          addresses: ["info@restaurant.com"],
          support: "24/7 Support"
        },
        address: {
          title: "Address",
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zip: "12345",
          label: "Main Location"
        },
        hours: {
          title: "Hours",
          weekday: "Mon-Fri: 11am-10pm",
          weekend: "Sat-Sun: 10am-11pm",
          note: "Kitchen closes 30 minutes before closing"
        }
      },
      form: {
        title: "Send us a message",
        description: "We'd love to hear from you.",
        labels: {
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email",
          phone: "Phone",
          subject: "Subject",
          message: "Message",
          submitButton: "Send Message"
        },
        placeholders: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "(123) 456-7890",
          subject: "Reservation Inquiry",
          message: "I'd like to make a reservation for..."
        }
      },
      callToAction: {
        call: {
          title: "Call Us",
          phone: "(123) 456-7890"
        },
        email: {
          title: "Email Us",
          address: "info@restaurant.com"
        },
        visit: {
          title: "Visit Us",
          address: "123 Main St, Anytown, CA 12345"
        }
      },
      location: {
        title: "Our Location",
        description: "Find us in the heart of the city.",
        mapEnabled: false
      }
    },
    footer: {
      newsletter: {
        title: "Subscribe to Our Newsletter",
        description: "Stay updated with our latest news and offers."
      },
      copyright: {
        text: "© 2025 Default Restaurant. All rights reserved."
      },
      social: {
        links: [
          {
            icon: "Facebook",
            href: "#",
            ariaLabel: "Facebook"
          },
          {
            icon: "Instagram",
            href: "#",
            ariaLabel: "Instagram"
          },
          {
            icon: "Twitter",
            href: "#",
            ariaLabel: "Twitter"
          }
        ]
      },
      linkGroups: [
        {
          title: "Quick Links",
          links: [
            {
              label: "Home",
              href: "/"
            },
            {
              label: "Menu",
              href: "/menu"
            },
            {
              label: "About",
              href: "/about"
            },
            {
              label: "Contact",
              href: "/contact"
            }
          ]
        },
        {
          title: "Our Services",
          links: [
            {
              label: "Catering",
              href: "#"
            },
            {
              label: "Private Events",
              href: "#"
            },
            {
              label: "Delivery",
              href: "#"
            }
          ]
        }
      ]
    }
  };

  // Transform the site content structure if needed
  let transformedSiteContent;
  if (rootSiteContent) {
    // Map the structure from root context to the expected structure
    transformedSiteContent = {
      // Use navigationBar properties if available, otherwise use top-level properties or defaults
      brand: rootSiteContent.navigationBar?.brand || rootSiteContent.brand || defaultSiteContent.brand,
      navigation: rootSiteContent.navigationBar?.navigation || rootSiteContent.navigation || defaultSiteContent.navigation,
      hero: rootSiteContent.navigationBar?.hero || rootSiteContent.hero || defaultSiteContent.hero,
      experience: rootSiteContent.navigationBar?.experience || rootSiteContent.experience || defaultSiteContent.experience,
      
      // Use top-level properties if available, otherwise use defaults
      story: rootSiteContent.story || defaultSiteContent.story,
      blog: rootSiteContent.blog || defaultSiteContent.blog,
      gallery: rootSiteContent.gallery || defaultSiteContent.gallery,
      events: rootSiteContent.events || defaultSiteContent.events,
      contact: rootSiteContent.contact || defaultSiteContent.contact,
      footer: rootSiteContent.footer || defaultSiteContent.footer,
      reservation: rootSiteContent.reservation || defaultSiteContent.reservation
    };
  } else {
    transformedSiteContent = defaultSiteContent;
  }

  const value = {
    siteContent: transformedSiteContent,
    loading: rootLoading,
    error: rootError,
    restaurant_id,
    isPreview,
  };

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

// useSiteContent Hook
export const useSiteContent = () => {
  return useContext(SiteContentContext);
};
