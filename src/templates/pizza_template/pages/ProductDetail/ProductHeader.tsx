import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';
import { CiWheat } from 'react-icons/ci';
import { MenuItem } from '../../../../common/redux';
import { SelectedModifier } from './types';
import SpiceLevelSelector from './SpiceLevelSelector';
import ModifiersList from './ModifiersList';

interface ProductHeaderProps {
    product: MenuItem;
    quantity: number;
    handleIncrement: () => void;
    handleDecrement: () => void;
    handleAddToCart: (product: MenuItem) => void;
    cartItem: any;
    calculateTotalPrice: () => number;
    selectedModifiers: SelectedModifier[];
    spiceLevel: number;
    setSpiceLevel: (level: number) => void;
    modifiersList: any[];
    handleModifierOptionSelect: (modifierName: string, option: any) => void;
    isModifierOptionSelected: (modifierName: string, optionName: string) => boolean;
    validationErrors?: {
        [key: string]: boolean;
    };
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
    product,
    quantity,
    handleIncrement,
    handleDecrement,
    handleAddToCart,
    cartItem,
    calculateTotalPrice,
    selectedModifiers,
    spiceLevel,
    setSpiceLevel,
    modifiersList,
    handleModifierOptionSelect,
    isModifierOptionSelected,
    validationErrors = {}
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div className="md:pr-8 md:w-1/2">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-700 mb-3">{product.description}</p>
                
                {/* Modifiers List with Spice Level */}
                <ModifiersList 
                    modifiersList={modifiersList}
                    handleModifierOptionSelect={handleModifierOptionSelect}
                    isModifierOptionSelected={isModifierOptionSelected}
                    spiceLevel={spiceLevel}
                    setSpiceLevel={setSpiceLevel}
                    validationErrors={validationErrors}
                />
                
                <div className="flex items-center justify-between mt-4 mb-4">
                    <div>
                        <div className="text-2xl font-bold text-red-500">${calculateTotalPrice().toFixed(2)}</div>
                        {/* {selectedModifiers.length > 0 && (
                            <div className="text-sm text-gray-500">
                                Base: ${product.price} + Add-ons: ${(calculateTotalPrice() - product.price * quantity).toFixed(2)}
                            </div>
                        )} */}
                    </div>
                    
                    {/* Add button or quantity controls */}
                    {!cartItem || cartItem.quantity <= 0 ? (
                        <button
                            className="inline-flex items-center bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition-colors text-base font-medium"
                            onClick={() => handleAddToCart(product)}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart
                        </button>
                    ) : (
                        <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
                            <button
                                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors"
                                onClick={handleDecrement}
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="mx-3 text-base font-semibold">{quantity}</span>
                            <button
                                className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                onClick={handleIncrement}
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
            </div>
        </div>
    );
};

export default ProductHeader;
