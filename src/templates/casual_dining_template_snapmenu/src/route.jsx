import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Story } from './pages/Story';
import { Locations } from './pages/Locations';
import { Events } from './pages/Events';
import ProductDetails from './pages/ProductDetails';
import Gallery from './pages/Gallery';
import { Contact } from './pages/Contact';
import Reservation from './pages/Reservation';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Checkout from './components/Checkout';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import { ContentProvider } from './context/ContentContext';
import { SearchProvider } from './context/SearchContext';

// Layout component for Casual Dining template
export function CasualDiningLayout() {
  // Initialize restaurant_id

  return (
    <ContentProvider>
      <CartProvider>
        <SearchProvider>
            <div className="min-h-screen bg-black text-white">
              <CartDrawer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:category/:id" element={<ProductDetails />} />
              <Route path="/about" element={<Story />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/events" element={<Events />} />
              <Route path="/gallary" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
            </div>
        </SearchProvider>
      </CartProvider>
    </ContentProvider>
  );
}

// Casual Dining Routes component
export function CasualDiningRoutes() {
  return (
    <ContentProvider>
      <CartProvider>
        <SearchProvider>
            <CartDrawer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:category/:id" element={<ProductDetails />} />
            <Route path="/about" element={<Story />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallary" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </SearchProvider>
      </CartProvider>
    </ContentProvider>
  );
}
