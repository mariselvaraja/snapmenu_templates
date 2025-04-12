import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, addItem, CartItem, fetchMenuRequest, MenuItem } from '../shared/redux';

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
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('featured');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    // Get menu data from Redux store
    const { items, categories: menuCategories, loading, error } = useAppSelector(state => state.menu);
    
    // Create categories and subcategories from menu items
    const categories: CategoryType[] = [
        { id: 'all', name: 'All Items', type: 'all' },
        ...Array.from(new Set(items.map(item => item.category)))
            .map(category => ({
                id: category,
                name: category.charAt(0).toUpperCase() + category.slice(1),
                type: category
            }))
    ];
    
    // Extract subcategories from 'mains' category
    const subCategories: SubCategoryType[] = items
        .filter(item => item.category === 'mains' && item.tags && item.tags.length > 0)
        .flatMap(item => item.tags || [])
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .map(tag => ({
            id: tag,
            name: tag.charAt(0).toUpperCase() + tag.slice(1)
        }));
    
    // Fetch menu data when component mounts
    useEffect(() => {
        dispatch(fetchMenuRequest());
    }, [dispatch]);

    const handleAddToCart = (menuItem: MenuItem) => {
        const cartItem: CartItem = {
            id: menuItem.id, // ID is already a number
            name: menuItem.name,
            price: menuItem.price, // Price is already a number
            image: menuItem.image,
            quantity: 1, // Initial quantity is 1
        };
        console.log("handleAddToCart called with menuItem:", menuItem);
        dispatch(addItem(cartItem));
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
                        onClick={() => dispatch(fetchMenuRequest())}
                        className="mt-4 inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const filteredItems = items.filter(item => {
        if (selectedType !== 'all' && item.category !== selectedType) return false;
        if (selectedType === 'mains' && selectedCategory !== 'all' && 
            (!item.tags || !item.tags.includes(selectedCategory))) return false;
        return true;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
    });

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
                    <p className="text-xl text-gray-600">
                        Explore our selection of dishes
                    </p>
                </motion.div>

                <div className="flex flex-col space-y-4 mb-12">
                    <div className="flex flex-wrap gap-4">
                        {categories.map((category: CategoryType) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setSelectedType(category.type);
                                    setSelectedCategory('all');
                                }}
                                className={`px-6 py-2 rounded-full transition-colors ${selectedType === category.type ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {selectedType === 'mains' && subCategories.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {subCategories.map((subCategory: SubCategoryType) => (
                                <button
                                    key={subCategory.id}
                                    onClick={() => setSelectedCategory(subCategory.id)}
                                    className={`px-6 py-2 rounded-full transition-colors ${selectedCategory === subCategory.id ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    {subCategory.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-lg overflow-hidden shadow-lg"
                        >
                            <div className="relative cursor-pointer" onClick={() => navigate(`/product/${item.id.toString()}`)}>
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-64 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-red-100 flex items-center justify-center">
                                        <span className="text-6xl font-bold text-red-500">
                                            {item.name && item.name.length > 0 
                                              ? item.name.charAt(0).toUpperCase() 
                                              : 'P'}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {item.tags && item.tags.includes('vegetarian') && (
                                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                            Vegetarian
                                        </div>
                                    )}
                                    {item.tags && item.tags.includes('vegan') && (
                                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                            Vegan
                                        </div>
                                    )}
                                    {item.tags && item.tags.includes('gluten-free') && (
                                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                            GF
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 
                                        className="text-xl font-semibold cursor-pointer hover:text-red-500 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/product/${item.id.toString()}`);
                                        }}
                                    >
                                        {item.name}
                                    </h3>
                                    <span className="text-lg font-bold text-red-500">${item.price}</span>
                                </div>
                                <p 
                                    className="text-gray-600 mb-4 line-clamp-2 cursor-pointer hover:text-gray-800 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/product/${item.id.toString()}`);
                                    }}
                                >
                                    {item.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {/* Removed rating stars as menu.json does not have rating */}
                                    </div>
                                    <button
                                        className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
