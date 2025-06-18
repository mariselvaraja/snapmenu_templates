import { Package, DollarSign } from 'lucide-react';
import { ComboProductsListProps } from './types';

export default function ComboProductsList({ combo, showPrice }: ComboProductsListProps) {
    if (!combo?.products || combo?.products?.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-red-500" />
                    Included Products
                </h3>
                <p className="text-gray-500 text-center py-8">
                    No products information available for this combo.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 w-full h-[350px] flex flex-col">
            {/* Enhanced Header - Fixed */}
            <div className="p-6 pb-4 border-b border-gradient-to-r from-red-100 to-transparent flex-shrink-0">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-3 text-gray-800">
                    <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Included Products
                    </span>
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                        {combo?.products?.length}
                    </span>
                </h3>
            </div>
            
            {/* Enhanced Products List - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
                <div className="space-y-4">
                {combo?.products?.map((product, index) => {
                    const productPrice = typeof product?.price === 'string' 
                        ? parseFloat(product?.price?.replace(/[^\d.-]/g, '')) || 0
                        : product?.price || 0;

                    return (
                        <div 
                            key={product?.pk_id || index} 
                            className="group flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/60 rounded-xl hover:border-red-300 hover:shadow-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50/30 hover:to-white"
                        >
                            {/* Enhanced Product Image */}
                            <div className="flex-shrink-0 relative">
                                {product?.image ? (
                                    <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                                        <img
                                            src={product?.image}
                                            alt={product?.name}
                                            className="w-16 h-16 object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:from-red-200 group-hover:to-red-300">
                                        <span className="text-lg font-bold text-red-600 group-hover:text-red-700 transition-colors duration-300">
                                            {product?.name && product?.name?.length > 0 
                                              ? product?.name?.charAt(0)?.toUpperCase() 
                                              : 'P'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Product Details */}
                            <div className="flex-1 min-w-0 min-h-[64px] flex flex-col justify-center">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-red-700 transition-colors duration-300">
                                            {product?.name}
                                        </h4>
                                        {product?.product_description && (
                                            <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
                                                {product?.product_description}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {showPrice && (
                                        <div className="flex-shrink-0 text-right">
                                            <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 rounded-lg shadow-sm group-hover:from-red-100 group-hover:to-red-200 transition-all duration-300">
                                                <span className="text-sm font-bold text-gray-700 flex items-center gap-1 group-hover:text-red-700">
                                                    <DollarSign className="w-3 h-3" />
                                                    {productPrice?.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        </div>
    );
}
