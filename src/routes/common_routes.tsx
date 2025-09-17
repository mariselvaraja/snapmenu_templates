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
  home: '/:franchiseId',
  menu: '/:franchiseId/menu',
  locations: '/:franchiseId/locations',
  about: '/:franchiseId/about',
  contact: '/:franchiseId/contact',
  order: '/:franchiseId/order',
  inDiningOrder: '/placeindiningorder',
  inDiningOrderWithTable: '/placeindiningorder/:table',
  inDiningOrderWithParams: '/placeindiningorder/:restaurantId/:franchiseId/:tableId',
  events: '/:franchiseId/events',
  gallery: '/:franchiseId/gallery',
  blog: '/:franchiseId/blog',
  blogPost: '/:franchiseId/blog/:id',
  reservation: '/:franchiseId/reservation',
  cart: '/:franchiseId/cart',
  productDetail: '/:franchiseId/product/:productId',
  comboDetail: '/:franchiseId/combo/:comboId',
  checkout: '/:franchiseId/checkout',
  product: '/:franchiseId/product',
  ourStory: '/:franchiseId/our-story',
  partyOrders: '/:franchiseId/party-orders',
  paymentStatus: '/:franchiseId/payment/status',
  paymentSuccess: '/:franchiseId/payment/success',
  paymentFailure: '/:franchiseId/payment/failure',
};
