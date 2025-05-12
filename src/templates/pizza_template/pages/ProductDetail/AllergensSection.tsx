import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { MenuItem } from '../../../../common/redux';

interface AllergensSectionProps {
    product: MenuItem;
}

const AllergensSection: React.FC<AllergensSectionProps> = ({ product }) => {
    if (!product.allergens || product.allergens.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Allergens
            </h2>
            <div className="flex flex-wrap gap-2 pl-6">
                {product.allergens.map((allergen, index) => (
                    <span 
                        key={index} 
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                        {allergen}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AllergensSection;
