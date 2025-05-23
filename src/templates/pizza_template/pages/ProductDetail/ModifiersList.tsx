import React, { useState, useEffect } from 'react';
import { Box, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { FaPepperHot } from 'react-icons/fa';
import { Modifier, ModifierOption } from './types';

interface ModifiersListProps {
    modifiersList: Modifier[];
    handleModifierOptionSelect: (modifierName: string, option: ModifierOption) => void;
    isModifierOptionSelected: (modifierName: string, optionName: string) => boolean;
    spiceLevel?: number;
    setSpiceLevel?: (level: number) => void;
    validationErrors?: {
        [key: string]: boolean;
    };
    product?: any; // Add product prop to access is_spice_applicable
}

const ModifiersList: React.FC<ModifiersListProps> = ({ 
    modifiersList, 
    handleModifierOptionSelect, 
    isModifierOptionSelected,
    spiceLevel,
    setSpiceLevel,
    validationErrors = {},
    product
}) => {
    // Create a local copy of validation errors that we can update
    const [localValidationErrors, setLocalValidationErrors] = useState<{
        [key: string]: boolean;
    }>(validationErrors);

    // Update local validation errors when props change
    useEffect(() => {
        setLocalValidationErrors(validationErrors);
    }, [validationErrors]);

    // Custom handler for modifier option selection that also clears validation errors
    const handleModifierOptionSelectWithValidation = (modifierName: string, option: ModifierOption) => {
        // Call the original handler
        handleModifierOptionSelect(modifierName, option);
        
        // Clear validation error for this modifier
        if (localValidationErrors[modifierName]) {
            const newErrors = { ...localValidationErrors };
            delete newErrors[modifierName];
            setLocalValidationErrors(newErrors);
        }
    };

    // Helper function to check if a modifier is multi-select
    const isModifierMultiSelect = (modifier: Modifier): boolean => {
        return modifier.is_multi_select?.toLowerCase() === 'yes' || false;
    };

    // Helper function to check if a modifier is required
    const isModifierRequired = (modifier: Modifier): boolean => {
        return modifier.is_forced?.toLowerCase() === 'yes' || false;
    };

    // Spice level modifier
    const spiceLevelModifier: Modifier = {
        name: 'Spice Level',
        is_multi_select: 'no',
        is_forced: 'yes',
        options: [
            { name: 'Mild', price: 0 },
            { name: 'Medium', price: 0 },
            { name: 'Hot', price: 0 },
        ]
    };

    // State to track which modifiers are expanded
    const [expandedModifiers, setExpandedModifiers] = useState<{[key: string]: boolean}>({});
    
    // Custom handler for spice level selection that also clears validation errors
    const handleSpiceLevelSelect = (level: number) => {
        if (setSpiceLevel) {
            setSpiceLevel(level);
            
            // Clear spice level validation error
            if (localValidationErrors['Spice Level']) {
                const newErrors = { ...localValidationErrors };
                delete newErrors['Spice Level'];
                setLocalValidationErrors(newErrors);
            }
        }
    };
    
    // Initialize with only the first modifier expanded
    useEffect(() => {
       
        
        const requiredMods = modifiersList?.filter(modifier => isModifierRequired(modifier));
        const optionalMods = modifiersList?.filter(modifier => !isModifierRequired(modifier));
        
        const initialExpandedState: {[key: string]: boolean} = {};
        
        // Expand the first required modifier if available
        if (requiredMods?.length > 0) {
            initialExpandedState[`required-0`] = true;
        }
        // If no required modifiers, expand the first optional modifier if available
        else if (optionalMods?.length > 0) {
            initialExpandedState[`optional-0`] = true;
        }
        
        setExpandedModifiers(initialExpandedState);
    }, [modifiersList]);
    
    // Toggle the expanded state of a modifier
    const toggleModifier = (key: string) => {
        setExpandedModifiers(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Check if spice level should be shown based on is_spice_applicable
    const shouldShowSpiceLevel = () => {
        // Check if product has is_spice_applicable field and it's "yes"
        if (product?.is_spice_applicable?.toLowerCase() === 'yes') {
            return true;
        }
        // Also check in raw_api_data if it exists
        if (product?.raw_api_data) {
            try {
                const rawData = typeof product.raw_api_data === 'string' 
                    ? JSON.parse(product.raw_api_data) 
                    : product.raw_api_data;
                if (rawData?.is_spice_applicable?.toLowerCase() === 'yes') {
                    return true;
                }
            } catch (e) {
                // If parsing fails, continue with other checks
            }
        }
        return false;
    };

    // Sort modifiers - required first, then non-required
    const requiredModifiers = modifiersList?.filter(modifier => isModifierRequired(modifier));
    const optionalModifiers = modifiersList?.filter(modifier => !isModifierRequired(modifier));
    
    return (
        <div className="mb-4">
            {/* Spice Level Modifier - Only show if is_spice_applicable is "yes" */}
            {spiceLevel !== undefined && setSpiceLevel && shouldShowSpiceLevel() && (
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">
                        Spice Level
                        <span className="text-red-500 text-sm ml-1">*</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {spiceLevelModifier.options.map((option, index) => (
                            <button
                                key={option.name}
                                onClick={() => handleSpiceLevelSelect(index + 1)}
                                className={`p-2 sm:p-3 rounded-lg border text-left transition-colors flex items-center ${
                                    spiceLevel === index + 1
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="mr-2">
                                    <div className={`w-4 h-4 border rounded-full ${spiceLevel === index + 1 ? 'border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                        {spiceLevel === index + 1 && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                                    </div>
                                </div>
                                <div className="font-medium flex items-center text-sm sm:text-base">
                                    <div className="flex">
                                        {option.name === 'Mild' && <FaPepperHot className="text-red-300 h-3 w-3 sm:h-4 sm:w-4" />}
                                        {option.name === 'Medium' && (
                                            <>
                                                <FaPepperHot className="text-red-400 h-3 w-3 sm:h-4 sm:w-4" />
                                                <FaPepperHot className="text-red-400 h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                            </>
                                        )}
                                        {option.name === 'Hot' && (
                                            <>
                                                <FaPepperHot className="text-red-500 h-3 w-3 sm:h-4 sm:w-4" />
                                                <FaPepperHot className="text-red-500 h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                                <FaPepperHot className="text-red-500 h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    {localValidationErrors['Spice Level'] && (
                        <div className="text-red-500 text-sm mt-2 font-medium">Please select a spice level before adding to cart</div>
                    )}
                </div>
            )}

            {/* Required Modifiers */}
            {requiredModifiers?.map((modifier, modIndex) => (
                <div key={`required-${modIndex}`} className="mb-6 border rounded-lg overflow-hidden">
                    <div 
                        className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                        onClick={() => toggleModifier(`required-${modIndex}`)}
                    >
                        <h3 className="font-semibold">
                            {modifier.name}
                            <span className="text-red-500 text-sm ml-1">*</span>
                        </h3>
                        {expandedModifiers[`required-${modIndex}`] ? 
                            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                        }
                    </div>
                    {expandedModifiers[`required-${modIndex}`] && (
                        <div className="p-3">
                            <div className="grid grid-cols-1 gap-2">
                                {modifier.options.map((option, optIndex) => {
                                    // Handle empty option names by using the modifier name
                                    const displayName = option.name ? option.name : modifier.name;
                                    
                                    return (
                                        <button
                                            key={`${modIndex}-${optIndex}`}
                                            onClick={() => handleModifierOptionSelectWithValidation(modifier.name, option)}
                                            className={`p-2 rounded-lg border text-left transition-colors flex items-center gap-2 ${
                                                isModifierOptionSelected(modifier.name, option.name)
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="mr-2">
                                                {isModifierMultiSelect(modifier) ? (
                                                    <div className={`w-4 h-4 border rounded ${isModifierOptionSelected(modifier.name, option.name) ? 'bg-red-500 border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                                        {isModifierOptionSelected(modifier.name, option.name) && <Check className="h-3 w-3 text-white" />}
                                                    </div>
                                                ) : (
                                                    <div className={`w-4 h-4 border rounded-full ${isModifierOptionSelected(modifier.name, option.name) ? 'border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                                        {isModifierOptionSelected(modifier.name, option.name) && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-medium flex items-center justify-center line-clamp-1">
                                                {displayName}
                                            </div>
                                            {option.price !== undefined && parseFloat(String(option.price)) > 0 && (
                                                <div className="text-sm text-gray-600 ml-auto">
                                                    (+${typeof option.price === 'number' && !isNaN(option.price) 
                                                        ? option.price.toFixed(2) 
                                                        : typeof option.price === 'string' 
                                                            ? (parseFloat(option.price) || 0).toFixed(2)
                                                            : '0.00'})
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {localValidationErrors[modifier.name] && (
                                <div className="text-red-500 text-sm mt-2 font-medium">Please select at least one {modifier.name.toLowerCase()} option before adding to cart</div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {/* Optional Modifiers */}
            {optionalModifiers?.length > 0 && (
                <div className="mb-4">
                    {optionalModifiers.map((modifier, modIndex) => (
                        <div key={`optional-${modIndex}`} className="mb-4 border rounded-lg overflow-hidden">
                            <div 
                                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                                onClick={() => toggleModifier(`optional-${modIndex}`)}
                            >
                                <h3 className="font-semibold">
                                    {modifier.name}
                                </h3>
                                {expandedModifiers[`optional-${modIndex}`] ? 
                                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                }
                            </div>
                            {expandedModifiers[`optional-${modIndex}`] && (
                                <div className="p-3">
                                    <div className="grid grid-cols-1 gap-2">
                                        {modifier.options.map((option, optIndex) => {
                                            // Handle empty option names by using the modifier name
                                            const displayName = option.name ? option.name : modifier.name;
                                            
                                            return (
                                                <button
                                                    key={`${modIndex}-${optIndex}`}
                                                    onClick={() => handleModifierOptionSelectWithValidation(modifier.name, option)}
                                                    className={`p-2 rounded-lg border text-left transition-colors flex items-center gap-2 ${
                                                        isModifierOptionSelected(modifier.name, option.name)
                                                            ? 'border-red-500 bg-red-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="mr-2">
                                                        {isModifierMultiSelect(modifier) ? (
                                                            <div className={`w-4 h-4 border rounded ${isModifierOptionSelected(modifier.name, option.name) ? 'bg-red-500 border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                                                {isModifierOptionSelected(modifier.name, option.name) && <Check className="h-3 w-3 text-white" />}
                                                            </div>
                                                        ) : (
                                                            <div className={`w-4 h-4 border rounded-full ${isModifierOptionSelected(modifier.name, option.name) ? 'border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                                                {isModifierOptionSelected(modifier.name, option.name) && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="font-medium flex items-center justify-center line-clamp-1">
                                                        {displayName}
                                                    </div>
                                                    {option.price !== undefined && parseFloat(String(option.price)) > 0 && (
                                                        <div className="text-sm text-gray-600 ml-auto">
                                                            (+${typeof option.price === 'number' && !isNaN(option.price) 
                                                                ? option.price.toFixed(2) 
                                                                : typeof option.price === 'string' 
                                                                    ? (parseFloat(option.price) || 0).toFixed(2)
                                                                    : '0.00'})
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModifiersList;
