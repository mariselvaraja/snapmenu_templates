import React, { createContext, useContext, ReactNode } from 'react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

// Define types for site content structure
export interface SiteContent {
  brand: {
    name: string;
    logo: {
      icon: string;
      text: string;
    };
  };
  navigation: {
    links: {
      label: string;
      path: string;
      isEnabled: boolean;
    }[];
  };
  hero: any;
  experience: any;
  story: {
    hero: {
      image: string;
      title: string;
      description: string;
    };
    values: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
  blog: {
    header: {
      title: string;
      description: string;
    };
    posts: {
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
    }[];
  };
  reservation: {
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
  footer: any;
  gallery:any;
  events: {
    section: {
      title: string;
      subtitle: string;
    };
    items: {
      image: string;
      title: string;
      description: string;
      date: string;
      time: string;
      location: string;
    }[];
  };
  contact: {
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
}


// Create the context with default undefined value
export const SiteContentContext = createContext<SiteContent | undefined>(undefined);

// Props for the provider component
interface SiteContentProviderProps {
  children: ReactNode;
}

// Provider component that will wrap the app
export function SiteContentProvider({ children }: SiteContentProviderProps) {
  // Get data from root context
  const rootContext = useRootSiteContent() as any;
  console.log("Root context:", rootContext);
  
  // Extract siteContent from root context
  const rootSiteContent = rootContext?.siteContent;
  console.log("Root site content:", rootSiteContent);
  
  // Default site content with required properties
  const defaultSiteContent: SiteContent = {
    brand: {
      name: "Default Restaurant",
      logo: {
        icon: "Pizza",
        text: "Default Restaurant"
      }
    },
    navigation: {
      links: []
    },
    hero: {},
    experience: {},
    story: {
      hero: {
        image: "",
        title: "",
        description: ""
      },
      values: []
    },
    blog: {
      header: {
        title: "",
        description: ""
      },
      posts: []
    },
    reservation: {
      header: {
        title: "Reserve Your Table",
        description: "Join us for an unforgettable dining experience"
      },
      info: {
        hours: {
          weekdays: {
            label: "Monday - Thursday",
            time: "5:00 PM - 10:00 PM"
          },
          weekends: {
            label: "Friday - Saturday",
            time: "5:00 PM - 11:00 PM"
          },
          sunday: {
            label: "Sunday",
            time: "5:00 PM - 9:00 PM"
          }
        },
        location: {
          street: "123 Culinary Avenue",
          area: "Gastronomy District",
          city: "New York",
          state: "NY",
          zip: "10001"
        },
        contact: {
          phone: "(212) 555-0123"
        },
        note: "For parties larger than 8, please call us directly to arrange your reservation."
      },
      form: {
        labels: {
          date: "Select Date",
          time: "Select Time",
          guests: "Number of Guests",
          name: "Full Name",
          email: "Email Address",
          phone: "Phone Number",
          specialRequests: "Special Requests"
        },
        placeholders: {
          name: "Enter your full name",
          email: "Enter your email address",
          phone: "Enter your phone number",
          specialRequests: "Any dietary restrictions or special occasions?"
        }
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
            platform: "Facebook",
            href: "#",
            ariaLabel: "Facebook"
          },
          {
            platform: "Instagram",
            href: "#",
            ariaLabel: "Instagram"
          },
          {
            platform: "Twitter",
            href: "#",
            ariaLabel: "Twitter"
          }
        ]
      },
      servicesSection: {
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
    },
    gallery: {
      section: {
        title: "",
        subtitle: ""
      },
      images: []
    },
    events: {
      section: {
        title: "",
        subtitle: ""
      },
      items: []
    },
    contact: {
      header: {
        title: "Contact Us",
        subtitle: "Get in touch with us for any questions or concerns. We're here to help!"
      },
      infoCards: {
        phone: {
          title: "Phone",
          numbers: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
          hours: "Mon-Fri from 8am to 8pm"
        },
        email: {
          title: "Email",
          addresses: ["info@pizzaplanet.com", "support@pizzaplanet.com"],
          support: "Online support"
        },
        address: {
          title: "Address",
          street: "123 Pizza Street",
          city: "New York",
          state: "NY",
          zip: "10001",
          label: "Headquarters"
        },
        hours: {
          title: "Working Hours",
          weekday: "Monday - Friday: 8am - 8pm",
          weekend: "Saturday - Sunday: 9am - 7pm",
          note: "Open 7 days a week"
        }
      },
      form: {
        title: "Get in Touch",
        description: "Have questions about our menu, services, or want to provide feedback? We'd love to hear from you.",
        labels: {
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email",
          phone: "Phone Number",
          subject: "Subject",
          message: "Message",
          submitButton: "Send Message"
        },
        placeholders: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "+1 (555) 000-0000",
          subject: "How can we help?",
          message: "Your message..."
        }
      },
      callToAction: {
        call: {
          title: "Call Us",
          phone: "+1 (555) 123-4567"
        },
        email: {
          title: "Email Us",
          address: "info@pizzaplanet.com"
        },
        visit: {
          title: "Visit Us",
          address: "123 Pizza Street, New York"
        }
      },
      location: {
        title: "Our Location",
        description: "Visit us at our restaurant or headquarters. We're conveniently located in the heart of New York City.",
        mapEnabled: true
      }
    }
  };
  
  // Use root data instead of local data, with fallback to default
  let contextValue: SiteContent;
  
  if (rootSiteContent) {
    // Map the structure from root context to the expected structure
    contextValue = {
      // Use navigationBar properties if available, otherwise use defaults
      brand: rootSiteContent.navigationBar?.brand || rootSiteContent.brand || defaultSiteContent.brand,
      navigation: rootSiteContent.navigationBar?.navigation || rootSiteContent.navigation || defaultSiteContent.navigation,
      hero: rootSiteContent.navigationBar?.hero || rootSiteContent.hero || defaultSiteContent.hero,
      experience: rootSiteContent.navigationBar?.experience || rootSiteContent.experience || defaultSiteContent.experience,
      
      // Use top-level properties if available, otherwise use defaults
      story: rootSiteContent.story || defaultSiteContent.story,
      blog: rootSiteContent.blog || defaultSiteContent.blog,
      
      // Use the reservation data from root context if available
      reservation: rootSiteContent.reservation || defaultSiteContent.reservation,
      
      footer: rootSiteContent.footer || defaultSiteContent.footer,
      gallery: rootSiteContent.gallery || defaultSiteContent.gallery,
      events: rootSiteContent.events || defaultSiteContent.events,
      contact: rootSiteContent.contact || defaultSiteContent.contact
    };
  } else {
    contextValue = defaultSiteContent;
  }
  
  console.log("Final context value:", contextValue);

  return (
    <SiteContentContext.Provider value={contextValue}>
      {children}
    </SiteContentContext.Provider>
  );
}

// Custom hook to use the site content context
export function useSiteContent() {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }

  return context;
}
