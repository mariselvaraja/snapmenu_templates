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
        <div className="mb-6 sm:mb-8">
            <div className="space-y-3 sm:space-y-4">
                {product.supplier && (
                    <div className="border-b border-gray-100 pb-2 sm:pb-3">
                        <div className="flex items-center mb-1">
                            <Box className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700 text-sm sm:text-base">Supplier</span>
                        </div>
                        <div className="text-gray-900 pl-5 sm:pl-6 text-sm sm:text-base">{product.supplier}</div>
                    </div>
                )}
                {product.brand && (
                    <div className="border-b border-gray-100 pb-2 sm:pb-3">
                        <div className="flex items-center mb-1">
                            <Box className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700 text-sm sm:text-base">Brand</span>
                        </div>
                        <div className="text-gray-900 pl-5 sm:pl-6 text-sm sm:text-base">{product.brand}</div>
                    </div>
                )}
                {product.unit && (
                    <div className="border-b border-gray-100 pb-2 sm:pb-3">
                        <div className="flex items-center mb-1">
                            <Box className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700 text-sm sm:text-base">Unit</span>
                        </div>
                        <div className="text-gray-900 pl-5 sm:pl-6 text-sm sm:text-base">{product.unit}</div>
                    </div>
                )}
                {product.external_id && (
                    <div className="border-b border-gray-100 pb-2 sm:pb-3">
                        <div className="flex items-center mb-1">
                            <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700 text-sm sm:text-base">External ID</span>
                        </div>
                        <div className="text-gray-900 pl-5 sm:pl-6 text-sm sm:text-base">{product.external_id}</div>
                    </div>
                )}
                {product.bar_code && (
                    <div className="border-b border-gray-100 pb-2 sm:pb-3">
                        <div className="flex items-center mb-1">
                            <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700 text-sm sm:text-base">Bar Code</span>
                        </div>
                        <div className="text-gray-900 pl-5 sm:pl-6 text-sm sm:text-base">{product.bar_code}</div>
                    </div>
                )}
                {product.comment && (
                    <div className="border-b border-gray-100 pb-2 sm:pb-3">
                        <div className="flex items-center mb-1">
                            <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-500" />
                            <span className="font-medium text-gray-700 text-sm sm:text-base">Chef Notes</span>
                        </div>
                        <div className="text-gray-900 pl-5 sm:pl-6 text-sm sm:text-base">{product.comment}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsSection;
