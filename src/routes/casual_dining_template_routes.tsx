import React from 'react';
import { Route } from 'react-router-dom';
import { commonRoutePaths } from './common_routes';

// Import components from casual_dining_template
import { Home } from '../templates/casual_dining_template/pages/Home';
import { Menu } from '../templates/casual_dining_template/pages/Menu';
import { Story } from '../templates/casual_dining_template/pages/Story';
import { Locations } from '../templates/casual_dining_template/pages/Locations';
import { Events } from '../templates/casual_dining_template/pages/Events';
import Gallery from '../templates/casual_dining_template/pages/Gallery';
import { Contact } from '../templates/casual_dining_template/pages/Contact';
import ProductDetails from '../templates/casual_dining_template/pages/ProductDetails';
import Cart from '../templates/casual_dining_template/pages/Cart';
import Reservation from '../templates/casual_dining_template/components/Reservation';
import Blog from '../templates/casual_dining_template/pages/Blog';
import Checkout from '../templates/casual_dining_template/components/Checkout';
import { InDiningOrder } from '../templates/casual_dining_template/components/in-dining';
import { PaymentSuccess, PaymentFailure } from '../common/payments/ipos/index';

/**
 * Define routes for the casual dining template
 * These routes are used in the casual_dining_template/App.tsx file
 */
const CasualDiningTemplateRoutes = [
  <Route key="home" path={commonRoutePaths.home} element={<Home />} />,
  <Route key="menu" path={commonRoutePaths.menu} element={<Menu />} />,
  <Route key="product-details" path={`${commonRoutePaths.product}/:itemId`} element={<ProductDetails />} />,
  <Route key="about" path={commonRoutePaths.about} element={<Story />} />,
  <Route key="locations" path={commonRoutePaths.locations} element={<Locations />} />,
  <Route key="events" path={commonRoutePaths.events} element={<Events />} />,
  <Route key="gallery" path={commonRoutePaths.gallery} element={<Gallery />} />,
  <Route key="contact" path={commonRoutePaths.contact} element={<Contact />} />,
  <Route key="reservation" path={commonRoutePaths.reservation} element={<Reservation />} />,
  <Route key="blog" path={commonRoutePaths.blog} element={<Blog />} />,
  <Route key="cart" path={commonRoutePaths.cart} element={<Cart />} />,
  <Route key="checkout" path={commonRoutePaths.checkout} element={<Checkout />} />,
  <Route key="in-dining-order" path={commonRoutePaths.inDiningOrder} element={<InDiningOrder />} />,
  <Route key="in-dining-order-with-table" path={commonRoutePaths.inDiningOrderWithTable} element={<InDiningOrder />} />,
  <Route key="payment-success" path={commonRoutePaths.paymentSuccess} element={<PaymentSuccess />} />,
  <Route key="payment-failure" path={commonRoutePaths.paymentFailure} element={<PaymentFailure />} />
];

export default CasualDiningTemplateRoutes;
