import React from 'react';
import { Route } from 'react-router-dom';
import { commonRoutePaths } from './common_routes';

// Import components from pizza_template
import Home from '../templates/pizza_template/pages/Home';
import Menu from '../templates/pizza_template/pages/Menu';
import Locations from '../templates/pizza_template/pages/Locations';
import About from '../templates/pizza_template/pages/About';
import Contact from '../templates/pizza_template/pages/Contact';
import Order from '../templates/pizza_template/pages/Order';
import Events from '../templates/pizza_template/pages/Events';
import Gallery from '../templates/pizza_template/pages/Gallery';
import Blog from '../templates/pizza_template/pages/Blog';
import BlogPost from '../templates/pizza_template/pages/BlogPost';
import Reservation from '../templates/pizza_template/pages/Reservation';
import Cart from '../templates/pizza_template/pages/Cart';
import ProductDetail from '../templates/pizza_template/pages/ProductDetail';
import ComboDetail from '../templates/pizza_template/pages/ComboDetail';
import Checkout from '../templates/pizza_template/pages/Checkout';
import { InDiningOrder } from '../templates/pizza_template/components/in-dining';
/**
 * Define routes for the pizza template
 * These routes are used in the pizza_template/App.tsx file
 * Note: Payment routes are now handled at the App level as common routes
 */
const PizzaTemplateRoutes = [
  <Route key="home" path={commonRoutePaths.home} element={<Home />} />,
  <Route key="menu" path={commonRoutePaths.menu} element={<Menu />} />,
  <Route key="locations" path={commonRoutePaths.locations} element={<Locations />} />,
  <Route key="about" path={commonRoutePaths.about} element={<About />} />,
  <Route key="our-story" path={commonRoutePaths.ourStory} element={<About />} />,
  <Route key="contact" path={commonRoutePaths.contact} element={<Contact />} />,
  <Route key="order" path={commonRoutePaths.order} element={<Order />} />,
  <Route key="in-dining-order" path={commonRoutePaths.inDiningOrder} element={<InDiningOrder />} />,
  <Route key="in-dining-order-with-table" path={commonRoutePaths.inDiningOrderWithTable} element={<InDiningOrder />} />,
  <Route key="events" path={commonRoutePaths.events} element={<Events />} />,
  <Route key="gallery" path={commonRoutePaths.gallery} element={<Gallery />} />,
  <Route key="blog" path={commonRoutePaths.blog} element={<Blog />} />,
  <Route key="blog-post" path={commonRoutePaths.blogPost} element={<BlogPost />} />,
  <Route key="reservation" path={commonRoutePaths.reservation} element={<Reservation />} />,
  <Route key="cart" path={commonRoutePaths.cart} element={<Cart />} />,
  <Route key="product-detail" path={commonRoutePaths.productDetail} element={<ProductDetail />} />,
  <Route key="combo-detail" path={commonRoutePaths.comboDetail} element={<ComboDetail />} />,
  <Route key="checkout" path={commonRoutePaths.checkout} element={<Checkout />} />
];

export default PizzaTemplateRoutes;
