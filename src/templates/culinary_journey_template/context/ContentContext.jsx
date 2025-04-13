import React, { createContext, useContext } from 'react';

// Define fallback data directly in the file
const defaultSiteContent = {
  brand: {
    name: "Culinary Journey",
    logo: {
      url: null,
      text: "Culinary Journey"
    }
  },
  navigation: {
    links: [
      { label: "Home", path: "/", isEnabled: true },
      { label: "Menu", path: "/menu", isEnabled: true },
      { label: "Our Story", path: "/our-story", isEnabled: true },
      { label: "Reservations", path: "/reservation", isEnabled: true },
      { label: "Events", path: "/events", isEnabled: true },
      { label: "Blog", path: "/blog", isEnabled: true },
      { label: "Contact", path: "/contact", isEnabled: true }
    ]
  },
  hero: {
    banners: [
      {
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
        title: "A Culinary Journey",
        subtitle: "Experience the art of fine dining in the heart of the city"
      },
      {
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80",
        title: "Crafted with Passion",
        subtitle: "Every dish tells a story of tradition and innovation"
      },
      {
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
        title: "Memorable Experiences",
        subtitle: "Creating moments that last a lifetime"
      }
    ],
    autoPlayInterval: 5000
  },
  experience: {
    section: {
      title: "Our Experience",
      subtitle: "Discover what makes our restaurant special"
    },
    cards: [
      {
        icon: "UtensilsCrossed",
        title: "Culinary Excellence",
        description: "Our chefs blend traditional techniques with innovative approaches to create dishes that delight the senses and nourish the soul.",
        image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80"
      },
      {
        icon: "Wine",
        title: "Curated Wine Selection",
        description: "Our sommelier has carefully selected wines from around the world to perfectly complement our menu and enhance your dining experience.",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80"
      },
      {
        icon: "Clock",
        title: "Timeless Atmosphere",
        description: "Step into a space where time slows down, allowing you to savor each moment and create lasting memories with loved ones.",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80"
      }
    ]
  },
  story: {
    header: {
      title: "Our Story",
      subtitle: "A journey of passion and flavor"
    },
    content: [
      {
        title: "How It All Began",
        text: "Founded in 2010, our restaurant started as a small family-owned bistro with a vision to bring authentic flavors to the community.",
        image: "https://images.unsplash.com/photo-1484659619207-9165d119dafe?auto=format&fit=crop&q=80"
      },
      {
        title: "Our Philosophy",
        text: "We believe that great food comes from great ingredients. We source locally and sustainably whenever possible.",
        image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80"
      }
    ]
  },
  contact: {
    header: { 
      title: "Contact Us", 
      subtitle: "Get in touch with us" 
    },
    infoCards: {
      phone: { 
        title: "Phone", 
        numbers: ["+1 (555) 123-4567", "+1 (555) 987-6543"], 
        hours: "Available 9 AM - 5 PM" 
      },
      email: { 
        title: "Email", 
        addresses: ["info@culinaryjourney.com", "support@culinaryjourney.com"], 
        support: "24/7 Support" 
      },
      address: { 
        title: "Address", 
        street: "123 Gourmet Street", 
        city: "Foodville", 
        state: "CA", 
        zip: "90210" 
      },
      hours: { 
        title: "Hours", 
        weekday: "Monday - Friday: 11 AM - 10 PM", 
        weekend: "Saturday - Sunday: 10 AM - 11 PM", 
        note: "Closed on major holidays" 
      }
    },
    form: { 
      title: "Send us a message", 
      description: "We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible." 
    }
  },
  footer: {
    copyright: "© 2023 Culinary Journey. All rights reserved.",
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com" },
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "twitter", url: "https://twitter.com" }
    ]
  }
};

// Define fallback menu data
const defaultMenu = {
  categories: [
    {
      id: "appetizers",
      name: "Appetizers",
      description: "Start your culinary journey with these delightful small plates",
      items: [
        {
          id: "bruschetta",
          name: "Bruschetta",
          description: "Grilled bread rubbed with garlic and topped with diced tomatoes, fresh basil, and olive oil",
          price: 9.99,
          image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80"
        },
        {
          id: "calamari",
          name: "Crispy Calamari",
          description: "Tender calamari lightly fried and served with lemon aioli",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      id: "mains",
      name: "Main Courses",
      description: "Exquisite entrées prepared with the finest ingredients",
      items: [
        {
          id: "salmon",
          name: "Grilled Salmon",
          description: "Fresh Atlantic salmon with lemon butter sauce, served with seasonal vegetables",
          price: 24.99,
          image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80"
        },
        {
          id: "steak",
          name: "Filet Mignon",
          description: "8oz prime beef tenderloin, cooked to perfection with truffle mashed potatoes",
          price: 34.99,
          image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80"
        }
      ]
    }
  ]
};

export const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  // Using fallback data directly instead of fetching from root contexts
  const value = {
    siteContent: defaultSiteContent,
    content: defaultSiteContent, // Keep the original content for backward compatibility
    menu: defaultMenu,
    loading: false,
    error: null,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
