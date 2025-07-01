import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../common/store';
import { addItem } from '../../../../common/redux/slices/inDiningCartSlice';

interface ModifierOption {
  name: string;
  price: number | string;
  isEnabled?: boolean;
  selectedByDefult?: string;
  attrSortIndex?: number;
  visibility?: string;
}

interface Modifier {
  name: string;
  is_multi_select : string,
  is_forced: string,
  options: ModifierOption[];
}


interface InDiningModifierModalProps {
  isOpen: boolean;
  onClose: (updatedItem?: any) => void;
  menuItem: any | null;
}

export default function InDiningDrinksModifierModal({ isOpen, onClose, menuItem }: InDiningModifierModalProps) {
  // Get menu items from Redux store
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const dispatch = useDispatch<AppDispatch>();
  
  // Find the original menu item to get its modifiers
  const originalMenuItem = menuItem ? menuItems.find(item => item.pk_id === menuItem.pk_id || item.id === menuItem.id) : null;
  

  // Define available modifiers - ML options from prices array
  const mlOptionsModifier: Modifier = {
    name: 'Units',
    is_multi_select: 'no',
    is_forced: 'yes', // Always required for drinks
    options: menuItem?.prices && Array.isArray(menuItem.prices) 
      ? menuItem.prices.map((priceOption: any) => ({
          name: priceOption.name,
          price: parseFloat(priceOption.price) || 0
        }))
      : []
  };


  // State to track selected modifiers
  const [selectedModifiers, setSelectedModifiers] = useState<{
    name: string;
    options: ModifierOption[];
  }[]>([]);

  // State to track validation errors
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});

  // Reset selections when modal opens with a new item
  useEffect(() => {
    if (isOpen && menuItem) {
      // Initialize with the item's selected modifiers if they exist
      if (menuItem.selectedModifiers && menuItem.selectedModifiers.length > 0) {
        // Deep clone the selected modifiers to avoid reference issues
        const clonedModifiers = menuItem.selectedModifiers.map((modifier: any) => ({
          name: modifier.name,
          options: modifier.options.map((option: any) => ({
            name: option.name,
            price: option.price
          }))
        }));
        setSelectedModifiers(clonedModifiers);
      } else {
        // Otherwise initialize with empty array
        setSelectedModifiers([]);
      }
      // Reset validation errors when modal opens
      setValidationErrors({});
    }
  }, [isOpen, menuItem]);

  // Handle modal close with state cleanup
  const handleClose = () => {
    // Reset states when modal closes
    setSelectedModifiers([]);
    setValidationErrors({});
    // Call the original onClose function without parameters
    onClose();
  };

  const handleOptionToggle = (modifierName: string, option: ModifierOption) => {
    setSelectedModifiers(prev => {
      // Find if this modifier already exists in our selections
      const modifierIndex = prev.findIndex(mod => mod.name === modifierName);
      
      // For ML options (single-select required), just replace the current option
      if (modifierName === mlOptionsModifier.name) {
        if (modifierIndex >= 0) {
          // Replace existing selection
          const newModifiers = [...prev];
          newModifiers[modifierIndex] = {
            ...newModifiers[modifierIndex],
            options: [option]
          };
          return newModifiers;
        } else {
          // Add new selection
          return [...prev, { name: modifierName, options: [option] }];
        }
      }
      
      return prev;
    });
  };

  const isOptionSelected = (modifierName: string, optionName: string) => {
    const modifier = selectedModifiers.find(mod => mod.name === modifierName);
    if (!modifier) return false;
    
    return modifier.options.some(opt => opt.name === optionName);
  };

  const handleAddToCart = () => {
    if (!menuItem) return;
    
    // Reset validation errors
    const newValidationErrors: {[key: string]: boolean} = {};
    let hasErrors = false;
    
    // Check if ML size is selected (always required for drinks)
    if (mlOptionsModifier.options.length > 0) {
      const mlSizeSelected = selectedModifiers.some(
        selected => selected.name === mlOptionsModifier.name && selected.options.length > 0
      );
      if (!mlSizeSelected) {
        newValidationErrors[mlOptionsModifier.name] = true;
        hasErrors = true;
      }
    }

    // Update validation errors state
    setValidationErrors(newValidationErrors);
    
    if (hasErrors) {
      return;
    }

    const modifierPrice = selectedModifiers.find(mod => mod.name === mlOptionsModifier.name);
    const selectedMlPrice = modifierPrice && modifierPrice.options.length > 0 
      ? (typeof modifierPrice.options[0].price === 'number' 
          ? modifierPrice.options[0].price 
          : parseFloat(String(modifierPrice.options[0].price)) || 0)
      : (menuItem.indining_price || 0);
    
    // Create cart item for in-dining cart
    const cartItem = {
      id: menuItem.id || menuItem.pk_id || Date.now(), // Use pk_id as fallback, or timestamp as last resort
      name: menuItem.name,
      price: selectedMlPrice || 0, 
      image: menuItem.image || '',
      quantity: menuItem.quantity || 1,
      selectedModifiers: selectedModifiers.map(modifier => ({
        name: modifier.name,
        options: modifier.options.map(option => ({
          name: option.name,
          price: 0
        }))
      }))
    };
    
    // Dispatch to in-dining cart
    dispatch(addItem(cartItem));    
    onClose();
  };

  // Get site content from Redux state
  const { rawApiResponse } = useSelector((state: RootState) => state.siteContent);
  const siteContent = rawApiResponse ? (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : {};
  const homepage = siteContent.homepage;
  const siteConfiguration = siteContent?.siteConfiguration;
  const showPrice = siteConfiguration?.hidePriceInWebsite? false:  siteConfiguration?.hidePriceInMenu?false:true;


  if (!menuItem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">{menuItem.name}</h2>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modifiers */}
              <div className="flex-grow overflow-y-auto p-4">
                {/* ML Size Options - Always required for drinks */}
                {mlOptionsModifier.options.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">
                      {mlOptionsModifier.name}
                      <span className="text-red-500 text-sm ml-1">*</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {mlOptionsModifier.options.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => handleOptionToggle(mlOptionsModifier.name, option)}
                          className={`p-3 rounded-lg border text-center transition-colors flex flex-col items-center ${
                            isOptionSelected(mlOptionsModifier.name, option.name)
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="mb-2">
                            <div className={`w-4 h-4 border rounded-full ${isOptionSelected(mlOptionsModifier.name, option.name) ? 'border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                              {isOptionSelected(mlOptionsModifier.name, option.name) && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                            </div>
                          </div>
                          <div className="font-medium text-sm">
                            {option.name}
                          </div>
                          {showPrice && (
                            <div className="text-xs text-gray-600 mt-1">
                              ${typeof option.price === 'number' ? option.price.toFixed(2) : parseFloat(String(option.price)).toFixed(2)}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {validationErrors[mlOptionsModifier.name] && (
                      <div className="text-red-500 text-sm mt-2">Please select a size</div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t p-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
                >
                  {menuItem.selectedModifiers ? 'Update Item' : 'Add to Cart'} - ${(() => {
                    // Get the selected ML option price
                    const mlSizeModifier = selectedModifiers.find(mod => mod.name === mlOptionsModifier.name);
                    if (mlSizeModifier && mlSizeModifier.options.length > 0) {
                      const selectedPrice = mlSizeModifier.options[0].price;
                      return (typeof selectedPrice === 'number' ? selectedPrice : parseFloat(String(selectedPrice)) || 0).toFixed(2);
                    }
                    return (Number(menuItem.indining_price) || 0).toFixed(2);
                  })()}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
