import React from 'react';
import { Box, Info } from 'lucide-react';
import { MenuItem } from '../../../../common/redux';

interface ProductDetailsSectionProps {
    product: MenuItem;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({ product }) => {
    // If there are no details to show, return null
    if (!product.supplier && !product.brand && !product.unit && 
        !product.external_id && !product.bar_code && !product.comment) {
        return null;
    }

    return (
        <div className="mb-8">
            <div className="space-y-4">
                {product.supplier && (
                    <div className="border-b border-gray-100 pb-3">
                        <div className="flex items-center mb-1">
                            <Box className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700">Supplier</span>
                        </div>
                        <div className="text-gray-900 pl-6">{product.supplier}</div>
                    </div>
                )}
                {product.brand && (
                    <div className="border-b border-gray-100 pb-3">
                        <div className="flex items-center mb-1">
                            <Box className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700">Brand</span>
                        </div>
                        <div className="text-gray-900 pl-6">{product.brand}</div>
                    </div>
                )}
                {product.unit && (
                    <div className="border-b border-gray-100 pb-3">
                        <div className="flex items-center mb-1">
                            <Box className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700">Unit</span>
                        </div>
                        <div className="text-gray-900 pl-6">{product.unit}</div>
                    </div>
                )}
                {product.external_id && (
                    <div className="border-b border-gray-100 pb-3">
                        <div className="flex items-center mb-1">
                            <Info className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700">External ID</span>
                        </div>
                        <div className="text-gray-900 pl-6">{product.external_id}</div>
                    </div>
                )}
                {product.bar_code && (
                    <div className="border-b border-gray-100 pb-3">
                        <div className="flex items-center mb-1">
                            <Info className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700">Bar Code</span>
                        </div>
                        <div className="text-gray-900 pl-6">{product.bar_code}</div>
                    </div>
                )}
                {product.comment && (
                    <div className="border-b border-gray-100 pb-3">
                        <div className="flex items-center mb-1">
                            <Info className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700">Chef Notes</span>
                        </div>
                        <div className="text-gray-900 pl-6">{product.comment}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsSection;
