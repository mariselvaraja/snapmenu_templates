import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Info, Tag, Box, Utensils, AlertTriangle, Heart, Minus, Plus, Check, Flame } from 'lucide-react';
import { useAppDispatch, useAppSelector, addItem, CartItem, fetchMenuRequest, MenuItem } from '../../../common/redux';
import { useState, useEffect } from 'react';
import { TbCategory2 } from 'react-icons/tb';
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';
import { CiWheat } from 'react-icons/ci';

// Define interfaces for modifiers
interface ModifierOption {
    name: string;
    price: number | string;  // Allow both number and string types
    selectedByDefult?: string;
    attrSortIndex?: number;
    visibility?: string;
}

interface Modifier {
    name: string;
    options: ModifierOption[];
}

export default function ProductDetail() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // Get menu data from Redux store
    const { items, loading, error } = useAppSelector(state => state.menu);
    
    // Menu data is now fetched directly in App.jsx
    // useEffect(() => {
    //     // Only fetch if items are empty and not already loading
    //     if (items.length === 0 && !loading) {
    //         console.log('ProductDetail page: Fetching menu data');
    //         dispatch(fetchMenuRequest());
    //     }
    // }, [dispatch, items.length, loading]);
    
    // Find the product in the menu data
    const product = items.find(item => item.id.toString() === productId);

    // Get cart items from Redux store
    const { items: cartItems } = useAppSelector(state => state.cart);
    
    // Find if product is already in cart
    const cartItem = cartItems.find(item => item.id.toString() === productId);
    
    // Initialize quantity state with cart quantity if product is in cart, otherwise 1
    const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);
    
    // State for selected modifiers and spice level
    const [selectedModifiers, setSelectedModifiers] = useState<{
        name: string;
        options: {
            name: string;
            price: number | string;
        }[];
    }[]>([]);
    
    // State for spice level (1 = mild, 2 = medium, 3 = hot)
    const [spiceLevel, setSpiceLevel] = useState<number>(2);
    
    // Calculate total price including modifiers
    const calculateTotalPrice = () => {
        let basePrice = product?.price || 0;
        let modifiersPrice = 0;
        
        // Add up all selected modifier prices
        selectedModifiers.forEach(modifier => {
            modifier.options.forEach(option => {
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
    const handleModifierOptionSelect = (modifierName: string, option: ModifierOption) => {
        setSelectedModifiers(prev => {
            // Check if this modifier is already in the selected list
            const modifierIndex = prev.findIndex(mod => mod.name === modifierName);
            
            if (modifierIndex >= 0) {
                // Modifier exists, check if option is already selected
                const optionIndex = prev[modifierIndex].options.findIndex(opt => opt.name === option.name);
                
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
                        options: [...newModifiers[modifierIndex].options, { name: option.name, price: option.price }]
                    };
                    return newModifiers;
                }
            } else {
                // Modifier doesn't exist, add it with this option
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
        
        return modifier.options.some(opt => opt.name === optionName);
    };
    
    const handleAddToCart = (menuItem: MenuItem) => {
        // Convert any string prices to numbers for cart compatibility
        const normalizedModifiers = selectedModifiers.map(modifier => ({
            name: modifier.name,
            options: modifier.options.map(option => ({
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
        return (
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back button skeleton */}
                    <div className="h-10 w-32 bg-red-100 rounded-full animate-pulse mb-8"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* You May Also Like skeleton on LHS */}
                        <div className="md:col-span-1">
                            <div className="h-6 w-48 bg-red-100 rounded animate-pulse mb-4"></div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                        <div className="flex items-center p-2">
                                            <div className="w-16 h-16 bg-red-100 rounded-md mr-3 animate-pulse"></div>
                                            <div>
                                                <div className="h-4 w-20 bg-red-100 rounded animate-pulse mb-2"></div>
                                                <div className="h-3 w-12 bg-red-100 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Details skeleton on RHS */}
                        <div className="md:col-span-3">
                            {/* Product Header with Image on Right */}
                            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                                <div className="md:pr-8 md:w-1/2">
                                    <div className="h-8 w-48 bg-red-100 rounded animate-pulse mb-2"></div>
                                    <div className="h-6 w-24 bg-red-100 rounded animate-pulse mb-4"></div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <div className="h-6 w-20 bg-red-100 rounded-full animate-pulse"></div>
                                        <div className="h-6 w-16 bg-red-100 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="h-4 w-full bg-red-100 rounded animate-pulse mb-2"></div>
                                    <div className="h-4 w-full bg-red-100 rounded animate-pulse mb-2"></div>
                                    <div className="h-4 w-3/4 bg-red-100 rounded animate-pulse mb-6"></div>
                                    
                                    {/* Add to cart button skeleton */}
                                    <div className="w-full h-12 bg-red-100 rounded-full animate-pulse mb-6"></div>
                                </div>
                                <div className="md:w-1/2 mt-4 md:mt-0">
                                    <div className="w-full h-64 bg-red-100 rounded-lg animate-pulse"></div>
                                </div>
                            </div>

                            {/* Product Details section skeleton */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="h-6 w-6 bg-red-100 rounded-full animate-pulse mr-2"></div>
                                    <div className="h-6 w-32 bg-red-100 rounded animate-pulse"></div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="border-b border-gray-100 pb-3">
                                            <div className="flex items-center mb-1">
                                                <div className="h-4 w-4 bg-red-100 rounded-full animate-pulse mr-2"></div>
                                                <div className="h-4 w-24 bg-red-100 rounded animate-pulse"></div>
                                            </div>
                                            <div className="h-4 w-32 bg-red-100 rounded animate-pulse ml-6"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Nutritional information section skeleton */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="h-6 w-6 bg-red-100 rounded-full animate-pulse mr-2"></div>
                                    <div className="h-6 w-48 bg-red-100 rounded animate-pulse"></div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="border-b border-gray-100 pb-3">
                                            <div className="flex items-center mb-1">
                                                <div className="h-4 w-4 bg-red-100 rounded-full animate-pulse mr-2"></div>
                                                <div className="h-4 w-24 bg-red-100 rounded animate-pulse"></div>
                                            </div>
                                            <div className="h-4 w-16 bg-red-100 rounded animate-pulse ml-6"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ingredients section skeleton */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="h-6 w-6 bg-red-100 rounded-full animate-pulse mr-2"></div>
                                    <div className="h-6 w-32 bg-red-100 rounded animate-pulse"></div>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-8 w-20 bg-red-100 rounded-full animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Handle error state
    if (error) {
        return (
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Error Loading Product</h1>
                <p className="text-xl text-red-500">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Reload Page
                </button>
            </div>
        );
    }
    
    // Show maintenance message if menu data is empty but no error
    if (!loading && !error && items.length === 0) {
        return (
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="text-yellow-500 text-5xl mb-4">🛠️</div>
                <h1 className="text-3xl font-bold mb-4">Site Under Maintenance</h1>
                <p className="text-xl text-gray-600 mb-6">
                    We're currently updating our menu. Please check back soon!
                </p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Reload Page
                </button>
            </div>
        );
    }
    
    // Handle product not found
    if (!product) {
        return (
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                <button 
                    onClick={() => navigate('/menu')}
                    className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="py-20">
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
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-1"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Heart className="h-5 w-5 mr-2 text-red-500" />
                            You May Also Like
                        </h2>
                        <div className="space-y-4">
                            {(() => {
                                // Extract best combo SKU IDs from the product
                                let recommendedSkuIds: string[] = [];
                                
                                if (product.best_combo && typeof product.best_combo === 'string') {
                                    try {
                                        const bestCombo = JSON.parse(product.best_combo);
                                        if (bestCombo.best_combo_ids) {
                                            recommendedSkuIds = bestCombo.best_combo_ids
                                                .split(',')
                                                .map((id: string) => id.trim());
                                        }
                                    } catch (e) {
                                        // If parsing fails, use empty array
                                        recommendedSkuIds = [];
                                    }
                                }
                                
                                // Find items matching the recommended SKU IDs
                                let recommendedItems = items.filter(item => 
                                    item.sku_id && recommendedSkuIds.includes(item.sku_id)
                                );
                                
                                // If no recommended items found, show random items
                                if (recommendedItems.length === 0) {
                                    recommendedItems = items
                                        .filter(item => item.id.toString() !== productId)
                                        .slice(0, 5);
                                }
                                
                                return recommendedItems.map(item => (
                                    <div 
                                        key={item.id} 
                                        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => navigate(`/product/${item.id}`)}
                                    >
                                        <div className="flex items-center p-2">
                                            {item.image ? (
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-16 h-16 object-cover rounded-md mr-3"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-red-100 flex items-center justify-center rounded-md mr-3">
                                                    <span className="text-xl font-bold text-red-500">
                                                        {item.name && item.name.length > 0 
                                                          ? item.name.charAt(0).toUpperCase() 
                                                          : 'P'}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-medium text-sm">{item.name}</h3>
                                                <p className="text-red-500 text-xs">${item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </motion.div>

                    {/* Product Details on RHS */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-3"
                    >
                        {/* Product Header with Image on Right */}
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                            <div className="md:pr-8 md:w-1/2">
                                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                                <p className="text-gray-700 mb-3">{product.description}</p>
                                
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-2xl font-bold text-red-500">${calculateTotalPrice().toFixed(2)}</div>
                                        {selectedModifiers.length > 0 && (
                                            <div className="text-sm text-gray-500">
                                                Base: ${product.price} + Add-ons: ${(calculateTotalPrice() - product.price * quantity).toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Add button or quantity controls */}
                                    {!cartItem || cartItem.quantity <= 0 ? (
                                        <button
                                            className="inline-flex items-center bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition-colors text-base font-medium"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            Add to Cart
                                        </button>
                                    ) : (
                                        <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
                                            <button
                                                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors"
                                                onClick={handleDecrement}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="mx-3 text-base font-semibold">{quantity}</span>
                                            <button
                                                className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                                onClick={handleIncrement}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Chili Pepper Strength Scale */}
                                <div className="mb-3">
                                    <div className="flex items-center mb-2">
                                        <Flame className="h-4 w-4 mr-1 text-red-500" />
                                        <span className="text-sm font-medium text-gray-700">Spice Level:</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                        <div 
                                            onClick={() => setSpiceLevel(1)}
                                            className={`flex items-center justify-center px-2 py-1 rounded cursor-pointer ${
                                                spiceLevel === 1 
                                                 ? 'bg-red-200 border border-red-400 text-red-700' 
                                                : 'bg-gray-100 border border-gray-200 text-red-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <span>🌶️</span>
                                            
                                        </div>
                                        <div 
                                            onClick={() => setSpiceLevel(2)}
                                            className={`flex items-center justify-center px-2 py-1 rounded cursor-pointer ${
                                                spiceLevel === 2 
                                                ? 'bg-red-200 border border-red-400 text-red-700' 
                                                : 'bg-gray-100 border border-gray-200 text-red-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <span>🌶️🌶️</span>
                                            
                                        </div>
                                        <div 
                                            onClick={() => setSpiceLevel(3)}
                                            className={`flex items-center justify-center px-2 py-1 rounded cursor-pointer ${
                                                spiceLevel === 3 
                                                ? 'bg-red-200 border border-red-400 text-red-700' 
                                                : 'bg-gray-100 border border-gray-200 text-red-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <span>🌶️🌶️🌶️</span>
                                            
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Inline Add-ons section */}
                                {modifiersList.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <Box className="h-4 w-4 mr-1 text-red-500" />
                                            <span className="text-sm font-medium text-gray-700">Optional Add-ons:</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {modifiersList.flatMap((modifier, modIndex) => 
                                                modifier.options.map((option, optIndex) => {
                                                    // Handle empty option names by using the modifier name
                                                    const displayName = option.name ? option.name : modifier.name;
                                                    const price = parseFloat(String(option.price));
                                                    
                                                    return (
                                                        <div 
                                                            key={`${modIndex}-${optIndex}`}
                                                            onClick={() => handleModifierOptionSelect(modifier.name, option)}
                                                            className={`flex items-center px-3 py-1 rounded-full cursor-pointer transition-all ${
                                                                isModifierOptionSelected(modifier.name, option.name)
                                                                    ? 'bg-red-100 border border-red-300 text-red-800'
                                                                    : 'bg-gray-100 border border-gray-200 text-gray-800 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            <span className="text-sm">{displayName}</span>
                                                            {price > 0 && (
                                                                <span className="text-sm font-medium ml-1 text-red-600">
                                                                    +${price.toFixed(2)}
                                                                </span>
                                                            )}
                                                            {isModifierOptionSelected(modifier.name, option.name) && (
                                                                <Check className="w-3 h-3 ml-1 text-red-600" />
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="md:w-1/2 mt-4 md:mt-0">
                                <div className="relative rounded-lg overflow-hidden shadow-lg">
                                    {/* Dietary Information icons overlay */}
                                    {product.dietary && Object.values(product.dietary).some(value => value) && (
                                        <div className="absolute top-2 right-2 z-10 flex flex-wrap gap-1 justify-end">
                                            {product.dietary.isVegan && (
                                                <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                                    <LuVegan className="w-5 h-5" />
                                                </div>
                                            )}
                                            {product.dietary.isVegetarian && (
                                                <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                                    <IoLeafOutline className="w-5 h-5" />
                                                </div>
                                            )}
                                            {product.dietary.isGlutenFree && (
                                                <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                                    <CiWheat className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {product.image ? (
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="w-full h-64 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-64 bg-red-100 flex items-center justify-center">
                                            <span className="text-6xl font-bold text-red-500">
                                                {product.name && product.name.length > 0 
                                                  ? product.name.charAt(0).toUpperCase() 
                                                  : 'P'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Details section */}
                        { (
                            <div className="mb-8">
                                {/* <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <Info className="h-5 w-5 mr-2" />
                                    Product Details
                                </h2> */}
                                <div className="space-y-4">
                                {/* {(product.category || product.subCategory) && (
                                    <div className="border-b border-gray-100 pb-3">
                                        <div className="flex items-center mb-1">
                                            <Tag className="h-4 w-4 mr-2 text-gray-500" />
                                            <span className="font-medium text-gray-700">Category & Subcategory</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-gray-900 pl-6">
                                            <div>
                                                <span className="text-sm text-gray-500">Category:</span>
                                                <span className="ml-2 font-medium">{product.category || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Subcategory:</span>
                                                <span className="ml-2 font-medium">{product.subCategory || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )} */}
                                
                                {/* Dietary Information section */}
                                {product.dietary && Object.values(product.dietary).some(value => value) && (
                                    <div className="border-b border-gray-100 pb-3">
                                        <div className="flex items-center mb-1">
                                            <LuVegan className="h-4 w-4 mr-2 text-gray-500" />
                                            <span className="font-medium text-gray-700">Dietary Information</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pl-6">
                                            {product.dietary.isVegan && (
                                                <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                                    <LuVegan className="w-4 h-4 mr-1" />
                                                    <span className="text-sm font-medium">Vegan</span>
                                                </div>
                                            )}
                                            {product.dietary.isVegetarian && (
                                                <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                                    <IoLeafOutline className="w-4 h-4 mr-1" />
                                                    <span className="text-sm font-medium">Vegetarian</span>
                                                </div>
                                            )}
                                            {product.dietary.isGlutenFree && (
                                                <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                                    <CiWheat className="w-4 h-4 mr-1" />
                                                    <span className="text-sm font-medium">Gluten Free</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                   
                                {product.flavors && (
                                    <div className="border-b border-gray-100 pb-3">
                                        <div className="flex items-center mb-1">
                                            <Heart className="h-4 w-4 mr-2 text-gray-500" />
                                            <span className="font-medium text-gray-700">Flavors</span>
                                        </div>
                                        <div className="text-gray-900 pl-6">{product.flavors}</div>
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
                        )}

                        {/* Nutritional information section */}
                        {(product.calories || (product.nutrients && Object.keys(product.nutrients).length > 0)) && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">
                                    Nutritional Information
                                </h2>
                                <div className="flex flex-wrap gap-4 pl-2 border-b border-gray-100 pb-4">
                                    {product.calories && (
                                        <div className="flex flex-col items-center">
                                            <span className="font-medium text-gray-700">Calories</span>
                                            <span className="text-gray-900">{product.calories}</span>
                                        </div>
                                    )}
                                    {product.nutrients && Object.entries(product.nutrients).map(([key, value]) => (
                                        value && (
                                            <div key={key} className="flex flex-col items-center">
                                                <span className="font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                                <span className="text-gray-900">{value}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Ingredients section */}
                        {product.ingredients && product.ingredients.length > 0 && (
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
                        )}

                        {/* Allergens section */}
                        {product.allergens && product.allergens.length > 0 && (
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
                        )}
                        
                        {/* The modifiers section has been moved up under the price and Add to Cart button */}


                        {/* Pairings section */}
                        {product.pairings && product.pairings.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <Heart className="h-5 w-5 mr-2" />
                                    Perfect Pairings
                                </h2>
                                <ul className="space-y-3 pl-6">
                                    {product.pairings.map((pairing, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                            <span className="text-gray-700">{pairing}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
