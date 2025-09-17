/**
 * Endpoint configuration for the application
 * This file centralizes all API endpoint paths
 */

// Get environment-specific variables
const ENV = import.meta.env.VITE_ENV || 'development';

// Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL_AUTH = import.meta.env.VITE_API_AUTH_BASE_URL;

// API paths from environment variables
const MENU_API_PATH = import.meta.env.VITE_MENU_VIEW_API_PATH
const SITE_CONTENT_API_PATH = import.meta.env.VITE_SITE_CONTENT_VIEW_API_PATH
const PLACE_ORDER_API_PATH = import.meta.env.VITE_PLACE_ORDER_API_PATH
const RESTAURANT_DETAILS_API_PATH_PYTHON = import.meta.env.VITE_RESTAURANT_DETAILS_API_PATH_PYTHON;
const GET_IN_DINING_ORDERS_PATH = import.meta.env.VITE_GET_IN_DINING_ORDERS || "/getDiningOrder";
const GET_INDINING_ORDERS_HISTORY_PATH = import.meta.env.VITE_GET_INDINING_ORDERS || "/getDiningOrder";
const PLACE_IN_DINING_ORDER_PATH = import.meta.env.VITE_PLACE_IN_DINING_ORDER || "/makeDiningOrders";
const UPDATE_IN_DINING_ORDERS_PATH = import.meta.env.VITE_UPDATE_IN_DINING_ORDERS || "/updateDiningDetails";
const GET_TABLE_AVAILABILITY_PATH = import.meta.env.VITE_GET_TABLE_AVAILABILITY || "/table/available";
const MAKE_RESERVATION_PATH = import.meta.env.VITE_MAKE_RESERVATION || "/makeReservation";
const GET_TABLE_STATUS_PATH = import.meta.env.VITE_GET_TABLE_STATUS || "/table/view";
const GET_PAYMENT_INFO = import.meta.env.VITE_GET_PAYMENT_INFO || "/getTpnConfig";
const MAKE_PAYMENT_PATH = import.meta.env.VITE_MAKE_PAYMENT || "/paymentGateway/inDining";
const COMBO_API_PATH = import.meta.env.VITE_COMBO_API_PATH || "/combos";
const PARTY_ORDERS_API_PATH = import.meta.env.VITE_PARTY_ORDERS_API_PATH || "/party";
const WEBSOCKET_BASE_URL = import.meta.env.VITE_WEBSOCKET_BASE_URL || "wss://websocket.genaiembed.ai/ws";

// Function to get domain from URL
const getDomainFromUrl = () => {
  const url = window.location.href;
  const { hostname } = new URL(url);

  if(url.includes('ctbiryani'))
  {
    return 'ctbiryani'
  }
  else
  {
    const domainParts = hostname.split('.');
    if (domainParts.length > 2) {
      if(domainParts.indexOf('www') == -1)
      {
        return domainParts.slice(0, -2).join('.');
      }
      else
      {
        return domainParts[1]
      }
    }
  }
  // return "uat"
  // return "spanish"
  // return "pizza"
   return "mayajas"; 
  // return 'annapurna'
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
    getInfo: `${API_BASE_URL_AUTH}${RESTAURANT_DETAILS_API_PATH_PYTHON}?domain=${getDomainFromUrl()}`,
  },

  payment: {
    info: `${API_BASE_URL}${GET_PAYMENT_INFO}`,
    makePayment: `${API_BASE_URL}${MAKE_PAYMENT_PATH}`,
    requestCheck: `${API_BASE_URL}/pos/customer/checkoutRequest`
  },
  
  // In-dining order endpoints
  inDiningOrder: {
    get: `${API_BASE_URL}${GET_IN_DINING_ORDERS_PATH}`,
    getHistory: `${API_BASE_URL}${GET_INDINING_ORDERS_HISTORY_PATH}`,
    place: `${API_BASE_URL}${PLACE_IN_DINING_ORDER_PATH}`,
    update: `${API_BASE_URL}${UPDATE_IN_DINING_ORDERS_PATH}`,
  },

  tableOrder:{
    availability:`${API_BASE_URL}${GET_TABLE_AVAILABILITY_PATH}`,
    makeReservation: `${API_BASE_URL}${MAKE_RESERVATION_PATH}`,
    status: `${API_BASE_URL}${GET_TABLE_STATUS_PATH}`,
  },

  // Combo endpoints
  combo: {
    getAll: `${API_BASE_URL}${COMBO_API_PATH}`,
  },

  // Party orders endpoints
  partyOrders: {
    getAll: `${API_BASE_URL}${PARTY_ORDERS_API_PATH}`,
  },

  // WebSocket endpoints
  webSocket: {
    getNewOrdersV2: WEBSOCKET_BASE_URL,
  },

baseUrl: {
  apiBaseUrl: API_BASE_URL
}
};

// Environment configuration
export const environment = {
  isDevelopment: import.meta.env.VITE_ENV === 'development',
  isTest: import.meta.env.VITE_ENV === 'test',
  isProduction: import.meta.env.VITE_ENV === 'production',
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
};

export default endpoints;
