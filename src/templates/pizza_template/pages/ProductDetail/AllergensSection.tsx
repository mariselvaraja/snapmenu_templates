import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { MenuItem } from '../../../../common/redux';

interface AllergensSectionProps {
    product: MenuItem;
}

const AllergensSection: React.FC<AllergensSectionProps> = ({ product }) => {
    // State to track if section is expanded (true) or collapsed (false)
    // Collapsed by default
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!product.allergens || product.allergens.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 sm:mb-8 border border-gray-200 rounded-lg overflow-hidden">
            <button 
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 flex items-center justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-lg sm:text-xl font-semibold flex items-center">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Allergens
                </h2>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                )}
            </button>
            
            {isExpanded && (
                <div className="flex flex-wrap gap-2 p-3 sm:p-4">
                {product.allergens.map((allergen, index) => (
                    <span 
                        key={index} 
                        className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-gray-100"
                    >
                        {allergen}
                    </span>
                ))}
                </div>
            )}
        </div>
    );
};

export default AllergensSection;
