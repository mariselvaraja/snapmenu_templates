import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, fetchMenuRequest, MenuItem } from '../../../common/redux';
import { fetchComboRequest } from '../../../redux/slices/comboSlice';
import { useCart, CartItem, generateSkuId, createCartItem, normalizeModifiers } from '../context/CartContext';
import { useCartWithToast } from '../hooks/useCartWithToast';
import { usePartyOrders } from '../hooks/usePartyOrders';
import ModifierModal from '../components/ModifierModal';
import { PartyOrdersSection } from '../components';
import _ from 'lodash';
import { LuVegan } from 'react-icons/lu';
import { IoLeafOutline } from 'react-icons/io5';
import { CiWheat } from 'react-icons/ci';
import { GoDotFill } from 'react-icons/go';
import { usePayment } from '@/hooks';

// Define types for category and subcategory
interface CategoryType {
    id: string;
    name: string;
    type: string;
}

interface SubCategoryType {
    id: string;
    name: string;
}

export default function Menu() {
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedLevel2, setSelectedLevel2] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy] = useState<string>('featured');
    const [isModifierModalOpen, setIsModifierModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { addItemWithToast } = useCartWithToast();


    const { rawApiResponse } = useAppSelector(state => state.siteContent);
    // Get site content from Redux state
    const siteContent = rawApiResponse ? 
      (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
      {};
    const homepage = siteContent.homepage;
    const siteConfiguration = siteContent?.siteConfiguration;
    const showPrice = siteConfiguration?.hidePriceInWebsite? false:  siteConfiguration?.hidePriceInMenu?false:true;
    
    // Get menu data and cart items from Redux store
    const { items, loading, error } = useAppSelector(state => state.menu);
    const { data: comboData, loading: comboLoading, error: comboError } = useAppSelector(state => state.combo);
    const { state: { items: cartItems }, removeItem, updateItemQuantity } = useCart();
    const {isPaymentAvilable} = usePayment();
    
    // Party orders hook for API call
    const { partyOrders, loading: partyOrdersLoading, error: partyOrdersError, fetchPartyOrders } = usePartyOrders();
    
    // Get party orders from menu items (assuming they're part of the menu data)
    // Extract party orders from menu items or site content
    const partyOrdersFromMenu = items?.filter(item => item?.category === 'party_orders' || item?.level1_category === 'party_orders') || [];
    
    // Scroll to top and fetch data when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
        // Fetch combo data on mount
        dispatch(fetchComboRequest());
        // Fetch party orders data on mount
        fetchPartyOrders();
    }, [dispatch, fetchPartyOrders]);
    
    // Extract subcategories from 'mains' category
    const subCategories: SubCategoryType[] = items
        .filter(item => item.category === 'mains' && item.tags && item.tags.length > 0)
        .flatMap(item => item.tags || [])
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .map(tag => ({
            id: tag,
            name: tag.charAt(0).toUpperCase() + tag.slice(1)
        }));
    

    const handleAddToCart = (menuItem: MenuItem) => {
        // Helper function to check if spice level should be shown based on is_spice_applicable
        const shouldShowSpiceLevel = () => {
            // Check if product has is_spice_applicable field and it's "yes"
            if (menuItem?.is_spice_applicable?.toLowerCase() === 'yes') {
                return true;
            }
            // Also check in raw_api_data if it exists
            if (menuItem?.raw_api_data) {
                try {
                    const rawData = typeof menuItem.raw_api_data === 'string' 
                        ? JSON.parse(menuItem.raw_api_data) 
                        : menuItem.raw_api_data;
                    if (rawData?.is_spice_applicable?.toLowerCase() === 'yes') {
                        return true;
                    }
                } catch (e) {
                    // If parsing fails, continue with other checks
                }
            }
            return false;
        };

        // Helper function to check if modifiers are available
        const hasModifiers = () => {
            return menuItem?.modifiers_list && menuItem.modifiers_list.length > 0;
        };

        // Check if spice level is available OR modifiers are available
        const needsModifierModal = shouldShowSpiceLevel() || hasModifiers();

        if (needsModifierModal) {
            // Open the modifier modal and set the selected menu item
            setSelectedMenuItem(menuItem);
            setIsModifierModalOpen(true);
        } else {
            // Directly add to cart without opening modifier modal using standardized function
            const cartItem = createCartItem(menuItem, [], 1);
            addItemWithToast(cartItem);
        }
    };

    // Handle loading and error states
    if (loading) {
        return (
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
                        <p className="text-xl text-gray-600">
                            Explore our selection of dishes
                        </p>
                    </div>

                    {/* Skeleton for category buttons */}
                    <div className="flex flex-col space-y-4 mb-12">
                        <div className="flex flex-wrap gap-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-10 w-24 bg-red-100 rounded-full animate-pulse"></div>
                            ))}
                        </div>
                        
                        {/* Skeleton for sort dropdown */}
                        <div className="flex justify-end">
                            <div className="h-10 w-40 bg-red-100 rounded-lg animate-pulse"></div>
                        </div>
                    </div>

                    {/* Skeleton for menu items grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg">
                                {/* Skeleton for image */}
                                <div className="w-full h-64 bg-red-100 animate-pulse"></div>
                                <div className="p-6">
                                    {/* Skeleton for title and price */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="h-6 w-32 bg-red-100 rounded animate-pulse"></div>
                                        <div className="h-6 w-16 bg-red-100 rounded animate-pulse"></div>
                                    </div>
                                    {/* Skeleton for description */}
                                    <div className="h-4 w-full bg-red-100 rounded mb-2 animate-pulse"></div>
                                    <div className="h-4 w-3/4 bg-red-100 rounded mb-4 animate-pulse"></div>
                                    {/* Skeleton for button */}
                                    <div className="flex items-center justify-end">
                                        <div className="h-10 w-32 bg-red-100 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Error Loading Menu</h1>
                    <p className="text-xl text-red-500">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }
    
    // Show maintenance message if menu data is empty but no error
    if (!loading && !error && items.length === 0) {
        return (
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-yellow-500 text-5xl mb-4">🛠️</div>
                    <h1 className="text-3xl font-bold mb-4">Menu Maintenance</h1>
                    <p className="text-xl text-gray-600 mb-6">
                        We're currently updating our menu. Please check back soon!
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    // Handle combo filtering and data preparation
    const getDisplayItems = () => {
        if (selectedType === 'combos') {
            // Return combo data formatted as menu items
            if (comboData && comboData.length > 0) {
                return comboData
                    .filter(combo => combo.is_enabled)
                    .map((combo, index) => ({
                        id: parseInt(combo.combo_id) || index + 10000, // Convert to number or use index with offset
                        pk_id: combo.combo_id,
                        name: combo.title,
                        description: combo.description,
                        price: parseFloat(combo.combo_price.replace(/[^\d.-]/g, '')) || 0,
                        image: combo.combo_image,
                        category: 'combo',
                        level1_category: 'combo',
                        level2_category: '',
                        tags: [],
                        dietary: {
                            isVegetarian: false,
                            isVegan: false,
                            isGlutenFree: false
                        },
                        modifiers_list: [],
                        is_spice_applicable: 'no',
                        available: true
                    }));
            }
            return [];
        } else if (selectedType === 'party orders') {
            // Party orders are handled by PartyOrdersSection component
            return [];
        } else {
            // Return regular menu items with filtering
            return items.filter(item => {
                // Filter by level1 category
                if (selectedType !== 'all' && item.level1_category !== selectedType) return false;
                
                // Filter by level2 category
                if (selectedLevel2 !== 'all' && item.level2_category !== selectedLevel2) return false;
                
                // Keep the original category filtering for backward compatibility
                if (selectedType !== 'all' && item.category !== selectedType) return false;
                if (selectedType === 'mains' && selectedCategory !== 'all' && 
                    (!item.tags || !item.tags.includes(selectedCategory))) return false;
                    
                return true;
            });
        }
    };

    const displayItems = getDisplayItems();
    const sortedItems = [...displayItems].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
    });

    // Function to scroll categories horizontally
    const scrollCategories = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        }
    };

    const extractLevel1 = (items: any[]) => {
       // Filter out items where level1_category is null, undefined, or empty string
       const validItems = items.filter((item: any) => 
           item.level1_category != null && 
           item.level1_category !== undefined && 
           item.level1_category !== ''
       );
       
       // Extract level1_category values
       let level1 = validItems.map((item: any) => item.level1_category);
       
       // Get unique values
       level1 = _.uniqBy(level1, (item: any) => item);
       
       // Add combo category if combo data exists and has enabled combos
       if (comboData && comboData.length > 0 && comboData.some(combo => combo.is_enabled)) {
           level1.push('combos');
       }
       
       // Add party orders category if there are party orders from API or menu
       const hasPartyOrdersFromAPI = partyOrders && partyOrders.length > 0 && partyOrders.some((party: any) => party?.is_enabled);
       const hasPartyOrdersFromMenu = partyOrdersFromMenu && partyOrdersFromMenu.length > 0 && partyOrdersFromMenu.some((party: any) => party?.is_enabled);
       
       if (hasPartyOrdersFromAPI || hasPartyOrdersFromMenu) {
           level1.push('party orders');
       }
       
       // Return only the categories without "all" option
       return level1;
    }

    const extractLevel2 = (items: any[], selectedLevel1: string) => {
        // If "all" is selected, show all level2 categories
        if (selectedLevel1 === 'all') {
            // Filter out items where level2_category is null, undefined, or empty string
            const validItems = items.filter((item: any) => 
                item.level2_category != null && 
                item.level2_category !== undefined && 
                item.level2_category !== ''
            );
            
            // Extract level2_category values
            let level2 = validItems.map((item: any) => item.level2_category);
            
            // Get unique values
            level2 = _.uniqBy(level2, (item: any) => item);
            
            // Return only the subcategories without "all" option
            return level2;
        } else {
            // Filter items by the selected level1_category
            const filteredByLevel1 = items.filter((item: any) => 
                item.level1_category === selectedLevel1 &&
                item.level2_category != null && 
                item.level2_category !== undefined && 
                item.level2_category !== ''
            );
            
            // Extract level2_category values from the filtered items
            let level2 = filteredByLevel1.map((item: any) => item.level2_category);
            
            // Get unique values
            level2 = _.uniqBy(level2, (item: any) => item);
            
            // Return only the subcategories without "all" option
            return level2;
        }
     }

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Modifier Modal */}
                <ModifierModal 
                    isOpen={isModifierModalOpen}
                    onClose={(updatedItem) => {
                        // If an updated item was returned, it means the user added it to cart
                        if (updatedItem) {
                            // Item was already added to cart in the modal, just close
                            setIsModifierModalOpen(false);
                            setSelectedMenuItem(null);
                        } else {
                            // User cancelled, just close
                            setIsModifierModalOpen(false);
                            setSelectedMenuItem(null);
                        }
                    }}
                    menuItem={selectedMenuItem}
                />

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
                    <p className="text-xl text-gray-600">
                        Explore our selection of dishes
                    </p>
                </div>

                <div className="flex flex-col space-y-4 mb-12">
                    {/* Categories in a single row with horizontal overflow on mobile */}
                    <div className="flex items-center gap-2">
                        <div 
                            ref={scrollContainerRef}
                            className="flex md:flex-wrap overflow-x-auto no-scrollbar gap-4 uppercase pb-2 flex-1"
                        >
                            {extractLevel1(items).map((category: any) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        // If this category is already selected, deselect it (set to 'all')
                                        // Otherwise, select this category
                                        setSelectedType(selectedType === category ? 'all' : category);
                                        setSelectedLevel2('all'); // Reset level2 selection when level1 changes
                                        setSelectedCategory('all');
                                    }}
                                    className={`px-6 py-2 rounded-full transition-colors capitalize whitespace-nowrap flex-shrink-0 ${selectedType === category ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        {/* Clickable red scroll arrow - only show on mobile */}
                        <button
                            onClick={scrollCategories}
                            className="md:hidden transition-colors flex items-center font-bold mb-2"
                            aria-label="Scroll categories"
                        >
                            <ChevronRight className="w-4 h-4 text-red-500 animate-pulse duration-100" />
                            <ChevronRight className="w-4 h-4 text-red-500 animate-pulse duration-200" />
                            <ChevronRight className="w-4 h-4 text-red-500 animate-pulse duration-300" />
                        </button>
                    </div>
                    {/* Only show subcategories if a category is selected and not on mobile */}
                    {selectedType !== 'all' && (
                        <div className="hidden md:flex flex-row flex-wrap gap-2 overflow-x-auto">
                            {extractLevel2(items, selectedType).map((category: any) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        // If this category is already selected, deselect it (set to 'all')
                                        // Otherwise, select this category
                                        setSelectedLevel2(selectedLevel2 === category ? 'all' : category);
                                        setSelectedCategory('all');
                                    }}
                                    className={`px-3 py-1 text-xs rounded-full transition-colors capitalize ${selectedLevel2 === category ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {selectedType === 'party orders' ? (
                    // Use the PartyOrdersSection component with party orders data from Redux
                    <PartyOrdersSection 
                        showTitle={false} 
                        partyOrders={partyOrders}
                        loading={partyOrdersLoading}
                        error={partyOrdersError}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg overflow-hidden shadow-lg"
                        >
                            <div className="relative cursor-pointer" onClick={() => {
                                if (item.category === 'combo') {
                                    navigate(`/combo/${item.pk_id}`);
                                } else {
                                    navigate(`/product/${item.id.toString()}`);
                                }
                            }}>
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-64 object-cover object-top"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-red-100 flex items-center justify-center">
                                        <span className="text-6xl font-bold text-red-500 line-clamp-3">
                                            {item.name && item.name.length > 0 
                                              ? item.name.charAt(0).toUpperCase() 
                                              : 'P'}
                                        </span>
                                    </div>
                                )}
                                {/* Dietary Information icons overlay */}
                                <div className="absolute top-2 right-2 z-10 flex flex-wrap gap-1 justify-end">
                                    {item.dietary && item.dietary.isVegan && (
                                        <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                            <LuVegan className="w-5 h-5" />
                                        </div>
                                    )}
                                    {item.dietary && item.dietary.isVegetarian && (
                                        <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                            <IoLeafOutline className="w-5 h-5" />
                                        </div>
                                    )}
                                    {item.dietary && item.dietary.isGlutenFree && (
                                        <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                            <CiWheat className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {/* Food Type Icons - Veg/Non-Veg */}
                                        {item.dietary && (item.dietary.isVegetarian || item.dietary.isVegan) ? (
                                            <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-green-600 flex-shrink-0">
                                                <GoDotFill className="w-2 h-2 text-green-600" />
                                            </div>
                                        ) : (
                                            <div className="bg-white w-4 h-4 rounded-sm flex items-center justify-center border border-red-600 flex-shrink-0">
                                                <GoDotFill className="w-2 h-2 text-red-600" />
                                            </div>
                                        )}
                                        <h3 
                                            className="text-xl font-semibold cursor-pointer hover:text-red-500 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (item.category === 'combo') {
                                                    navigate(`/combo/${item.pk_id}`);
                                                } else {
                                                    navigate(`/product/${item.id.toString()}`);
                                                }
                                            }}
                                        >
                                            {item.name}
                                        </h3>
                                    </div>
                                  { showPrice &&  <span className="text-lg font-bold text-red-500">${item.price}</span>}
                                </div>
                                <p 
                                    className="text-gray-600 mb-4 line-clamp-2 cursor-pointer hover:text-gray-800 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (item.category === 'combo') {
                                            navigate(`/combo/${item.pk_id}`);
                                        } else {
                                            navigate(`/product/${item.id.toString()}`);
                                        }
                                    }}
                                >
                                    {item.description}
                                </p>
                             { showPrice &&  isPaymentAvilable && <div className="flex items-center justify-between">
                                    
                                    {/* Add button or quantity controls */}
                                    {(() => {
                                        const expectedSkuId = generateSkuId(typeof item.pk_id === 'string' ? parseInt(item.pk_id) : (item.pk_id || 0), []);
                                        const cartItem = cartItems.find((cartItem:any) => cartItem.sku_id === expectedSkuId);
                                        return !cartItem || cartItem.quantity === 0;
                                    })() ? (
                                        <button
                                            className="inline-flex items-center bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition-colors text-base font-medium"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            Add to Cart
                                        </button>
                                    ) : (
                                        <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
                                            <button
                                                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const expectedSkuId = generateSkuId(typeof item.pk_id === 'string' ? parseInt(item.pk_id) : (item.pk_id || 0), []);
                                                    const cartItem = cartItems.find((cartItem:any) => cartItem.sku_id === expectedSkuId);
                                                    if (cartItem) {
                                                        const newQuantity = cartItem.quantity - 1;
                                                        if (newQuantity > 0) {
                                                            updateItemQuantity(cartItem.sku_id, newQuantity);
                                                        } else {
                                                            removeItem(cartItem.sku_id);
                                                        }
                                                    }
                                                }}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="mx-3 text-base font-semibold">
                                                {cartItems.find((cartItem:any) => cartItem.sku_id === generateSkuId(typeof item.pk_id === 'string' ? parseInt(item.pk_id) : (item.pk_id || 0), []))?.quantity || 0}
                                            </span>
                                            <button
                                                className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const expectedSkuId = generateSkuId(typeof item.pk_id === 'string' ? parseInt(item.pk_id) : (item.pk_id || 0), []);
                                                    const cartItem = cartItems.find((cartItem:any) => cartItem.sku_id === expectedSkuId);
                                                    if (cartItem) {
                                                        updateItemQuantity(cartItem.sku_id, cartItem.quantity + 1);
                                                    } else {
                                                        // Use standardized cart item creation
                                                        const newCartItem = createCartItem(item, [], 1);
                                                        addItemWithToast(newCartItem);
                                                    }
                                                }}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>}
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
