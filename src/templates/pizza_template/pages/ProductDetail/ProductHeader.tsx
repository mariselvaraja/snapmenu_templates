import React from 'react';
import { motion } from 'framer-motion';
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';
import { CiWheat } from 'react-icons/ci';
import { GoDotFill } from 'react-icons/go';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { MenuItem, useAppSelector, useAppDispatch, updateItemQuantity, removeItem } from '../../../../common/redux';
import { SelectedModifier } from './types';
import ModifiersList from './ModifiersList';
import NutritionalInfo from './NutritionalInfo';
import IngredientsSection from './IngredientsSection';
import AllergensSection from './AllergensSection';
import RecommendedProducts from './RecommendedProducts';

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
    showRecommendedProducts?: boolean;
    currentProductId?: string;
    allItems?: MenuItem[];
    isPaymentAvilable?: boolean;
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
    validationErrors = {},
    showRecommendedProducts = false,
    currentProductId = '',
    allItems = [],
    isPaymentAvilable
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
        <div className="flex flex-col lg:flex-row justify-between items-start mb-4 sm:mb-6">
            <div className="lg:pr-8 lg:w-1/2 w-full order-2 lg:order-1">
                <div className="hidden lg:block">
                    <div className="flex items-center gap-2 mb-2">
                        {/* Food Type Icons - Veg/Non-Veg */}
                        {product.dietary && (product.dietary.isVegetarian || product.dietary.isVegan) ? (
                            <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-green-600 flex-shrink-0">
                                <GoDotFill className="w-2 h-2 text-green-600" />
                            </div>
                        ) : (
                            <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-red-600 flex-shrink-0">
                                <GoDotFill className="w-2 h-2 text-red-600" />
                            </div>
                        )}
                        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold">{product.name}</h1>
                    </div>
                    <p className="text-gray-700 mb-2 text-sm sm:text-base">{product.description}</p>
                    
                  { modifiersList && modifiersList?.length !=0  && <div className="text-lg sm:text-xl font-bold text-red-500 mb-3">
                        <span className="text-gray-700 font-normal mr-2">Price:</span>
                        {formatToDollar(product.price)}
                    </div>}
                </div>
                
                <div className='hidden lg:block max-h-[300px] sm:max-h-[400px] overflow-y-auto thin-scrollbar'>
                {/* Modifiers List with Spice Level */}
                <ModifiersList 
                    modifiersList={modifiersList}
                    handleModifierOptionSelect={handleModifierOptionSelect}
                    isModifierOptionSelected={isModifierOptionSelected}
                    spiceLevel={spiceLevel}
                    setSpiceLevel={setSpiceLevel}
                    validationErrors={validationErrors}
                    product={product}
                />
                </div>
                
         {   isPaymentAvilable &&    <div className="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 mb-4 gap-3 sm:gap-0">
                    <div>
                        <div className="text-xl sm:text-2xl font-bold text-red-500">${(typeof calculateTotalPrice() === 'number' ? calculateTotalPrice() : 0).toFixed(2)}</div>
                    </div>
                    

                    {!cartItem ? (
                        <button
                            onClick={handleAddToCart}
                            className="inline-flex items-center justify-center bg-red-500 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base font-medium w-full sm:w-auto"
                        >
                            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            Add to Cart
                        </button>
                    ) : (
                        <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1 justify-center sm:justify-start">
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
                </div>}
            </div>
            <div className="lg:w-1/2 w-full mt-4 lg:mt-0 order-1 lg:order-2">
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                    {/* Dietary Information icons overlay */}
                    {product.dietary && Object.values(product.dietary).some(value => value) && (
                        <div className="absolute top-2 right-2 z-10 flex flex-wrap gap-1 justify-end">
                            {product.dietary.isVegan && (
                                <div className="bg-green-500 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                                    <LuVegan className="w-3 h-3 sm:w-5 sm:h-5" />
                                </div>
                            )}
                            {product.dietary.isVegetarian && (
                                <div className="bg-green-500 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                                    <IoLeafOutline className="w-3 h-3 sm:w-5 sm:h-5" />
                                </div>
                            )}
                            {product.dietary.isGlutenFree && (
                                <div className="bg-blue-500 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                                    <CiWheat className="w-3 h-3 sm:w-5 sm:h-5" />
                                </div>
                            )}
                        </div>
                    )}
                    {product.image ? (
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                        />
                    ) : (
                        <div className="w-full h-48 sm:h-56 lg:h-64 bg-red-100 flex items-center justify-center">
                            <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-500">
                                {product.name && product.name.length > 0 
                                    ? product.name.charAt(0).toUpperCase() 
                                    : 'P'}
                            </span>
                        </div>
                    )}
                </div>
                
                {/* Product Name, Description, Price and Add to Cart - Show under image on mobile */}
                <div className="lg:hidden mt-4">
                    {/* Product name with price on the right */}
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 flex-1 mr-4">
                            {/* Food Type Icons - Veg/Non-Veg */}
                            {product.dietary && (product.dietary.isVegetarian || product.dietary.isVegan) ? (
                                <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-green-600 flex-shrink-0">
                                    <GoDotFill className="w-2 h-2 text-green-600" />
                                </div>
                            ) : (
                                <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-red-600 flex-shrink-0">
                                    <GoDotFill className="w-2 h-2 text-red-600" />
                                </div>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-red-500 flex-shrink-0">
                            {formatToDollar(product.price)}
                        </div>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm sm:text-base">{product.description}</p>
                    
                    {/* Modifiers List for mobile - positioned after description */}
                    <div className='max-h-[300px] sm:max-h-[400px] overflow-y-auto thin-scrollbar mb-4'>
                        <ModifiersList 
                            modifiersList={modifiersList}
                            handleModifierOptionSelect={handleModifierOptionSelect}
                            isModifierOptionSelected={isModifierOptionSelected}
                            spiceLevel={spiceLevel}
                            setSpiceLevel={setSpiceLevel}
                            validationErrors={validationErrors}
                            product={product}
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 mb-4 gap-3 sm:gap-0">
                        <div>
                            <div className="text-xl sm:text-2xl font-bold text-red-500">${(typeof calculateTotalPrice() === 'number' ? calculateTotalPrice() : 0).toFixed(2)}</div>
                        </div>
                        
                        {/* Add to Cart button or Quantity Controls */}
                        {!cartItem ? (
                            <button
                                onClick={handleAddToCart}
                                className="inline-flex items-center justify-center bg-red-500 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base font-medium w-full sm:w-auto"
                            >
                                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                Add to Cart
                            </button>
                        ) : (
                            <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1 justify-center sm:justify-start">
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
                
                {/* You May Also Like section for mobile - positioned after image */}
                {showRecommendedProducts && (
                    <div className="lg:hidden mt-4 sm:mt-6">
                        <RecommendedProducts 
                            currentProductId={currentProductId} 
                            allItems={allItems} 
                            product={product} 
                        />
                    </div>
                )}
                
                <div className='mt-3 sm:mt-5'>
                
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
