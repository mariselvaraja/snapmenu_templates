import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import TitleUpdater from './components/TitleUpdater';
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
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import { SiteContentProvider } from './context/SiteContentContext';
import { SearchInitializer, RestaurantInitializer } from './shared';

function App() {
  return (
    <SiteContentProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <SearchInitializer />
          <RestaurantInitializer />
          <TitleUpdater />
          <Navbar />
          <CartDrawer />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/our-story" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/order" element={<Order />} />
              <Route path="/events" element={<Events />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </SiteContentProvider>
  );
}

export default App;
