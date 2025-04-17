import React from 'react';
import { Route } from 'react-router-dom';
import { commonRoutePaths } from './common_routes';

// Import components from eatflow_template
// @ts-ignore
import { Home } from '../templates/eatflow_template/pages/Home';
// @ts-ignore
import { Menu } from '../templates/eatflow_template/pages/Menu';
// @ts-ignore
import { About } from '../templates/eatflow_template/pages/About';
// @ts-ignore
import { Contact } from '../templates/eatflow_template/pages/Contact';
// @ts-ignore
import { Events } from '../templates/eatflow_template/pages/Events';
// @ts-ignore
import { Gallery } from '../templates/eatflow_template/pages/Gallery';
// @ts-ignore
import { Blog } from '../templates/eatflow_template/pages/Blog';
// @ts-ignore
import { BlogPost } from '../templates/eatflow_template/pages/BlogPost';
// @ts-ignore
import { Reservation } from '../templates/eatflow_template/pages/Reservation';
// @ts-ignore
import { Cart } from '../templates/eatflow_template/pages/Cart';
// @ts-ignore
import { Checkout } from '../templates/eatflow_template/pages/Checkout';
// @ts-ignore
import { Confirmation } from '../templates/eatflow_template/pages/Confirmation';
// @ts-ignore
import ProductDetails from '../templates/eatflow_template/pages/ProductDetails';
// @ts-ignore
import InDiningOrderPage from '../templates/eatflow_template/pages/InDiningOrderPage';

/**
 * Define routes for the eatflow template
 * These routes are used in the eatflow_template/App.jsx file
 */
const EatflowTemplateRoutes = [
  <Route key="product-details" path={commonRoutePaths.productDetail} element={<ProductDetails />} />,
  <Route key="home" path={commonRoutePaths.home} element={<Home />} />,
  <Route key="menu" path={commonRoutePaths.menu} element={<Menu />} />,
  <Route key="about" path={commonRoutePaths.about} element={<About />} />,
  <Route key="contact" path={commonRoutePaths.contact} element={<Contact />} />,
  <Route key="events" path={commonRoutePaths.events} element={<Events />} />,
  <Route key="gallery" path={commonRoutePaths.gallery} element={<Gallery />} />,
  <Route key="blog" path={commonRoutePaths.blog} element={<Blog />} />,
  <Route key="blog-post" path={commonRoutePaths.blogPost} element={<BlogPost />} />,
  <Route key="reservation" path={commonRoutePaths.reservation} element={<Reservation />} />,
  <Route key="cart" path={commonRoutePaths.cart} element={<Cart />} />,
  <Route key="checkout" path={commonRoutePaths.checkout} element={<Checkout />} />,
  <Route key="confirmation" path="/confirmation" element={<Confirmation />} />,
  <Route key="in-dining-order" path={commonRoutePaths.inDiningOrder} element={<InDiningOrderPage />} />,
  <Route key="in-dining-order-with-table" path={commonRoutePaths.inDiningOrderWithTable} element={<InDiningOrderPage />} />
];

export default EatflowTemplateRoutes;
