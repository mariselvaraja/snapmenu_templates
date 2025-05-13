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
        <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
            <button 
                className="w-full text-left px-4 py-3 bg-gray-50 flex items-center justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-xl font-semibold flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Allergens
                </h2>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
            </button>
            
            {isExpanded && (
                <div className="flex flex-wrap gap-2 p-4">
                {product.allergens.map((allergen, index) => (
                    <span 
                        key={index} 
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
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
