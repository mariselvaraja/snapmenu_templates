import React, { useState } from 'react';
import { Box, ChevronDown, ChevronUp } from 'lucide-react';
import { MenuItem } from '../../../../common/redux';

interface IngredientsSectionProps {
    product: MenuItem;
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({ product }) => {
    // State to track if section is expanded (true) or collapsed (false)
    // Collapsed by default
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!product.ingredients || product.ingredients.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 sm:mb-8 border border-gray-200 rounded-lg overflow-hidden">
            <button 
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 flex items-center justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-lg sm:text-xl font-semibold flex items-center">
                    <Box className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Ingredients
                </h2>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                )}
            </button>
            
            {isExpanded && (
                <div className="flex flex-wrap gap-2 p-3 sm:p-4">
                {product.ingredients.map((ingredient, index) => (
                    <span 
                        key={index} 
                        className="bg-gray-100 text-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                    >
                        {ingredient}
                    </span>
                ))}
                </div>
            )}
        </div>
    );
};

export default IngredientsSection;
