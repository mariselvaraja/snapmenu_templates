/**
 * Endpoint configuration for the application
 * This file centralizes all API endpoint paths
 */

// Get environment-specific variables
const ENV = import.meta.env.VITE_ENV || 'development';

// Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL_PYTHON = import.meta.env.VITE_API_BASE_URL_PYTHON;

// API paths from environment variables
const MENU_API_PATH = import.meta.env.VITE_MENU_VIEW_API_PATH || import.meta.env.VITE_MENU_API_PATH;
const SITE_CONTENT_API_PATH = import.meta.env.VITE_SITE_CONTENT_VIEW_API_PATH || import.meta.env.VITE_SITE_CONTENT_API_PATH;
const PLACE_ORDER_API_PATH = import.meta.env.VITE_PLACE_ORDER_API_PATH || import.meta.env.VITE_CART_API_PATH;
const RESTAURANT_DETAILS_API_PATH = import.meta.env.VITE_RESTAURANT_DETAILS_API_PATH;
const RESTAURANT_DETAILS_API_PATH_PYTHON = import.meta.env.VITE_RESTAURANT_DETAILS_API_PATH_PYTHON;

// Function to get domain from URL
const getDomainFromUrl = () => {
  const url = window.location.href;
  const { hostname } = new URL(url);
        const domainParts = hostname.split('.');
 
        // Assuming the last two parts are the domain and TLD
        // if (domainParts.length > 2) {
        //     return domainParts.slice(0, -2).join('.');
        // }
        return "pizza2"; // No subdomain present, use tonyspizza as default
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
  },
  
  // Cart endpoints
  cart: {
    placeOrder: `${API_BASE_URL}${PLACE_ORDER_API_PATH}`,
  },
  
  // Restaurant endpoints
  restaurant: {
    getInfo: `${API_BASE_URL_PYTHON}${RESTAURANT_DETAILS_API_PATH_PYTHON}?domain=${getDomainFromUrl()}`,
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
