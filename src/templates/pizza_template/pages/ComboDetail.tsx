import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../redux';
import { useState, useEffect } from 'react';
import { useCartWithToast } from '../hooks/useCartWithToast';
import { useCart, generateSkuId, CartItem } from '../context/CartContext';
import LoadingState from './ComboDetail/LoadingState';
import ErrorState from './ComboDetail/ErrorState';
import ComboHeader from './ComboDetail/ComboHeader';
import ComboProductsList from './ComboDetail/ComboProductsList';
import { usePayment } from '@/hooks';
import { fetchComboRequest } from '../../../redux/slices/comboSlice';

export default function ComboDetail() {
    const { comboId } = useParams<{ comboId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { addItemWithToast } = useCartWithToast();
    
    // Get combo data from Redux store
    const { data: comboData, loading, error } = useAppSelector(state => state.combo);
    
    // Find the combo in the combo data
    const combo = comboData?.find((item: any) => item.combo_id === comboId);
    
    const { rawApiResponse } = useAppSelector(state => state.siteContent);
    // Get site content from Redux state
    const siteContent = rawApiResponse ? 
      (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
      {};
    const siteConfiguration = siteContent?.siteConfiguration;
    const showPrice = siteConfiguration?.hidePriceInWebsite? false:  siteConfiguration?.hidePriceInProductDetails?false:true;
    
    console.log("combo", combo);
    
    // Get cart items from cart context
    const { state: { items: cartItems }, toggleDrawer } = useCart();
    
    const {isPaymentAvilable} = usePayment();
    
    // Scroll to top when component mounts or comboId changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [comboId]);

    // Check if combo data exists, if not call API
    useEffect(() => {
        if (comboId) {
            // Check if combo exists in Redux data
            const existingCombo = comboData?.find((item: any) => item.combo_id === comboId);
            
            if (!existingCombo && !loading && (!comboData || comboData.length === 0)) {
                // Combo not found in Redux and no data loaded, fetch from API
                console.log('Combo not found in Redux, fetching from API...');
                dispatch(fetchComboRequest());
            }
        }
    }, [comboId, comboData, loading, dispatch]);

    // Create combo cart item
    const createComboCartItem = (combo: any): CartItem => {
        const comboPrice = parseFloat(combo.combo_price.replace(/[^\d.-]/g, '')) || 0;
        
        return {
            pk_id: parseInt(combo.combo_id) || 0,
            sku_id: `combo_${combo.combo_id}`,
            name: combo.title,
            price: comboPrice,
            image: combo.combo_image || '',
            quantity: 1,
            spiceLevel: '',
            selectedModifiers: []
        };
    };
    
    // Handle add to cart
    const handleAddToCart = () => {
        if (combo) {
            const cartItem = createComboCartItem(combo);
            addItemWithToast(cartItem);
            toggleDrawer(true);
        }
    };
    
    // Calculate total price of individual products
    const calculateIndividualTotal = () => {
        if (!combo?.products) return 0;
        
        return combo.products.reduce((total: number, product: any) => {
            const productPrice = typeof product.price === 'string' 
                ? parseFloat(product.price.replace(/[^\d.-]/g, '')) || 0
                : product.price || 0;
            return total + productPrice;
        }, 0);
    };
    
    // Calculate savings
    const calculateSavings = () => {
        const individualTotal = calculateIndividualTotal();
        const comboPrice = parseFloat(combo?.combo_price?.replace(/[^\d.-]/g, '') || '0');
        return individualTotal - comboPrice;
    };

    // Handle loading state
    if (loading) {
        return <LoadingState />;
    }
    
    // Handle error state
    if (error) {
        return <ErrorState error={error} />;
    }
    
    // Show maintenance message if combo data is empty but no error
    if (!loading && !error && (!comboData || comboData.length === 0)) {
        return <ErrorState error={null} isMaintenanceMode={true} />;
    }
    
    // Handle combo not found
    if (!combo) {
        return <ErrorState error={null} isComboNotFound={true} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
            <div className="py-6 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Back Button */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="group inline-flex items-center mb-6 sm:mb-8 lg:mb-10 bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-3 sm:px-6 sm:py-3 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 text-sm sm:text-base font-medium border border-gray-200/50 hover:border-red-200"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        Back
                    </button>

                    {/* Enhanced Unified Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 items-start">
                        {/* Combo Details */}
                        <div className="lg:col-span-3">
                            <div className="h-full transform transition-all duration-500 hover:scale-[1.01]">
                                <ComboHeader 
                                    combo={combo}
                                    handleAddToCart={handleAddToCart}
                                    isPaymentAvilable={isPaymentAvilable}
                                    showPrice={showPrice}
                                    calculateSavings={calculateSavings}
                                    calculateIndividualTotal={calculateIndividualTotal}
                                />
                            </div>
                        </div>

                        {/* Included Products */}
                        <div className="lg:col-span-2">
                            <div className="h-full sticky top-6 transform transition-all duration-500 hover:scale-[1.01]">
                                <ComboProductsList 
                                    combo={combo}
                                    showPrice={showPrice}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
