import React from 'react';
import { motion } from 'framer-motion';
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';
import { CiWheat } from 'react-icons/ci';
import { GoDotFill } from 'react-icons/go';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { MenuItem, useAppSelector } from '../../../../common/redux';
import { useCart, generateSkuId, normalizeModifiers } from '../../context/CartContext';
import { SelectedModifier } from './types';
import ModifiersList from './ModifiersList';
import NutritionalInfo from './NutritionalInfo';
import IngredientsSection from './IngredientsSection';
import AllergensSection from './AllergensSection';
import RecommendedProducts from './RecommendedProducts';
import { usePayment } from '@/hooks';

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
    showPrice?:boolean;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
    product,
    calculateTotalPrice,
    selectedModifiers,
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
    isPaymentAvilable,
    showPrice
}) => {
    // Get cart items from cart context
    const { state: { items: cartItems }, updateItemQuantity, removeItem } = useCart();


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

    
    // Generate the expected sku_id based on current modifiers and spice level using standardized functions
    let allModifiers = [...selectedModifiers];
    
    // Add spice level as a modifier if it's set
    if (spiceLevel > 0) {
        const spiceLevelNames = ['Mild', 'Medium', 'Hot'];
        const spiceLevelModifier = {
            name: 'Spice Level',
            options: [{
                name: spiceLevelNames[spiceLevel - 1],
                price: 0
            }]
        };
        
        // Check if spice level modifier already exists
        const existingSpiceLevelIndex = allModifiers.findIndex(mod => mod.name === 'Spice Level');
        if (existingSpiceLevelIndex >= 0) {
            allModifiers[existingSpiceLevelIndex] = spiceLevelModifier;
        } else {
            allModifiers.push(spiceLevelModifier);
        }
    }
    
    // Use the standardized normalizeModifiers function to ensure consistency
    const normalizedModifiers = normalizeModifiers(allModifiers);
    
    const expectedSkuId = generateSkuId(
        typeof product.pk_id === 'string' ? parseInt(product.pk_id) : (product.pk_id || 0), 
        normalizedModifiers
    );
    
    // Check if this specific variant is in the cart
    const cartItem = cartItems.find((item:any) => item.sku_id === expectedSkuId);
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
                        {/* Out of Stock indicator */}
                        {product.inventory_status === false && (
                            <span className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded ml-2">
                                Out Of Stock
                            </span>
                        )}
                    </div>
                    <p className="text-gray-700 mb-2 text-sm sm:text-base">{product.description}</p>
                    
                  { modifiersList && modifiersList?.length !=0  && <div className="text-lg sm:text-xl font-bold text-red-500 mb-3">
                      {showPrice && <>  <span className="text-gray-700 font-normal mr-2">Price:</span>
                        {formatToDollar(product.price)}</>}
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
                    showPrice={showPrice}
                />
                </div>
                
         {       <div className="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 mb-4 gap-3 sm:gap-0">
                    <div>
                     { showPrice &&  <div className="text-xl sm:text-2xl font-bold text-red-500">${(typeof calculateTotalPrice() === 'number' ? calculateTotalPrice() : 0).toFixed(2)}</div>}
                    </div>
                    
                   {showPrice && isPaymentAvilable &&   <div>
                    {product.inventory_status === false ? (
                        <button
                            className="inline-flex items-center justify-center bg-gray-400 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full cursor-not-allowed text-sm sm:text-base font-medium w-full sm:w-auto"
                            disabled
                        >
                            Out Of Stock
                        </button>
                    ) : !cartItem ? (
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
                                        updateItemQuantity(cartItem.sku_id, newQuantity);
                                    } else {
                                        removeItem(cartItem.sku_id);
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
                                    updateItemQuantity(cartItem.sku_id, cartItem.quantity + 1);
                                }}
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    </div>}
                </div>}
            </div>
            <div className="lg:w-1/2 w-full mt-4 lg:mt-0 order-1 lg:order-2">
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                    {/* Dietary Information icons overlay */}
                    {(product.dietary && Object.values(product.dietary).some(value => value)) || product.food_type === 'veg' ? (
                        <div className="absolute top-2 right-2 z-10 flex flex-wrap gap-1 justify-end">
                            {product.food_type === 'veg' && (
                                <div className="bg-green-600 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                                    <IoLeafOutline className="w-3 h-3 sm:w-5 sm:h-5" />
                                </div>
                            )}
                            {product.dietary?.isVegan && (
                                <div className="bg-green-500 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                                    <LuVegan className="w-3 h-3 sm:w-5 sm:h-5" />
                                </div>
                            )}
                            {product.dietary?.isVegetarian && (
                                <div className="bg-green-500 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                                    <IoLeafOutline className="w-3 h-3 sm:w-5 sm:h-5" />
                                </div>
                            )}
                            {product.dietary?.isGlutenFree && (
                                <div className="bg-blue-500 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                                    <CiWheat className="w-3 h-3 sm:w-5 sm:h-5" />
                                </div>
                            )}
                        </div>
                    ) : null}
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
                            {/* Out of Stock indicator for mobile */}
                            {product.inventory_status === false && (
                                <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded ml-2">
                                    Out Of Stock
                                </span>
                            )}
                        </div>
                    { showPrice &&    <div className="text-lg sm:text-xl font-bold text-red-500 flex-shrink-0">
                            {formatToDollar(product.price)}
                        </div>}
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
                            showPrice={showPrice}
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 mb-4 gap-3 sm:gap-0">
                        <div>
                           {showPrice && <div className="text-xl sm:text-2xl font-bold text-red-500">${(typeof calculateTotalPrice() === 'number' ? calculateTotalPrice() : 0).toFixed(2)}</div>}
                        </div>
                        
                        {/* Add to Cart button or Quantity Controls */}
                  {   isPaymentAvilable &&   <div>
                        {product.inventory_status === false ? (
                            <button
                                className="inline-flex items-center justify-center bg-gray-400 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full cursor-not-allowed text-sm sm:text-base font-medium w-full sm:w-auto"
                                disabled
                            >
                                Out Of Stock
                            </button>
                        ) : !cartItem ? (
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
                                            updateItemQuantity(cartItem.sku_id, newQuantity);
                                        } else {
                                            removeItem(cartItem.sku_id);
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
                                        updateItemQuantity(cartItem.sku_id, cartItem.quantity + 1);
                                    }}
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        </div>}
                       
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
