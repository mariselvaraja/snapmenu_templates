import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Events } from './pages/Events';
import { Gallery } from './pages/Gallery';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { Reservation } from './pages/Reservation';
import { CartProvider, useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { BlogPost } from './pages/BlogPost';

function App() {
  sessionStorage.clear("restaurant_id");
  let restaurant_id = "e62f39bc-7e8a-4da3-8c47-ed8d8fe28aba";
  let isPreview = false;
  
useEffect(()=>{
  sessionStorage.setItem("restaurant_id",restaurant_id);
},[restaurant_id])

  return (
    <CartProvider>
      {/* Use the hook inside the provider */} <CartContent />
    </CartProvider>
  );
}

function CartContent() {
  const { isCartOpen, toggleCart } = useCart();

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={toggleCart} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/blog/:id" element={<BlogPost />} />
      </Routes>
    </>
  );
}

export default App;
