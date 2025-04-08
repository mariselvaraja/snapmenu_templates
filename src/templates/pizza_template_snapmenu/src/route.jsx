import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { SearchProvider } from './context/SearchContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Locations from './pages/Locations';
import About from './pages/About';
import Contact from './pages/Contact';
import Order from './pages/Order';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Reservation from './pages/Reservation';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import TableReservation from '../../../shared/components/reservation/tableReservation';

// Layout component for Pizza template
export function PizzaLayout() {
  return (
    <Provider store={store}>
      <SearchProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <CartDrawer />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:category/:id" element={<ProductDetails />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/order" element={<Order />} />
              <Route path="/events" element={<Events />} />
              <Route path="/gallary" element={<Gallery />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/reserveTable" element={<TableReservation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SearchProvider>
    </Provider>
  );
}

// Pizza Routes component
export function PizzaRoutes() {
  return (
    <Provider store={store}>
      <SearchProvider>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:category/:id" element={<ProductDetails />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<Order />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </SearchProvider>
    </Provider>
  );
}
