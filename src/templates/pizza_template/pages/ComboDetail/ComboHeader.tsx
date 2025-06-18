import { ShoppingCart, Tag, TrendingDown } from 'lucide-react';
import { ComboHeaderProps } from './types';

export default function ComboHeader({
    combo,
    handleAddToCart,
    isPaymentAvilable,
    showPrice,
    calculateSavings,
    calculateIndividualTotal
}: ComboHeaderProps) {
    const comboPrice = parseFloat(combo.combo_price.replace(/[^\d.-]/g, '')) || 0;
    const individualTotal = calculateIndividualTotal();
    const savings = calculateSavings();

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 relative h-[350px]">
            <div className="flex flex-col md:flex-row h-full">
                {/* Left side - Full Vertical Image */}
                <div className="w-full md:w-2/5 lg:w-2/5 order-1 md:order-1">
                    {combo.combo_image ? (
                        <img
                            src={combo.combo_image}
                            alt={combo.title}
                            className="w-full h-64 md:h-full object-cover object-top rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                        />
                    ) : (
                        <div className="w-full h-64 md:h-full bg-red-100 flex items-center justify-center rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                            <div className="text-center px-4">
                                <span className="text-6xl sm:text-8xl font-bold text-red-500 block mb-2">
                                    {combo.title && combo.title.length > 0
                                        ? combo.title.charAt(0).toUpperCase()
                                        : 'C'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right side - Combo Information */}
                <div className="w-full md:w-3/5 lg:w-3/5 order-2 md:order-2 max-h-[400px] overflow-y-auto">
                    <div className="p-4 md:p-6 flex flex-col h-full">
                        <div className="mb-3">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 line-clamp-2">
                                {combo.title}
                            </h1>

                            {/* Pricing Information */}
                            {showPrice && (
                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center gap-3">
                                        {savings > 0 && (
                                            <span className="text-lg text-gray-500 line-through">
                                                ${individualTotal.toFixed(2)}
                                            </span>
                                        )}
                                        <span className="text-2xl sm:text-3xl font-bold text-red-500">
                                            ${comboPrice.toFixed(2)}
                                        </span>
                                    </div>

                                    {combo.offer_percentage && parseFloat(combo.offer_percentage) > 0 && (
                                        <div className="flex items-center gap-2">
                                            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                <Tag className="w-3 h-3" />
                                                {combo.offer_percentage}% OFF
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                                {combo.description}
                            </p>
                        </div>

                        {/* Add to Cart Button - Normal Flow */}
                        {showPrice && isPaymentAvilable && (
                            <div className="mt-auto flex justify-end">
                                <button
                                    onClick={handleAddToCart}
                                    className="inline-flex items-center justify-center bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors text-sm font-medium shadow-lg hover:shadow-xl"
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
