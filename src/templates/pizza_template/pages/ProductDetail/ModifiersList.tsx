import React, { useState, useEffect } from 'react';
import { Box, Check } from 'lucide-react';
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
}

const ModifiersList: React.FC<ModifiersListProps> = ({ 
    modifiersList, 
    handleModifierOptionSelect, 
    isModifierOptionSelected,
    spiceLevel,
    setSpiceLevel,
    validationErrors = {}
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

    if (modifiersList.length === 0) {
        return null;
    }

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

    // Sort modifiers - required first, then non-required
    const requiredModifiers = modifiersList.filter(modifier => isModifierRequired(modifier));
    const optionalModifiers = modifiersList.filter(modifier => !isModifierRequired(modifier));

    return (
        <div className="mb-4">
            {/* Spice Level Modifier */}
            {spiceLevel !== undefined && setSpiceLevel && (
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">
                        Spice Level
                        <span className="text-red-500 text-sm ml-1">*</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {spiceLevelModifier.options.map((option, index) => (
                            <button
                                key={option.name}
                                onClick={() => handleSpiceLevelSelect(index + 1)}
                                className={`p-2 rounded-lg border text-left transition-colors flex items-center ${
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
                                <div className="font-medium flex items-center justify-center">
                                    <div className="ml-2 flex">
                                        {option.name === 'Mild' && <FaPepperHot className="text-red-300 h-4 w-4" />}
                                        {option.name === 'Medium' && (
                                            <>
                                                <FaPepperHot className="text-red-400 h-4 w-4" />
                                                <FaPepperHot className="text-red-400 h-4 w-4 ml-1" />
                                            </>
                                        )}
                                        {option.name === 'Hot' && (
                                            <>
                                                <FaPepperHot className="text-red-500 h-4 w-4" />
                                                <FaPepperHot className="text-red-500 h-4 w-4 ml-1" />
                                                <FaPepperHot className="text-red-500 h-4 w-4 ml-1" />
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
            {requiredModifiers.map((modifier, modIndex) => (
                <div key={`required-${modIndex}`} className="mb-6">
                    <h3 className="font-semibold mb-2">
                        {modifier.name}
                        <span className="text-red-500 text-sm ml-1">*</span>
                    </h3>
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
                                        <div className="text-sm text-gray-600 ml-auto">(+${typeof option.price === 'number' ? option.price.toFixed(2) : option.price})</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {localValidationErrors[modifier.name] && (
                        <div className="text-red-500 text-sm mt-2 font-medium">Please select at least one {modifier.name.toLowerCase()} option before adding to cart</div>
                    )}
                </div>
            ))}

            {/* Optional Modifiers */}
            {optionalModifiers.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        {/* <Box className="h-4 w-4 mr-1 text-red-500" /> */}
                        {/* <span className="text-sm font-medium text-gray-700">Optional Add-ons:</span> */}
                    </div>
                    {optionalModifiers.map((modifier, modIndex) => (
                        <div key={`optional-${modIndex}`} className="mb-4">
                            <h3 className="font-semibold mb-2">
                                {modifier.name}
                            </h3>
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
                                                <div className="text-sm text-gray-600 ml-auto">(+${typeof option.price === 'number' ? option.price.toFixed(2) : option.price})</div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModifiersList;
