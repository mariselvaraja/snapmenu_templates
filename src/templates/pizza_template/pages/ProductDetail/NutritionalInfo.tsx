import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { MenuItem } from '../../../../common/redux';

interface NutritionalInfoProps {
    product: any;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ product }) => {
    // State to track if section is expanded (true) or collapsed (false)
    // NutritionalInfo is expanded by default
    const [isExpanded, setIsExpanded] = useState(true);
    
    // Check if there's any nutritional information to display
    const hasNutritionalInfo = product.Calories || 
        (product.Nutrients);
    
    if (!hasNutritionalInfo) {
        return null;
    }

    return (
        <div className="mb-6 sm:mb-8 border border-gray-200 rounded-lg overflow-hidden">
            <button 
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 flex items-center justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-lg sm:text-xl font-semibold flex items-center">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Nutritional Information
                </h2>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                )}
            </button>
            
            {isExpanded && (
                <div className="flex flex-wrap gap-2 p-3 sm:p-4">
                {product.Calories && (
                    <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-gray-100">
                        Calories: {product.Calories}
                    </span>
                )}
                {product.Nutrients && (
                    <span 
                        className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-gray-100"
                    >
                        {product.Nutrients}
                    </span>
                )}
                
                </div>
            )}
        </div>
    );
};

export default NutritionalInfo;
