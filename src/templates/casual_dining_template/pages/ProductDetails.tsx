import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext, CartContextType, useCart } from '../context/CartContext';
import { ArrowRight } from 'lucide-react';
import { useAppSelector } from '../../../common/redux';

// Define our own interface to avoid conflicts with imported types
interface ProductItem {
  id: string;
  name: string;
  price: string | number;
  image: string;
  description: string;
  isVegetarian?: boolean;
  nutritionalInfo?: {
    calories?: string | number;
    protein?: string;
    carbs?: string;
  };
  allergens?: string[];
}

function ProductDetails() {
  const { itemId } = useParams();
  const { addToCart } = useContext(CartContext) as CartContextType;
  const [quantity, setQuantity] = useState(1);
  const { toggleCart } = useCart();
  
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  const { items: menuItems } = useAppSelector(state => state.menu);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};

  // Find the product in the menu data
  const menuItem = menuItems?.find((item: any) => item.id.toString() === itemId);
  
  // Cast to our ProductItem interface to access our custom properties
  const product = menuItem as unknown as ProductItem;

  if (!product) {
    return <div className="min-h-screen bg-black text-white py-20 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/menu" className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
          Return to Menu
        </Link>
      </div>
    </div>;
  }

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };


  return (
    <>
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <div className='w-full'>
            <img src={product.image} alt={product.name} className="rounded-lg shadow-md" />
            </div>
            {product.isVegetarian && (
              <div className="absolute top-2 right-2">
                <span className="bg-green-500 text-white text-sm font-semibold px-2.5 py-0.5 rounded">
                  Vegetarian
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-semibold">{product.name}</h2>
            <p className="text-yellow-400 text-xl">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
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
                    price: typeof product.price === 'number' ? product.price.toFixed(2) : product.price,
                    imageUrl: product.image,
                  });
                  toggleCart();
                }}
              >
                Add to Order
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>

            {product.nutritionalInfo && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Nutritional Information</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="bg-zinc-900 p-4 rounded">
                    <p className="font-semibold">Calories</p>
                    <p>{product.nutritionalInfo.calories?.toString() || 'N/A'}</p>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded">
                    <p className="font-semibold">Protein</p>
                    <p>{product.nutritionalInfo.protein || 'N/A'}</p>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded">
                    <p className="font-semibold">Carbs</p>
                    <p>{product.nutritionalInfo.carbs || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {product.allergens && product.allergens.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Allergens</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.allergens.map((allergen, index) => (
                    <span key={index} className="bg-zinc-900 p-2 rounded text-sm">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    
    </div>
    
    </>
  );
}

export default ProductDetails;
