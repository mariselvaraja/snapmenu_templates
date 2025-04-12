/**
 * Endpoint configuration for the application
 * This file centralizes all API endpoint paths
 */

// Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API paths from environment variables
const MENU_API_PATH = import.meta.env.VITE_MENU_VIEW_API_PATH;
const SITE_CONTENT_API_PATH = import.meta.env.VITE_SITE_CONTENT_VIEW_API_PATH;
const PLACE_ORDER_API_PATH = import.meta.env.VITE_PLACE_ORDER_API_PATH;
const RESTAURANT_DETAILS_API_PATH = import.meta.env.VITE_RESTAURANT_DETAILS_API_PATH;


// Function to get domain from URL
const getDomainFromUrl = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Extract subdomain or domain name (remove TLD)
    const domainParts = hostname.split('.');
    // For localhost or IP addresses, return a default domain
    if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return 'tonyspizza'; // Default domain for development
    }
    // Return the subdomain or main domain name
    return domainParts.length > 2 ? domainParts[0] : domainParts[0];
  }
  // Fallback for SSR or when window is not available
  return 'tonyspizza';
};

// Endpoint configuration object
export const endpoints = {
  // Menu endpoints
  menu: {
    getAll: `${API_BASE_URL}${MENU_API_PATH}`,
  },
  
  // Site content endpoints
  siteContent: {
    getAll: `${API_BASE_URL}${SITE_CONTENT_API_PATH}`,
    getSection: (section: string) => `${API_BASE_URL}${SITE_CONTENT_API_PATH}/${section}`,
  },
  
  // Cart endpoints
  cart: {
    placeOrder: `${API_BASE_URL}${PLACE_ORDER_API_PATH}`,
  },
  
  // Restaurant endpoints
  restaurant: {
    getInfo: `${API_BASE_URL}${RESTAURANT_DETAILS_API_PATH}?domain=${getDomainFromUrl()}`,
  },
};

// Environment configuration
export const environment = {
  isDevelopment: import.meta.env.VITE_ENV === 'development',
  isTest: import.meta.env.VITE_ENV === 'test',
  isProduction: import.meta.env.VITE_ENV === 'production',
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
};

export default endpoints;
