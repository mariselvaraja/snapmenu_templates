import React from 'react';
import { Route } from 'react-router-dom';

// This file contains common routes that can be shared across different templates
// You can define reusable route configurations here

// Example of a common route configuration
export const createCommonRoutes = (components: {
  notFound?: React.ComponentType;
  // Add more component types as needed
}) => {
  const { notFound } = components;
  
  return [
    // Example of a common route - can be customized based on project needs
    notFound && <Route path="*" element={React.createElement(notFound)} key="not-found" />,
  ].filter(Boolean);
};

// Export other common route utilities as needed
export const commonRoutePaths = {
  home: '/',
  menu: '/menu',
  locations: '/locations',
  about: '/about',
  contact: '/contact',
  order: '/order',
  inDiningOrder: '/placeindiningorder',
  inDiningOrderWithTable: '/placeindiningorder/:table',
  events: '/events',
  gallery: '/gallery',
  blog: '/blog',
  blogPost: '/blog/:id',
  reservation: '/reservation',
  cart: '/cart',
  productDetail: '/product/:productId',
  comboDetail: '/combo/:comboId',
  checkout: '/checkout',
  product: '/product',
  ourStory: '/our-story',
  partyOrders: '/party-orders',
  paymentStatus: '/payment/status',
  paymentSuccess: '/payment/success',
  paymentFailure: '/payment/failure',
};
