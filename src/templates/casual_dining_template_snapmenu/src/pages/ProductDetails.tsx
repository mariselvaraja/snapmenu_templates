import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRootMenu } from '../../../../context/RootMenuContext.jsx';
import { CartContext, CartContextType, useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Star, ChevronRight, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useContent } from '../context/ContentContext';
import CartDrawer from '../components/CartDrawer';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

function ProductDetails() {
  const params = useParams<{ category?: string; id?: string }>();
  const category = params.category || '';
  const id = params.id || '';
  const navigate = useNavigate();
  // Get data directly from RootMenuContext
  const rootMenuContext = useRootMenu() as {
    menu: any;
    loading: boolean;
    error: Error | null;
  };
  
  // Process menu data to handle different structures
  const getProcessedMenu = () => {
    const rootMenu = rootMenuContext.menu;
    if (!rootMenu) return { menu: {} };
    
    try {
      let menuObj;
      if (typeof rootMenu === 'object') {
        if ('menu' in rootMenu) {
          // If rootMenu has a menu property
          menuObj = rootMenu.menu;
        } else {
          // If rootMenu is directly the menu object
          menuObj = rootMenu;
        }
      } else {
        menuObj = {};
      }
      
      return { menu: menuObj };
    } catch (error) {
      console.error("Error processing menu data:", error);
      return { menu: {} };
    }
  };
  
  const { menu } = getProcessedMenu();
  const { addToCart } = useContext(CartContext) as CartContextType || { addToCart: () => {} };
  const [quantity, setQuantity] = useState(1);
  const { toggleCart } = useCart();

  // Find the product in the menu data
  let product: MenuItem | undefined = undefined;
  
  // Log the menu data and parameters for debugging
  console.log("Menu Data:", menu);
  console.log("Category:", category);
  console.log("ID:", id);
  
  if (menu && category) {
    // Check if the category exists in the menu
    if (menu[category]) {
      console.log(`Looking for product with id ${id} in category ${category}`);
      product = menu[category].find((item: MenuItem) => item.id === id);
      console.log("Found product:", product);
    } else {
      console.log(`Category ${category} not found in menu data`);
      // If the category doesn't exist, search all categories
      console.log("Searching all categories for product");
      for (const cat in menu) {
        if (Array.isArray(menu[cat])) {
          const foundProduct = menu[cat].find((item: MenuItem) => item.id === id);
          if (foundProduct) {
            console.log(`Found product in category ${cat}:`, foundProduct);
            product = foundProduct;
            break;
          }
        }
      }
    }
  }

  if (!product) {
    return (
      <div className="py-20">
        <div className="container mx-auto mt-8 text-center">
          <h2 className="text-3xl font-semibold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/menu')}
            className="bg-yellow-400 text-black px-6 py-3 rounded-full hover:bg-yellow-300 transition flex items-center mx-auto"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const { siteContent } = useContent();

  return (
    <>
    <Navigation/>
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <div className='w-full'>
            <img src={product.image} alt={product.name} className="rounded-lg shadow-md" />
            </div>
            <div className="absolute top-2 right-2">
              <span className="bg-green-500 text-white text-sm font-semibold px-2.5 py-0.5 rounded">
                Vegetarian
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 text-xl">${typeof product.price === 'string' ? product.price : (product.price as number).toFixed(2)}</p>
            <p className="mt-4">{product.description}</p>

            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  className="bg-zinc-900 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  className="bg-zinc-900 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
              <button
                className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition flex items-center justify-center"
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: typeof product.price === 'string' 
                      ? parseFloat(product.price.replace(/[^\d.-]/g, '')) 
                      : product.price,
                    imageUrl: product.image,
                  });
                  toggleCart();
                }}
              >
                Add to Order
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold">Nutritional Information</h3>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="bg-zinc-900 p-4 rounded">
                  <p className="font-semibold">Calories</p>
                  <p>380</p>
                </div>
                <div className="bg-zinc-900 p-4 rounded">
                  <p className="font-semibold">Protein</p>
                  <p>5g</p>
                </div>
                <div className="bg-zinc-900 p-4 rounded">
                  <p className="font-semibold">Carbs</p>
                  <p>42g</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold">Allergens</h3>
              <div className="flex gap-2 mt-2">
                <span className="bg-zinc-900 p-2 rounded text-sm">dairy</span>
                <span className="bg-zinc-900 p-2 rounded text-sm">eggs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-zinc-900 py-16 px-6 mt-3">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Raging Tacos</h3>
              <p className="text-gray-400">
                Authentic Mexican street food served with passion and pride.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-400 hover:text-yellow-400 transition">Home</Link>
                <Link to="/menu" className="block text-gray-400 hover:text-yellow-400 transition">Menu</Link>
                <Link to="/locations" className="block text-gray-400 hover:text-yellow-400 transition">Locations</Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>info@ragingtacos.com</p>
                <p>(555) 123-4567</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Raging Tacos. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

export default ProductDetails;
