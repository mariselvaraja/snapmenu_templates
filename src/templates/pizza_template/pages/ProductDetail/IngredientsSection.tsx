import React from 'react';
import { Box } from 'lucide-react';
import { MenuItem } from '../../../../common/redux';

interface IngredientsSectionProps {
    product: MenuItem;
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({ product }) => {
    if (!product.ingredients || product.ingredients.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Box className="h-5 w-5 mr-2" />
                Ingredients
            </h2>
            <div className="flex flex-wrap gap-2 pl-6">
                {product.ingredients.map((ingredient, index) => (
                    <span 
                        key={index} 
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                        {ingredient}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default IngredientsSection;
