import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector, addItem, CartItem, MenuItem } from '../../../common/redux';
import { useState, useEffect } from 'react';
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
    const product = items.find(item => item.id.toString() === productId);

    // Get cart items from Redux store
    const { items: cartItems } = useAppSelector(state => state.cart);
    
    // Find if product is already in cart
    const cartItem = cartItems.find(item => item.id.toString() === productId);
    
    // Initialize quantity state with cart quantity if product is in cart, otherwise 1
    const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);
    
    // State for selected modifiers and spice level
    const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
    
    // State for spice level (1 = mild, 2 = medium, 3 = hot)
    const [spiceLevel, setSpiceLevel] = useState<number>(2);
    
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
        let basePrice = product?.price || 0;
        let modifiersPrice = 0;
        
        // Add up all selected modifier prices
        selectedModifiers.forEach(modifier => {
            modifier.options.forEach((option: {price: string | number}) => {
                const optionPrice = typeof option.price === 'string' ? parseFloat(option.price) || 0 : option.price;
                modifiersPrice += optionPrice;
            });
        });
        
        return (basePrice + modifiersPrice) * quantity;
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
    
    // Update quantity if cart changes
    useEffect(() => {
        const updatedCartItem = cartItems.find(item => item.id.toString() === productId);
        if (updatedCartItem) {
            setQuantity(updatedCartItem.quantity);
            if (updatedCartItem.selectedModifiers) {
                setSelectedModifiers(updatedCartItem.selectedModifiers);
            }
        }
    }, [cartItems, productId]);

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Handle modifier option selection
    const handleModifierOptionSelect = (modifierName: string, option: ModifierOption): void => {
        setSelectedModifiers(prev => {
            // Check if this modifier is already in the selected list
            const modifierIndex = prev.findIndex(mod => mod.name === modifierName);
            
            if (modifierIndex >= 0) {
                // Modifier exists, check if option is already selected
                const optionIndex = prev[modifierIndex].options.findIndex((opt: {name: string}) => opt.name === option.name);
                
                if (optionIndex >= 0) {
                    // Option is already selected, remove it
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
                    // Option not selected, add it
                    const newModifiers = [...prev];
                    newModifiers[modifierIndex] = {
                        ...newModifiers[modifierIndex],
                        options: [...newModifiers[modifierIndex].options, { name: option.name, price: option.price } as any]
                    };
                    
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
    
    // State for showing validation error message
    const [showValidationMessage, setShowValidationMessage] = useState(false);

    const handleAddToCart = (menuItem: MenuItem) => {
        // Reset validation errors
        const newValidationErrors: {[key: string]: boolean} = {};
        let hasErrors = false;
        
        // Check if spice level is selected
        if (spiceLevel <= 0) {
            newValidationErrors["Spice Level"] = true;
            hasErrors = true;
        }
        
        // Check if all required modifiers are selected
        if (modifiersList && modifiersList.length > 0) {
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
        }
        
        // Update validation errors state
        setValidationErrors(newValidationErrors);
        
        if (hasErrors) {
            // Show validation message
            setShowValidationMessage(true);
            // Don't hide validation errors - they will stay visible until fixed
            return;
        }
        
        // Clear validation errors when there are no errors
        setValidationErrors({});
        setShowValidationMessage(false);
        
        // Convert any string prices to numbers for cart compatibility
        const normalizedModifiers = selectedModifiers.map(modifier => ({
            name: modifier.name,
            options: modifier.options.map((option: {name: string, price: string | number}) => ({
                name: option.name,
                price: typeof option.price === 'string' ? parseFloat(option.price) || 0 : option.price
            }))
        }));
        
        // Add spice level as a modifier
        const spiceLevelNames = ["Mild", "Medium", "Hot"];
        const spiceLevelModifier = {
            name: "Spice Level",
            options: [{ name: spiceLevelNames[spiceLevel - 1], price: 0 }]
        };
        
        const allModifiers = [...normalizedModifiers];
        if (spiceLevel > 0) {
            allModifiers.push(spiceLevelModifier);
        }
        
        const cartItem: CartItem = {
            id: menuItem.id, // ID is already a number
            name: menuItem.name,
            price: menuItem.price, // Price is already a number
            image: menuItem.image,
            quantity: quantity,
            selectedModifiers: allModifiers.length > 0 ? allModifiers : undefined
        };
        dispatch(addItem(cartItem));
    };

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
                            quantity={quantity}
                            handleIncrement={handleIncrement}
                            handleDecrement={handleDecrement}
                            handleAddToCart={handleAddToCart}
                            cartItem={cartItem}
                            calculateTotalPrice={calculateTotalPrice}
                            selectedModifiers={selectedModifiers}
                            spiceLevel={spiceLevel}
                            setSpiceLevel={handleSpiceLevelChange}
                            modifiersList={modifiersList}
                            handleModifierOptionSelect={handleModifierOptionSelect}
                            isModifierOptionSelected={isModifierOptionSelected}
                            validationErrors={validationErrors}
                        />

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
