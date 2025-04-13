import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../../context';
import { useRootMenu } from '../../../../../../context/RootMenuContext';
import { useInView } from '../../../hooks/useInView';
import { OptimizedImage } from '../../common/OptimizedImage';

export function FoodCarousel() {
  const { dispatch } = useCart();
  const { menu: rootMenu } = useRootMenu();
  const { ref, inView } = useInView({ threshold: 0.1 });

  // Get the first 3 items from the root menu
  const getSignatureDishes = () => {
    if (!rootMenu) return [];
    
    // Handle different possible structures of rootMenu
    let allDishes = [];
    
    // Case 1: rootMenu is an object with category keys and arrays of dishes as values
    if (typeof rootMenu === 'object' && !Array.isArray(rootMenu)) {
      // Check if rootMenu has a 'menu' property (nested structure)
      if (rootMenu.menu && typeof rootMenu.menu === 'object') {
        // Flatten all categories from rootMenu.menu
        Object.values(rootMenu.menu).forEach(categoryDishes => {
          if (Array.isArray(categoryDishes)) {
            allDishes = [...allDishes, ...categoryDishes];
          }
        });
      } else {
        // Flatten all categories directly from rootMenu
        Object.values(rootMenu).forEach(categoryDishes => {
          if (Array.isArray(categoryDishes)) {
            allDishes = [...allDishes, ...categoryDishes];
          }
        });
      }
    }
    // Case 2: rootMenu is directly an array of dishes
    else if (Array.isArray(rootMenu)) {
      allDishes = rootMenu;
    }
    
    // Filter out any invalid dishes (must have at least name and image)
    const validDishes = allDishes.filter(dish => 
      dish && typeof dish === 'object' && dish.name && dish.image
    );
    
    // Return the first 3 valid dishes or all if less than 3
    return validDishes.slice(0, 3);
  };

  // Get signature dishes with fallback
  const signatureDishes = getSignatureDishes();
  
  // Fallback dishes in case no valid dishes are found
  const fallbackDishes = [
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
  
  // Use fallback dishes if no valid dishes were found
  const displayDishes = signatureDishes.length > 0 ? signatureDishes : fallbackDishes;
  
  console.log("Root Menu Structure:", rootMenu);
  console.log("Signature Dishes:", signatureDishes);

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
