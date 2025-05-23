import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { MenuItem } from '../../../../common/redux';

interface RecommendedProductsProps {
    currentProductId: string;
    allItems: MenuItem[];
    product: MenuItem;
}

const RecommendedProducts: React.FC<any> = ({ 
    currentProductId, 
    allItems, 
    product 
}) => {
    const navigate = useNavigate();

    const getRecommendedItems = (): MenuItem[] => {
        // Extract best combo SKU IDs from the product
        let recommendedSkuIds: string[] = [];
        
        // First try to use best_combo_ids if available (new format)
        if (product.best_combo.best_combo_ids && typeof product.best_combo.best_combo_ids === 'string') {
            recommendedSkuIds = product.best_combo.best_combo_ids
                .split(',')
                .map((id: string) => id.trim());
        } 

        // Log the recommended SKU IDs for debugging
        console.log("Recommended SKU IDs:", product.best_combo.best_combo_ids);
        
        // Find items matching the recommended SKU IDs
        let recommendedItems = allItems.filter((item : any) => 
            item.sku_id && recommendedSkuIds.includes(item.sku_id)
        );
        
        // Log the matched items for debugging
        console.log("Matched items by SKU ID:", recommendedItems.map((item:any) => ({
            id: item.id,
            name: item.name,
            sku_id: item.sku_id
        })));
        
        // If we have pairings, try to find matching products by name
        if (product.pairings && Array.isArray(product.pairings) && product.pairings.length > 0 && recommendedItems.length < 5) {
            // Get products that match pairing names
            const pairingItems = allItems.filter((item:any) => 
                item.id.toString() !== currentProductId && // Don't include current product
                product.pairings && product.pairings.some((pairing:any) => 
                    item.name.toLowerCase().includes(pairing.toLowerCase()) || // Match by name
                    (item.description && item.description.toLowerCase().includes(pairing.toLowerCase())) // Match by description
                )
            );
            
            // Add unique pairing items to recommended items
            pairingItems.forEach((item:any) => {
                if (!recommendedItems.some((ri:any) => ri.id === item.id)) {
                    recommendedItems.push(item);
                }
            });
        }
        
        // If still not enough recommended items, add random items
        // if (recommendedItems.length === 0) {
        //     recommendedItems = allItems
        //         .filter(item => item.id.toString() !== currentProductId)
        //         .slice(0, 5);
        // } else if (recommendedItems.length < 5) {
        //     // Add more random items to fill up to 5
        //     const additionalItems = allItems
        //         .filter(item => 
        //             item.id.toString() !== currentProductId && 
        //             !recommendedItems.some(ri => ri.id === item.id)
        //         )
        //         .slice(0, 5 - recommendedItems.length);
            
        //     recommendedItems = [...recommendedItems, ...additionalItems];
        // }
        
        // Limit to 5 items
        return recommendedItems.slice(0, 5);
    };

    const recommendedItems = getRecommendedItems();
    
    // Try to extract best_name from best_combo if it's not directly available
    const [bestName, setBestName] = React.useState<string | undefined>(product.best_name);
    
    React.useEffect(() => {
        // If best_name is not available but best_combo is a JSON string
        if (!product.best_name && product.best_combo && typeof product.best_combo === 'string') {
            try {
                const bestCombo = JSON.parse(product.best_combo);
                if (bestCombo.best_name) {
                    setBestName(bestCombo.best_name);
                }
            } catch (e) {
                // Ignore parsing errors
            }
        } else {
            setBestName(product.best_name);
        }
    }, [product]);

    return (
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

            {/* Desktop layout - vertical stack */}
            <div className="hidden md:block space-y-4">
                {recommendedItems.map(item => (
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
                ))}
            </div>

            {/* Mobile layout - horizontal scroll */}
            <div className="md:hidden">
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {recommendedItems.map(item => (
                        <div 
                            key={item.id} 
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex-shrink-0 w-32"
                            onClick={() => navigate(`/product/${item.id}`)}
                        >
                            <div className="p-2">
                                {item.image ? (
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-20 object-cover rounded-md mb-2"
                                    />
                                ) : (
                                    <div className="w-full h-20 bg-red-100 flex items-center justify-center rounded-md mb-2">
                                        <span className="text-lg font-bold text-red-500">
                                            {item.name && item.name.length > 0 
                                                ? item.name.charAt(0).toUpperCase() 
                                                : 'P'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium text-xs leading-tight mb-1 line-clamp-2">{item.name}</h3>
                                    <p className="text-red-500 text-xs font-semibold">${item.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default RecommendedProducts;
