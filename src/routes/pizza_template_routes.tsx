import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { commonRoutePaths, createCommonRoutes } from './common_routes';

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
import Checkout from '../templates/pizza_template/pages/Checkout';

const PizzaTemplateRoutes = () => {
  // You can define a NotFound component if needed
  // const NotFound = () => <div>Page not found</div>;

  // Get common routes (like 404 page)
  // const commonRoutes = createCommonRoutes({ notFound: NotFound });

  return (
    <Routes>
      <Route path={commonRoutePaths.home} element={<Home />} />
      <Route path={commonRoutePaths.menu} element={<Menu />} />
      <Route path={commonRoutePaths.locations} element={<Locations />} />
      <Route path={commonRoutePaths.about} element={<About />} />
      <Route path={commonRoutePaths.contact} element={<Contact />} />
      <Route path={commonRoutePaths.order} element={<Order />} />
      <Route path={commonRoutePaths.events} element={<Events />} />
      <Route path={commonRoutePaths.gallery} element={<Gallery />} />
      <Route path={commonRoutePaths.blog} element={<Blog />} />
      <Route path={commonRoutePaths.blogPost} element={<BlogPost />} />
      <Route path={commonRoutePaths.reservation} element={<Reservation />} />
      <Route path={commonRoutePaths.cart} element={<Cart />} />
      <Route path={commonRoutePaths.productDetail} element={<ProductDetail />} />
      <Route path={commonRoutePaths.checkout} element={<Checkout />} />
      
      {/* Uncomment to add common routes like 404 page */}
      {/* {commonRoutes} */}
    </Routes>
  );
};

export default PizzaTemplateRoutes;
