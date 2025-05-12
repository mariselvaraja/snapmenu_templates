import React from 'react';
import { MenuItem } from '../../../../common/redux';

interface NutritionalInfoProps {
    product: MenuItem;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ product }) => {
    // Check if there's any nutritional information to display
    const hasNutritionalInfo = product.calories || 
        (product.nutrients && Object.keys(product.nutrients).length > 0);
    
    if (!hasNutritionalInfo) {
        return null;
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
                Nutritional Information
            </h2>
            <div className="flex flex-wrap gap-4 pl-2 border-b border-gray-100 pb-4">
                {product.calories && (
                    <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-700">Calories</span>
                        <span className="text-gray-900">{product.calories}</span>
                    </div>
                )}
                {product.nutrients && Object.entries(product.nutrients).map(([key, value]) => (
                    value && (
                        <div key={key} className="flex flex-col items-center">
                            <span className="font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                            <span className="text-gray-900">{value}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default NutritionalInfo;
