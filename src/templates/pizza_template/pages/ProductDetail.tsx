import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch, addItem, CartItem, toggleDrawer } from '../../../redux';
import { MenuItem } from '../../../redux/slices/menuSlice';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LoadingState, 
    ErrorState, 
    RecommendedProducts, 
    ProductHeader, 
    ProductDetailsSection, 
    NutritionalInfo, 
    IngredientsSection, 
    AllergensSection,
    ModifierOption,
    Modifier,
    SelectedModifier
} from './ProductDetail/index';

export default function ProductDetail() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // Get menu data from Redux store
    const { items, loading, error } = useAppSelector(state => state.menu);
    
    // Find the product in the menu data
    const product = items.find((item:any) => item.pk_id === productId);
    // State for success notification
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    
    console.log("product", product)
    
    // Get cart items from Redux store
    const { items: cartItems } = useAppSelector(state => state.cart);
    
    // Check if this product is in the cart
    const cartItem = cartItems.find((item:any) => item.id === product?.id);
    
    // State for selected modifiers and spice level
    const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
    
    // State for spice level (1 = mild, 2 = medium, 3 = hot)
    const [spiceLevel, setSpiceLevel] = useState<number>(2);
    
    // Initialize selectedModifiers and spiceLevel from cart item if it exists
    useEffect(() => {
        if (cartItem && cartItem.selectedModifiers) {
            // Convert cart item modifiers to the format expected by the component
            const convertedModifiers = cartItem.selectedModifiers.map((modifier:any) => ({
                name: modifier.name,
                options: modifier.options.map((option:any) => ({
                    name: option.name,
                    price: option.price
                }))
            }));
            
            setSelectedModifiers(convertedModifiers);
            
            // Set spice level if it exists in the cart item
            const spiceLevelModifier = cartItem.selectedModifiers.find((mod:any) => mod.name === 'Spice Level');
            if (spiceLevelModifier && spiceLevelModifier.options.length > 0) {
                const spiceLevelName = spiceLevelModifier.options[0].name;
                if (spiceLevelName === 'Mild') setSpiceLevel(1);
                else if (spiceLevelName === 'Medium') setSpiceLevel(2);
                else if (spiceLevelName === 'Hot') setSpiceLevel(3);
            }
        }
    }, [cartItem]);
    
    // Handle add to cart
    const handleAddToCart = () => {
        // Validate required modifiers
        const newValidationErrors: {[key: string]: boolean} = {};
        let hasErrors = false;
        
        // Check if spice level is required
        if (modifiersList.some(mod => mod.name === 'Spice Level' && mod.is_forced?.toLowerCase() === 'yes')) {
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
            // Create cart item with selected modifiers
            // Convert any string prices to numbers for the cart and ensure they are valid numbers
            const normalizedModifiers = selectedModifiers.map(modifier => ({
                name: modifier.name,
                options: modifier.options.map(option => {
                    let price = 0;
                    if (typeof option.price === 'string') {
                        price = parseFloat(option.price.replace(/[^\d.-]/g, '')) || 0;
                    } else if (typeof option.price === 'number' && !isNaN(option.price)) {
                        price = option.price;
                    }
                    return {
                        name: option.name,
                        price: price
                    };
                })
            }));

            // Add spice level as a modifier if it's set
            if (spiceLevel > 0) {
                const spiceLevelNames = ['Mild', 'Medium', 'Hot'];
                const spiceLevelModifier = {
                    name: 'Spice Level',
                    options: [{
                        name: spiceLevelNames[spiceLevel - 1],
                        price: 0
                    }]
                };
                
                // Check if spice level modifier already exists
                const existingSpiceLevelIndex = normalizedModifiers.findIndex(mod => mod.name === 'Spice Level');
                if (existingSpiceLevelIndex >= 0) {
                    normalizedModifiers[existingSpiceLevelIndex] = spiceLevelModifier;
                } else {
                    normalizedModifiers.push(spiceLevelModifier);
                }
            }

            // Ensure product price is a valid number
            const productPrice = typeof product.price === 'number' && !isNaN(product.price) 
                ? product.price 
                : 0;

            const cartItem: CartItem = {
                id: product.id,
                name: product.name,
                price: productPrice,
                image: product.image || '',
                quantity: 1,
                selectedModifiers: normalizedModifiers
            };
            
            // Add item to cart
            dispatch(addItem(cartItem));
            
            // Show success notification
            setShowSuccessNotification(true);
            
            // Open cart drawer
            dispatch(toggleDrawer(true));
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                setShowSuccessNotification(false);
            }, 3000);
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
    const [modifiersList, setModifiersList] = useState<Modifier[]>([]);
    
    useEffect(() => {
        console.log("product", product);
        
        // Directly use modifiers_list from the product if available
        if (product?.modifiers_list && Array.isArray(product.modifiers_list)) {
            setModifiersList(product.modifiers_list);
        }
    }, [product]);
    

    // Handle modifier option selection
    const handleModifierOptionSelect = (modifierName: string, option: ModifierOption): void => {
        // Check if this modifier is multi-select
        const modifier = modifiersList.find(mod => mod.name === modifierName);
        const isMultiSelect = modifier?.is_multi_select?.toLowerCase() === 'yes';
        
        setSelectedModifiers(prev => {
            // Check if this modifier is already in the selected list
            const modifierIndex = prev.findIndex(mod => mod.name === modifierName);
            
            if (modifierIndex >= 0) {
                // Modifier exists, check if option is already selected
                const optionIndex = prev[modifierIndex].options.findIndex((opt: {name: string}) => opt.name === option.name);
                
                if (optionIndex >= 0) {
                    // Option is already selected, remove it (only for multi-select modifiers)
                    if (isMultiSelect) {
                        const newOptions = [...prev[modifierIndex].options];
                        newOptions.splice(optionIndex, 1);
                        
                        // If no options left, remove the whole modifier
                        if (newOptions.length === 0) {
                            const newModifiers = [...prev];
                            newModifiers.splice(modifierIndex, 1);
                            return newModifiers;
                        } else {
                            // Update options for this modifier
                            const newModifiers = [...prev];
                            newModifiers[modifierIndex] = {
                                ...newModifiers[modifierIndex],
                                options: newOptions
                            };
                            return newModifiers;
                        }
                    } else {
                        // For radio buttons, clicking an already selected option does nothing
                        return prev;
                    }
                } else {
                    // Option not selected, add it
                    const newModifiers = [...prev];
                    
                    // For radio buttons (non-multi-select), replace all options with the new one
                    if (!isMultiSelect) {
                        newModifiers[modifierIndex] = {
                            ...newModifiers[modifierIndex],
                            options: [{ name: option.name, price: option.price }]
                        };
                    } else {
                        // For checkboxes (multi-select), add the new option to existing ones
                        newModifiers[modifierIndex] = {
                            ...newModifiers[modifierIndex],
                            options: [...newModifiers[modifierIndex].options, { name: option.name, price: option.price } as any]
                        };
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
            } else {
                // Modifier doesn't exist, add it with this option
                // Clear validation error for this modifier if it exists
                if (validationErrors[modifierName]) {
                    setValidationErrors(prevErrors => {
                        const newErrors = { ...prevErrors };
                        delete newErrors[modifierName];
                        return newErrors;
                    });
                }
                
                return [...prev, {
                    name: modifierName,
                    options: [{ name: option.name, price: option.price }]
                }];
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
        <div className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button 
                    onClick={() => navigate('/menu')}
                    className="inline-flex items-center mb-8 bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Menu
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* You May Also Like section on LHS */}
                    <RecommendedProducts 
                        currentProductId={productId || ''} 
                        allItems={items} 
                        product={product} 
                    />

                    {/* Product Details on RHS */}
                    <div className="md:col-span-3">
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
                            validationErrors={validationErrors}
                        />
                        {/* Success Notification */}
                        <AnimatePresence>
                            {showSuccessNotification && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center z-50"
                                >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    <span>Item added to cart!</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Removed global validation message */}

                        {/* Product Details section */}
                        <ProductDetailsSection product={product} />

                        {/* Nutritional information section */}
                        <NutritionalInfo product={product} />

                        {/* Ingredients section */}
                        <IngredientsSection product={product} />

                        {/* Allergens section */}
                        <AllergensSection product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
