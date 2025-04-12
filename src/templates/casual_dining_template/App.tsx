import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Story } from './pages/Story';
import { Locations } from './pages/Locations';
import { Events } from './pages/Events';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer'; // Import CartDrawer
import Gallery from './pages/Gallery';
import { Contact } from './pages/Contact';
import Reservation from './components/Reservation';
import Blog from './components/Blog';
import Checkout from './components/Checkout';

export default function App() {
  sessionStorage.removeItem("restaurant_id")
  const restaurant_id = "e62f39bc-7e8a-4da3-8c47-ed8d8fe28aba"
  useEffect(()=>{
    sessionStorage.setItem("restaurant_id", restaurant_id)
  },[restaurant_id])
  return (
    <CartProvider>
      <CartDrawer /> {/* Render CartDrawer outside Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:itemId" element={<ProductDetails />} />
        <Route path="/about" element={<Story />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </CartProvider>
  );
}
