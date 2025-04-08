import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MenuItem, CategoryType, SubCategoryType } from '../context/MenuContext';
import { useRootMenu } from '../../../../context/RootMenuContext';
import { useDispatch } from 'react-redux';
import { addItem, CartItem } from '../cartSlice';

// Define interface for RootMenuContext
interface RootMenuContextType {
    menu: any;
    loading: boolean;
    error: string | null;
}

export default function Menu() {
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [categories, setCategories] = useState<CategoryType[]>([{ id: 'all', name: 'All Items', type: 'all' }]);
    const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
    
    // Get data directly from RootMenuContext
    const rootMenuContext = useRootMenu() as RootMenuContextType;
    const { menu, loading, error } = rootMenuContext;
    console.log("Root Menu Context in Menu Component:", { menu, loading, error });
    
    const dispatch = useDispatch();
    
    // Process menu data when it changes
    useEffect(() => {
        if (menu) {
            console.log("Processing menu in Menu component:", menu);
            
            // Generate category list from menu keys
            const menuObj = typeof menu === 'object' && 'menu' in menu ? menu.menu : menu;
            
            if (menuObj && typeof menuObj === 'object') {
                const initialCategoryList = Object.keys(menuObj).map(key => ({
                    id: key,
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    type: key
                }));

          
                
                setCategories([
                    { id: 'all', name: 'All Items', type: 'all' },
                    ...initialCategoryList
                ]);
                
                // Process subcategories if mains category exists
                if (menuObj.mains) {
                    const mainsSubcategories = Array.from(new Set(menuObj.mains.map((item: any) => item.subCategory)))
                        .filter((subCategory: any) => subCategory)
                        .map((subCategory: any) => ({
                            id: subCategory,
                            name: subCategory.charAt(0).toUpperCase() + subCategory.slice(1)
                        }));
                    setSubCategories(mainsSubcategories);
                }
            }
        }
    }, [menu]);

    // Function to generate a numeric hash from a string
    const hashStringToNumber = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };

    const handleAddToCart = (menuItem: MenuItem) => {
        const cartItem: CartItem = {
            id: hashStringToNumber(menuItem.id), // Generate a numeric ID from the string ID
            name: menuItem.name,
            price: parseFloat(menuItem.price), // Convert price to number
            image: menuItem.image,
            quantity: 1, // Initial quantity is 1
        };
        console.log("handleAddToCart called with menuItem:", menuItem);
        dispatch(addItem(cartItem));
    };

    // Flatten menu items for easier filtering and sorting
    const menuItems: MenuItem[] = (() => {
        if (!menu) return [];
        
        const menuObj = typeof menu === 'object' && 'menu' in menu ? menu.menu : menu;
        if (!menuObj || typeof menuObj !== 'object') return [];
        
        return Object.values(menuObj).flat() as MenuItem[];
    })();

    const filteredItems = menuItems.filter(item => {
        if (selectedType !== 'all' && item.category !== selectedType) return false;
        if (selectedType === 'mains' && selectedCategory !== 'all' && item.subCategory !== selectedCategory) return false;
        return true;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
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
                        {categories && categories.map((category: CategoryType) => (
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

                    {selectedType === 'mains' && (
                        <div className="flex flex-wrap gap-4">
                            {subCategories && subCategories.map((subCategory: SubCategoryType) => (
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
                            <div className="relative">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {item.dietary?.isVegetarian && (
                                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                            Vegetarian
                                        </div>
                                    )}
                                    {item.dietary?.isVegan && (
                                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                            Vegan
                                        </div>
                                    )}
                                    {item.dietary?.isGlutenFree && (
                                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                            GF
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                    <span className="text-lg font-bold text-red-500">${item.price}</span>
                                </div>
                                <p className="text-gray-600 mb-4">{item.description}</p>
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
