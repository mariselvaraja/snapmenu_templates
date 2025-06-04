import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../redux';
import { MenuItem } from '../../../redux/slices/menuSlice';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartWithToast } from '../hooks/useCartWithToast';
import { useCart, CartItem, generateSkuId, createCartItem, normalizeModifiers } from '../context/CartContext';
import { 
    LoadingState, 
    ErrorState, 
    RecommendedProducts, 
    ProductHeader, 
    ProductDetailsSection, 
    ModifierOption,
    SelectedModifier
} from './ProductDetail/index';
import { usePayment } from '@/hooks';

export default function ProductDetail() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { addItemWithToast } = useCartWithToast();
    
    // Get menu data from Redux store
    const { items, loading, error } = useAppSelector(state => state.menu);
    
    // Find the product in the menu data
    const product = items.find((item:any) => item.pk_id === productId);
    const { rawApiResponse } = useAppSelector(state => state.siteContent);
      // Get site content from Redux state
      const siteContent = rawApiResponse ? 
      (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
      {};
    const siteConfiguration = siteContent?.siteConfiguration;
    const showPrice = siteConfiguration?.hidePriceInWebsite? false:  siteConfiguration?.hidePriceInProductDetails?false:true;
    
    console.log("product", product)
    
    // Get cart items from cart context
    const { state: { items: cartItems }, toggleDrawer } = useCart();
    
    // State for selected modifiers and spice level
    const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
    
    // State for spice level (0 = none, 1 = mild, 2 = medium, 3 = hot)
    const [spiceLevel, setSpiceLevel] = useState<number>(0);

    const {isPaymentAvilable} = usePayment();
    
    // Scroll to top when component mounts or productId changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productId]);

    // Reset modifiers and spice level when product changes
    useEffect(() => {
        if (product) {
            // Reset to default state when product changes
            setSelectedModifiers([]);
            setSpiceLevel(0);
            setValidationErrors({});
        }
    }, [product?.pk_id]); // Reset when product ID changes

    // Initialize selectedModifiers and spiceLevel - removed cart item dependency
    // The ProductHeader component will handle cart item logic independently
    
    // Helper function to check if spice level should be validated
    const shouldValidateSpiceLevel = () => {
        // Check if product has is_spice_applicable field and it's "yes"
        if (product?.is_spice_applicable?.toLowerCase() === 'yes') {
            return true;
        }
        // Also check in raw_api_data if it exists
        if (product?.raw_api_data) {
            try {
                const rawData = typeof product.raw_api_data === 'string' 
                    ? JSON.parse(product.raw_api_data) 
                    : product.raw_api_data;
                if (rawData?.is_spice_applicable?.toLowerCase() === 'yes') {
                    return true;
                }
            } catch (e) {
                // If parsing fails, continue with other checks
            }
        }
        return false;
    };
    
    // Handle add to cart
    const handleAddToCart = () => {
        // Validate required modifiers
        const newValidationErrors: {[key: string]: boolean} = {};
        let hasErrors = false;
        
        // Check if spice level is required based on is_spice_applicable
        if (shouldValidateSpiceLevel()) {
            if (spiceLevel === 0) {
                newValidationErrors["Spice Level"] = true;
                hasErrors = true;
            }
        }
        
        // Check required modifiers
        modifiersList.forEach(modifier => {
            if (modifier.is_forced?.toLowerCase() === 'yes') {
                const modifierSelected = selectedModifiers.some(
                    selected => selected.name === modifier.name && selected.options.length > 0
                );
                if (!modifierSelected) {
                    newValidationErrors[modifier.name] = true;
                    hasErrors = true;
                }
            }
        });
        
        // Update validation errors state
        setValidationErrors(newValidationErrors);
        
        // If there are validation errors, don't proceed
        if (hasErrors) {
            return;
        }
        
        // Make sure product exists
        if (product) {
            // Prepare modifiers including spice level
            let allModifiers = [...selectedModifiers];
            
            // Add spice level as a modifier if it's set and spice is applicable
            if (spiceLevel > 0 && shouldValidateSpiceLevel()) {
                const spiceLevelNames = ['Mild', 'Medium', 'Hot'];
                const spiceLevelModifier = {
                    name: 'Spice Level',
                    options: [{
                        name: spiceLevelNames[spiceLevel - 1],
                        price: 0
                    }]
                };
                
                // Check if spice level modifier already exists
                const existingSpiceLevelIndex = allModifiers.findIndex(mod => mod.name === 'Spice Level');
                if (existingSpiceLevelIndex >= 0) {
                    allModifiers[existingSpiceLevelIndex] = spiceLevelModifier;
                } else {
                    allModifiers.push(spiceLevelModifier);
                }
            }

            // Use standardized cart item creation
            const cartItem = createCartItem(product, allModifiers, 1);
            
            // Add item to cart with toast notification
            addItemWithToast(cartItem);
            
            // Open cart drawer
            toggleDrawer(true);
        }
    };
    
    // Custom setSpiceLevel function that also clears validation errors
    const handleSpiceLevelChange = (level: number) => {
        setSpiceLevel(level);
        
        // Clear spice level validation error if it exists
        if (validationErrors["Spice Level"]) {
            setValidationErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors["Spice Level"];
                return newErrors;
            });
        }
    };
    
    // Calculate total price including modifiers
    const calculateTotalPrice = () => {
        // Ensure basePrice is a number
        let basePrice = typeof product?.price === 'number' ? product.price : 0;
        let modifiersPrice = 0;
        
        // Add up all selected modifier prices
        selectedModifiers.forEach(modifier => {
            modifier.options.forEach((option: {price: string | number}) => {
                // Convert string prices to numbers, handle NaN cases
                let optionPrice = 0;
                if (typeof option.price === 'string') {
                    optionPrice = parseFloat(option.price.replace(/[^\d.-]/g, '')) || 0;
                } else if (typeof option.price === 'number' && !isNaN(option.price)) {
                    optionPrice = option.price;
                }
                modifiersPrice += optionPrice;
            });
        });
        
        const total = basePrice + modifiersPrice;
        // Ensure we return a valid number
        return isNaN(total) ? 0 : total;
    };
    
    // Parse modifiers from product data
    const [modifiersList, setModifiersList] = useState<any[]>([]);
    
    useEffect(() => {
        console.log("product", product);
        
        // Directly use modifiers_list from the product if available
        if (product) {
            setModifiersList(product.modifiers_list || []);
        }
    }, [product]);
    

    // Handle modifier option selection with improved logic from ModifierModal
    const handleModifierOptionSelect = (modifierName: string, option: ModifierOption): void => {
        // Find if this modifier already exists in our selections
        setSelectedModifiers(prev => {
            const modifierIndex = prev.findIndex(mod => mod.name === modifierName);
            
            // Check if the modifier is required and multi-select
            let isRequired = false;
            let isMultiSelect = false;
            
            const modifier = modifiersList.find(mod => mod.name === modifierName);
            if (modifier) {
                isRequired = modifier.is_forced?.toLowerCase() === 'yes';
                isMultiSelect = modifier.is_multi_select?.toLowerCase() === 'yes';
            }
            
            // If modifier exists in our selections
            if (modifierIndex >= 0) {
                const newModifiers = [...prev];
                const currentOptions = newModifiers[modifierIndex].options;
                
                // For required modifiers, we don't allow deselection, only switching between options
                if (isRequired) {
                    // If multi-select is enabled, we can add multiple options
                    if (isMultiSelect) {
                        const optionIndex = currentOptions.findIndex(opt => opt.name === option.name);
                        
                        if (optionIndex >= 0) {
                            // For required multi-select, don't allow removing the last option
                            if (currentOptions.length > 1) {
                                newModifiers[modifierIndex] = {
                                    ...newModifiers[modifierIndex],
                                    options: currentOptions.filter(opt => opt.name !== option.name)
                                };
                            }
                        } else {
                            // Add the option
                            newModifiers[modifierIndex] = {
                                ...newModifiers[modifierIndex],
                                options: [...currentOptions, option]
                            };
                        }
                    } else {
                        // For single-select required modifiers, just replace the current option
                        newModifiers[modifierIndex] = {
                            ...newModifiers[modifierIndex],
                            options: [option]
                        };
                    }
                } 
                // For optional modifiers, toggle the option
                else {
                    const optionIndex = currentOptions.findIndex(opt => opt.name === option.name);
                    
                    if (optionIndex >= 0) {
                        // Remove the option if it's already selected
                        newModifiers[modifierIndex] = {
                            ...newModifiers[modifierIndex],
                            options: currentOptions.filter(opt => opt.name !== option.name)
                        };
                        
                        // If no options left, remove the entire modifier
                        if (newModifiers[modifierIndex].options.length === 0) {
                            newModifiers.splice(modifierIndex, 1);
                        }
                    } else {
                        // Add the option
                        if (isMultiSelect) {
                            // For multi-select, add to existing options
                            newModifiers[modifierIndex] = {
                                ...newModifiers[modifierIndex],
                                options: [...currentOptions, option]
                            };
                        } else {
                            // For single-select, replace existing option
                            newModifiers[modifierIndex] = {
                                ...newModifiers[modifierIndex],
                                options: [option]
                            };
                        }
                    }
                }
                
                // Clear validation error for this modifier if it exists
                if (validationErrors[modifierName]) {
                    setValidationErrors(prevErrors => {
                        const newErrors = { ...prevErrors };
                        delete newErrors[modifierName];
                        return newErrors;
                    });
                }
                
                return newModifiers;
            } 
            // If this modifier doesn't exist in our selections yet
            else {
                // Clear validation error for this modifier if it exists
                if (validationErrors[modifierName]) {
                    setValidationErrors(prevErrors => {
                        const newErrors = { ...prevErrors };
                        delete newErrors[modifierName];
                        return newErrors;
                    });
                }
                
                return [...prev, { name: modifierName, options: [option] }];
            }
        });
    };
    
    // Check if a modifier option is selected
    const isModifierOptionSelected = (modifierName: string, optionName: string) => {
        const modifier = selectedModifiers.find(mod => mod.name === modifierName);
        if (!modifier) return false;
        
        return modifier.options.some((opt: {name: string}) => opt.name === optionName);
    };
    
    // State for validation errors
    const [validationErrors, setValidationErrors] = useState<{
        [key: string]: boolean;
    }>({});

    // Handle loading state
    if (loading) {
        return <LoadingState />;
    }
    
    // Handle error state
    if (error) {
        return <ErrorState error={error} />;
    }
    
    // Show maintenance message if menu data is empty but no error
    if (!loading && !error && items.length === 0) {
        return <ErrorState error={null} isMaintenanceMode={true} />;
    }
    
    // Handle product not found
    if (!product) {
        return <ErrorState error={null} isProductNotFound={true} />;
    }

    return (
        <div className="py-4 sm:py-6 lg:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button 
                    onClick={() => navigate('/menu')}
                    className="inline-flex items-center mb-4 sm:mb-6 lg:mb-8 bg-gray-100 text-gray-800 px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:bg-gray-200 transition-colors text-sm sm:text-base"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Menu
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {/* You May Also Like section on LHS for desktop */}
                    <div className="hidden lg:block">
                        <RecommendedProducts 
                            currentProductId={productId || ''} 
                            allItems={items} 
                            product={product} 
                            showPrice={showPrice}
                        />
                    </div>

                    {/* Product Details on RHS */}
                    <div className="lg:col-span-3">
                        {/* Product Header with Image on Right */}
                        <ProductHeader 
                            product={product}
                            calculateTotalPrice={calculateTotalPrice}
                            selectedModifiers={selectedModifiers}
                            spiceLevel={spiceLevel}
                            setSpiceLevel={handleSpiceLevelChange}
                            modifiersList={modifiersList}
                            handleModifierOptionSelect={handleModifierOptionSelect}
                            isModifierOptionSelected={isModifierOptionSelected}
                            handleAddToCart={handleAddToCart}
                            isPaymentAvilable = {isPaymentAvilable}
                            validationErrors={validationErrors}
                            showRecommendedProducts={true}
                            currentProductId={productId || ''}
                            allItems={items}
                            showPrice={showPrice}
                        />


                        {/* Removed global validation message */}

                        {/* Product Details section */}
                        <ProductDetailsSection product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
