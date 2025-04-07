import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRootMenu } from '../../../../context/RootMenuContext';
import { useDispatch } from 'react-redux';
import { addItem, CartItem } from '../cartSlice';
import { ShoppingCart, ArrowLeft, Leaf } from 'lucide-react';

// Define interfaces for menu data structure
interface MenuData {
  menu: {
    [category: string]: MenuItem[];
  };
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  subCategory?: string;
  calories?: number;
  nutrients?: Record<string, string>;
  dietary?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
  };
  allergens?: string[];
  ingredients?: string[];
  pairings?: string[];
}

export default function ProductDetails() {
  const params = useParams<{ category?: string; id?: string }>();
  const category = params.category || '';
  const id = params.id || '';
  const { menu } = useRootMenu();
  // Type assertion to help TypeScript understand the structure
  const menuData = menu as MenuData | null;
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to generate a numeric hash from a string
  const hashStringToNumber = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Find the product in the menu data
  let product: MenuItem | undefined = undefined;
  let productCategory = category; // Store the actual category of the product
  
  if (menuData && menuData.menu) {
    if (category) {
      // If category is provided, check that category first
      if (menuData.menu[category]) {
        product = menuData.menu[category].find(item => item.id === id);
      }
    }
    
    // If product not found in the specified category or no category specified, search all categories
    if (!product) {
      for (const cat in menuData.menu) {
        if (Array.isArray(menuData.menu[cat])) {
          const foundProduct = menuData.menu[cat].find(item => item.id === id);
          if (foundProduct) {
            product = foundProduct;
            productCategory = cat; // Update the category to the one where the product was found
            break;
          }
        }
      }
    }
  }

  if (!product) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/menu')}
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition flex items-center mx-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
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

  const handleAddToCart = () => {
    if (product) {
      const cartItem: CartItem = {
        id: hashStringToNumber(product.id),
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: quantity,
      };
      
      dispatch(addItem(cartItem));
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice);
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500">
            <button 
              onClick={() => navigate('/menu')}
              className="hover:text-red-500 transition flex items-center"
            >
              Menu
            </button>
            <span className="mx-2">/</span>
            <button 
              onClick={() => navigate(`/menu?category=${productCategory}`)}
              className="hover:text-red-500 transition"
            >
              {productCategory && productCategory.charAt(0).toUpperCase() + productCategory.slice(1)}
            </button>
            <span className="mx-2">/</span>
              <span className="text-red-500 font-medium">{product?.name}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={product?.image} 
              alt={product?.name} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{product?.name}</h1>
                <div className="flex space-x-2 mb-4">
                  {product?.dietary?.isVegetarian && (
                    <span className="flex items-center text-sm px-3 py-1 bg-green-500 text-white rounded-full">
                      <Leaf className="w-4 h-4 mr-1" />
                      Vegetarian
                    </span>
                  )}
                  {product?.dietary?.isVegan && (
                    <span className="flex items-center text-sm px-3 py-1 bg-green-500 text-white rounded-full">
                      <Leaf className="w-4 h-4 mr-1" />
                      Vegan
                    </span>
                  )}
                  {product?.dietary?.isGlutenFree && (
                    <span className="flex items-center text-sm px-3 py-1 bg-blue-500 text-white rounded-full">
                      GF
                    </span>
                  )}
                </div>
              </div>
              <div className="text-3xl font-bold text-red-500">
                {formatPrice(product?.price || 0)}
              </div>
            </div>
            
            <p className="text-gray-600 text-lg mb-8">{product?.description}</p>
            
            {/* Calories */}
            {product?.calories && (
              <div className="mb-6">
                <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                  {product?.calories} calories
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
                className="flex-grow py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition text-center flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
            </div>
            
            {/* Allergens */}
            {product?.allergens && product.allergens.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Allergens</h3>
                <div className="flex flex-wrap gap-2">
                  {product?.allergens?.map((allergen, index) => (
                    <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Nutritional Information */}
            {product?.nutrients && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Nutritional Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(product?.nutrients || {}).map(([key, value]) => 
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
            {product?.ingredients && product.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {product?.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Pairings */}
            {product?.pairings && product.pairings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Pairs Well With</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {product?.pairings?.map((pairing, index) => (
                    <li key={index}>{pairing}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
