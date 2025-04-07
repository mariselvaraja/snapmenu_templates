import React, { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Events } from './pages/Events';
import { Gallery } from './pages/Gallery';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import ErrorBoundary from './components/ErrorBoundary';
// Import the Reservation component directly instead of lazy loading
import { Reservation } from './pages/Reservation';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { ProductDetails } from './pages/ProductDetails';
import { CartDrawer } from './components/CartDrawer';
import { useCart } from './context/CartContext';
import TableReserve from './components/TableReserve';
import TableReserveHardcoded from './components/TableReserveHardcoded';

// Loading component for Suspense
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

// EatFlow Layout component
export function EatflowLayout() {
  const { isCartOpen, toggleCart } = useCart();

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={toggleCart} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:category/:id" element={<ProductDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallary" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/reservation" element={
         <TableReserve/>
        } />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </>
  );
}
