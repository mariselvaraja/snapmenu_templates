import React from 'react';
import { motion } from 'framer-motion';
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';
import { CiWheat } from 'react-icons/ci';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { MenuItem, useAppSelector, useAppDispatch, updateItemQuantity, removeItem } from '../../../../common/redux';
import { SelectedModifier } from './types';
import ModifiersList from './ModifiersList';
import NutritionalInfo from './NutritionalInfo';
import IngredientsSection from './IngredientsSection';
import AllergensSection from './AllergensSection';

interface ProductHeaderProps {
    product: MenuItem;
    calculateTotalPrice: () => number;
    selectedModifiers: SelectedModifier[];
    spiceLevel: number;
    setSpiceLevel: (level: number) => void;
    modifiersList: any[];
    handleModifierOptionSelect: (modifierName: string, option: any) => void;
    isModifierOptionSelected: (modifierName: string, optionName: string) => boolean;
    handleAddToCart: () => void;
    validationErrors?: {
        [key: string]: boolean;
    };
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
    product,
    calculateTotalPrice,
    spiceLevel,
    setSpiceLevel,
    modifiersList,
    handleModifierOptionSelect,
    isModifierOptionSelected,
    handleAddToCart,
    validationErrors = {}
}) => {
    const dispatch = useAppDispatch();
    
    // Get cart items from Redux store
    const { items: cartItems } = useAppSelector(state => state.cart);

    function formatToDollar(value:any) {
        try {
            // Convert to string and remove any $ signs or whitespace
            let cleaned = String(value).replace(/\$/g, '').trim();
            
            // Parse as float
            let amount = parseFloat(cleaned);
    
            // Check if it's a valid number
            if (isNaN(amount)) throw new Error();
    
            // Format to $X.XX
            return `$${amount.toFixed(2)}`;
        } catch {
            return 'Invalid input';
        }
    }
    
    // Check if this product is in the cart
    const cartItem = cartItems.find((item:any) => item.id === product.id);
    return (
        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div className="md:pr-8 md:w-1/2">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <div className="text-xl font-bold text-red-500 mb-3">
                    <span className="text-gray-700 font-normal mr-2">Price:</span>
                    {formatToDollar(product.price)}
                </div>
                
                <div className='max-h-[400px] overflow-y-auto thin-scrollbar'>
                {/* Modifiers List with Spice Level */}
                <ModifiersList 
                    modifiersList={modifiersList}
                    handleModifierOptionSelect={handleModifierOptionSelect}
                    isModifierOptionSelected={isModifierOptionSelected}
                    spiceLevel={spiceLevel}
                    setSpiceLevel={setSpiceLevel}
                    validationErrors={validationErrors}
                />
                </div>
                
                <div className="flex items-center justify-between mt-4 mb-4">
                    <div>
                        <div className="text-2xl font-bold text-red-500">${(typeof calculateTotalPrice() === 'number' ? calculateTotalPrice() : 0).toFixed(2)}</div>
                    </div>
                    
                    {/* Add to Cart button or Quantity Controls */}
                    {!cartItem ? (
                        <button
                            onClick={handleAddToCart}
                            className="inline-flex items-center bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition-colors text-base font-medium"
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart
                        </button>
                    ) : (
                        <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
                            <button
                                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors"
                                onClick={() => {
                                    const newQuantity = cartItem.quantity - 1;
                                    if (newQuantity > 0) {
                                        dispatch(updateItemQuantity({ id: product.id, quantity: newQuantity }));
                                    } else {
                                        dispatch(removeItem(product.id));
                                    }
                                }}
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="mx-3 text-base font-semibold">
                                {cartItem.quantity}
                            </span>
                            <button
                                className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                onClick={() => {
                                    dispatch(updateItemQuantity({ id: product.id, quantity: cartItem.quantity + 1 }));
                                }}
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0">
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                    {/* Dietary Information icons overlay */}
                    {product.dietary && Object.values(product.dietary).some(value => value) && (
                        <div className="absolute top-2 right-2 z-10 flex flex-wrap gap-1 justify-end">
                            {product.dietary.isVegan && (
                                <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                    <LuVegan className="w-5 h-5" />
                                </div>
                            )}
                            {product.dietary.isVegetarian && (
                                <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                    <IoLeafOutline className="w-5 h-5" />
                                </div>
                            )}
                            {product.dietary.isGlutenFree && (
                                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                    <CiWheat className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    )}
                    {product.image ? (
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-64 object-cover"
                        />
                    ) : (
                        <div className="w-full h-64 bg-red-100 flex items-center justify-center">
                            <span className="text-6xl font-bold text-red-500">
                                {product.name && product.name.length > 0 
                                    ? product.name.charAt(0).toUpperCase() 
                                    : 'P'}
                            </span>
                        </div>
                    )}
                </div>
                
                <div className='mt-5'>
                
                {/* Nutritional information section */}
                <NutritionalInfo product={product} />

                {/* Ingredients section */}
                <IngredientsSection product={product} />

                {/* Allergens section */}
                <AllergensSection product={product} />
                </div>
            </div>
        </div>
    );
};

export default ProductHeader;
