import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRootMenu } from '../../../../context/RootMenuContext';
import { useCart } from '../context/CartContext';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { ArrowLeft, Leaf, Wheat, AlertCircle } from 'lucide-react';

export function ProductDetails() {
  const { category, id } = useParams();
  const { menu: rootMenu } = useRootMenu();
  
  // Process menu data to handle different structures (similar to MenuContext)
  let menu = null;
  
  try {
    if (rootMenu) {
      if (typeof rootMenu === 'object') {
        if ('menu' in rootMenu) {
          // If rootMenu has a menu property
          menu = rootMenu;
        } else {
          // If rootMenu is directly the menu object
          menu = { menu: rootMenu };
        }
      } else {
        menu = rootMenu;
      }
    }
  } catch (error) {
    console.error("Error processing menu data:", error);
    menu = { menu: {} };
  }
  
  // Default menu structure if no menu is available
  if (!menu) {
    menu = { 
      menu: {
        starters: [],
        mains: [],
        desserts: [],
        drinks: []
      }
    };
  }
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Find the product in the menu data
  let product = null;
  
  // Log the menu data and parameters for debugging
  console.log("Menu Data:", menu);
  console.log("Category:", category);
  console.log("ID:", id);
  
  if (menu && menu.menu && category) {
    // Check if the category exists in the menu
    if (menu.menu[category]) {
      console.log(`Looking for product with id ${id} in category ${category}`);
      product = menu.menu[category].find(item => item.id === id);
      console.log("Found product:", product);
    } else {
      console.log(`Category ${category} not found in menu data`);
      // If the category doesn't exist, search all categories
      console.log("Searching all categories for product");
      for (const cat in menu.menu) {
        if (Array.isArray(menu.menu[cat])) {
          const foundProduct = menu.menu[cat].find(item => item.id === id);
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
      <div className="min-h-screen bg-gray-50 flex flex-col">

        <div className="flex-grow container mx-auto px-6 py-16 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/menu')}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Menu
          </button>
        </div>
        <Footer />
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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    // return new Intl.NumberFormat('en-US', {
    //   style: 'currency',
    //   currency: 'USD',
    // }).format(numPrice);
    return price;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      
      {/* Hero Section */}
      <div className="relative h-[40vh]">
      <Navigation />
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1543352634-99a5d50ae78e?auto=format&fit=crop&q=80"
            alt="Product Details background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              {product.name}
            </h1>
            <p className="text-xl text-gray-200 max-w-xl mx-auto leading-relaxed">
              Explore detailed information about our delicious product.
            </p>
          </div>
        </div>
      </div>
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-4 mt-8">
          <div className="flex items-center text-sm text-gray-500">
            <button 
              onClick={() => navigate('/menu')}
              className="hover:text-green-500 transition flex items-center"
            >
              Menu
            </button>
            <span className="mx-2">/</span>
            <button 
              onClick={() => navigate(`/menu?category=${category}`)}
              className="hover:text-green-500 transition"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
            <span className="mx-2">/</span>
            <span className="text-green-500 font-medium">{product.name}</span>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Product Details */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
                  <div className="flex space-x-2 mb-4">
                    {product.dietary?.isVegetarian && (
                      <span className="flex items-center text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        <Leaf className="w-4 h-4 mr-1" />
                        Vegetarian
                      </span>
                    )}
                    {product.dietary?.isVegan && (
                      <span className="flex items-center text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        <Leaf className="w-4 h-4 mr-1" />
                        Vegan
                      </span>
                    )}
                    {product.dietary?.isGlutenFree && (
                      <span className="flex items-center text-sm px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                        <Wheat className="w-4 h-4 mr-1" />
                        Gluten-Free
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  $ {formatPrice(product.price)}
                </div>
              </div>
              
              <p className="text-gray-600 text-lg mb-8">{product.description}</p>
              
              {/* Calories */}
              {product.calories && (
                <div className="mb-6">
                  <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                    {product.calories} calories
                  </div>
                </div>
              )}
              
              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center">
                  <button 
                    onClick={handleDecrement}
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="mx-4 text-xl font-medium">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition text-center"
                >
                  Add to Cart
                </button>
              </div>
              
              {/* Allergens */}
              {product.allergens && product.allergens.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                    Allergens
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.map((allergen, index) => (
                      <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Nutritional Information */}
              {product.nutrients && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Nutritional Information</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(product.nutrients).map(([key, value]) => 
                      value !== "0g" && (
                        <div key={key} className="text-center p-3 bg-gray-100 rounded-lg">
                          <span className="block text-xs text-gray-500 uppercase">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              
              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingredients</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Pairings */}
              {product.pairings && product.pairings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Pairs Well With</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {product.pairings.map((pairing, index) => (
                      <li key={index}>{pairing}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default ProductDetails;
