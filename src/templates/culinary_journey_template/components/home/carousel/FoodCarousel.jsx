import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../../context';
import { useInView } from '../../../hooks/useInView';
import { OptimizedImage } from '../../common/OptimizedImage';

export function FoodCarousel() {
  const { dispatch } = useCart();
  const { ref, inView } = useInView({ threshold: 0.1 });

  // Using fallback data directly instead of useRootMenu
  const displayDishes = [
    {
      id: "dish1",
      name: "Truffle Risotto",
      description: "Creamy Arborio rice with wild mushrooms and truffle oil",
      price: "24.99",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80"
    },
    {
      id: "dish2",
      name: "Seared Scallops",
      description: "Pan-seared scallops with cauliflower purée and crispy pancetta",
      price: "29.99",
      image: "https://images.unsplash.com/photo-1535140728325-a4d3707eee61?auto=format&fit=crop&q=80"
    },
    {
      id: "dish3",
      name: "Wagyu Beef Steak",
      description: "Premium Wagyu beef with roasted vegetables and red wine reduction",
      price: "39.99",
      image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80"
    }
  ];

  const handleAddToCart = (dish) => {
    // Determine the category based on the dish properties or use a default
    const category = dish.category || 'signature';
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        item: {
          ...dish,
          category: 'mains',
          subCategory: 'signature'
        },
        quantity: 1
      }
    });
  };

  return (
    <div className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className={`text-center mb-16 transform transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg blur opacity-25"></div>
            <h2 className="relative text-4xl sm:text-5xl md:text-6xl font-serif mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
              Our Signature Dishes
            </h2>
          </div>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto animate-slide-up delay-100">
            A showcase of culinary masterpieces crafted by our expert chefs
          </p>
        </div>

        <div className="relative">
          <div className="flex overflow-hidden no-scrollbar">
            <div className="flex animate-scroll">
              {[...displayDishes, ...displayDishes].map((dish, index) => (
                <div
                  key={index}
                  className="w-80 flex-shrink-0 mx-4 animate-scale-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform transition-all duration-500 hover:scale-105 relative group">
                    <div className="relative overflow-hidden">
                      <OptimizedImage
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-48"
                        sizes="(max-width: 640px) 100vw, 320px"
                        objectFit="cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <button
                        onClick={() => handleAddToCart(dish)}
                        className="absolute bottom-4 right-4 bg-orange-600 text-white p-3 rounded-full shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-700"
                        aria-label={`Add ${dish.name} to cart`}
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl mb-2 group-hover:text-orange-600 transition-colors">{dish.name}</h3>
                      <p className="text-gray-600 text-sm">{dish.description}</p>
                      {dish.price && (
                        <p className="text-black font-serif mt-3 text-lg">${dish.price}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
