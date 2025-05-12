import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../common/redux';
import { addItem, CartItem } from '../../../common/redux/slices/cartSlice';
import { FaPepperHot } from 'react-icons/fa';

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

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

interface ModifierModalProps {
  isOpen: boolean;
  onClose: (updatedItem?: any) => void;
  menuItem: any | null;
}

export default function ModifierModal({ isOpen, onClose, menuItem }: ModifierModalProps) {
  // Define available modifiers
  const spiceLevelModifier: Modifier = {
    name: 'Spice Level',
    is_multi_select: 'no',
    is_forced: 'yes',
    options: [
      { name: 'Mild', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Hot', price: 0 },
    ]
  };

  // Get menu items from Redux store
  const menuItems = useAppSelector((state) => state.menu.items);
  
  // Find the original menu item to get its modifiers
  const originalMenuItem = menuItem ? menuItems.find(item => item.id === menuItem.id) : null;
  
  // Get modifiers from the original menu item or from the current item
  const extraToppingsModifiers: Modifier[] = originalMenuItem?.modifiers_list || 
    (Array.isArray(menuItem?.modifiers_list) 
      ? menuItem?.modifiers_list 
      : menuItem?.modifiers_list ? [menuItem?.modifiers_list] : []);

  console.log(": menuItem?.modifiers_list", menuItem?.modifiers_list);

  // State to track selected modifiers
  const [selectedModifiers, setSelectedModifiers] = useState<{
    name: string;
    options: ModifierOption[];
  }[]>([]);

  // State to track validation errors
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});

  const dispatch = useAppDispatch();

  // Reset selections when modal opens with a new item
  useEffect(() => {
    if (isOpen && menuItem) {
      // Initialize with the item's selected modifiers if they exist
      if (menuItem.selectedModifiers && menuItem.selectedModifiers.length > 0) {
        setSelectedModifiers(menuItem.selectedModifiers);
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

  // Helper function to check if a modifier is multi-select
  const isModifierMultiSelect = (modifierName: string): boolean => {
    if (modifierName === spiceLevelModifier.name) {
      return spiceLevelModifier.is_multi_select?.toLowerCase() === 'yes';
    } else {
      const modifier = extraToppingsModifiers.find(mod => mod.name === modifierName);
      return modifier?.is_multi_select?.toLowerCase() === 'yes' || false;
    }
  };

  const handleOptionToggle = (modifierName: string, option: ModifierOption) => {
    setSelectedModifiers(prev => {
      // Find if this modifier already exists in our selections
      const modifierIndex = prev.findIndex(mod => mod.name === modifierName);
      
      // Check if the modifier is required
      let isRequired = false;
      let isMultiSelect = false;
      
      if (modifierName === spiceLevelModifier.name) {
        isRequired = spiceLevelModifier.is_forced?.toLowerCase() === 'yes';
        isMultiSelect = spiceLevelModifier.is_multi_select?.toLowerCase() === 'yes';
      } else {
        // Check in extraToppingsModifiers array
        const modifier = extraToppingsModifiers.find(mod => mod.name === modifierName);
        if (modifier) {
          isRequired = modifier.is_forced?.toLowerCase() === 'yes';
          isMultiSelect = modifier.is_multi_select?.toLowerCase() === 'yes';
        }
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
        
        return newModifiers;
      } 
      // If this modifier doesn't exist in our selections yet
      else {
        return [...prev, { name: modifierName, options: [option] }];
      }
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
    
    // Check if spice level is selected (if required)
    if (spiceLevelModifier.is_forced?.toLowerCase() === 'yes') {
      const spiceLevelSelected = selectedModifiers.some(
        selected => selected.name === spiceLevelModifier.name && selected.options.length > 0
      );
      if (!spiceLevelSelected) {
        newValidationErrors[spiceLevelModifier.name] = true;
        hasErrors = true;
      }
    }
    
    // Check if all required extra toppings modifiers are selected
    extraToppingsModifiers.forEach(modifier => {
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
    
    if (hasErrors) {
      return;
    }
    
    // Create cart item with selected modifiers
    // Convert any string prices to numbers for the cart
    const normalizedModifiers = selectedModifiers.map(modifier => ({
      name: modifier.name,
      options: modifier.options.map(option => ({
        name: option.name,
        price: typeof option.price === 'string' 
          ? parseFloat(option.price.replace(/[^\d.-]/g, '')) || 0
          : option.price
      }))
    }));

    const cartItem: CartItem = {
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      quantity: menuItem.quantity || 1, // Use existing quantity if editing
      selectedModifiers: normalizedModifiers
    };
    
    // If this is a new item, add it to the cart
    if (!menuItem.selectedModifiers) {
      dispatch(addItem(cartItem));
      onClose(); // Close without passing the updated item
    } else {
      // If it's an existing item being edited, pass the updated item back to the parent component
      onClose(cartItem);
    }
  };

  // Calculate additional price from modifiers
  const calculateAdditionalPrice = () => {
    return selectedModifiers.reduce((total, modifier) => {
      return total + modifier.options.reduce((modTotal, option) => {
        // Convert price to number if it's a string
        const optionPrice = typeof option.price === 'string' 
          ? parseFloat(option.price.replace(/[^\d.-]/g, '')) 
          : option.price;
        return modTotal + (isNaN(optionPrice) ? 0 : optionPrice);
      }, 0);
    }, 0);
  };

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
                {/* Sort modifiers - required first, then non-required */}
                {/* Spice Level Modifier */}
                {spiceLevelModifier.is_forced?.toLowerCase() === 'yes' && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">
                      {spiceLevelModifier.name}
                      <span className="text-red-500 text-sm ml-1">*</span>
                      <span className="text-gray-500 text-xs ml-1">
                        {/* ({spiceLevelModifier.is_multi_select?.toLowerCase() === 'yes' ? 'Select multiple' : 'Select one'}) */}
                      </span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {spiceLevelModifier.options.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => handleOptionToggle(spiceLevelModifier.name, option)}
                          className={`p-2 rounded-lg border text-left transition-colors flex items-center ${
                            isOptionSelected(spiceLevelModifier.name, option.name)
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="mr-2">
                            {spiceLevelModifier.is_multi_select?.toLowerCase() === 'yes' ? (
                              <div className={`w-4 h-4 border rounded ${isOptionSelected(spiceLevelModifier.name, option.name) ? 'bg-red-500 border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                {isOptionSelected(spiceLevelModifier.name, option.name) && <Check className="h-3 w-3 text-white" />}
                              </div>
                            ) : (
                              <div className={`w-4 h-4 border rounded-full ${isOptionSelected(spiceLevelModifier.name, option.name) ? 'border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                {isOptionSelected(spiceLevelModifier.name, option.name) && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                              </div>
                            )}
                          </div>
                          <div className="font-medium flex items-center justify-center">
                            <div className="ml-2 flex">
                              {option.name === 'Mild' && <FaPepperHot className="text-red-300 h-4 w-4" />}
                              {option.name === 'Medium' && (
                                <>
                                  <FaPepperHot className="text-red-400 h-4 w-4" />
                                  <FaPepperHot className="text-red-400 h-4 w-4 ml-1" />
                                </>
                              )}
                              {option.name === 'Hot' && (
                                <>
                                  <FaPepperHot className="text-red-500 h-4 w-4" />
                                  <FaPepperHot className="text-red-500 h-4 w-4 ml-1" />
                                  <FaPepperHot className="text-red-500 h-4 w-4 ml-1" />
                                </>
                              )}
                            </div>
                          </div>
                          {typeof option.price === 'number' && option.price > 0 && (
                            <div className="text-sm text-gray-600 ml-auto">+{option.price?.toFixed(2)}</div>
                          )}
                        </button>
                      ))}
                    </div>
                    {validationErrors[spiceLevelModifier.name] && (
                      <div className="text-red-500 text-sm mt-2">Please select a spice level</div>
                    )}
                  </div>
                )}

                {/* Required Extra Toppings Modifiers */}
                {extraToppingsModifiers
                  .filter(modifier => modifier.is_forced?.toLowerCase() === 'yes')
                  .map((modifier) => (
                    <div key={modifier.name} className="mb-6">
                      <h3 className="font-semibold mb-2">
                        {modifier.name}
                        <span className="text-red-500 text-sm ml-1">*</span>
                        <span className="text-gray-500 text-xs ml-1">
                          {/* ({modifier.is_multi_select?.toLowerCase() === 'yes' ? 'Select multiple' : 'Select one'}) */}
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {modifier.options.map((option) => (
                          <button
                            key={option.name}
                            onClick={() => handleOptionToggle(modifier.name, option)}
                            className={`p-2 rounded-lg border text-left transition-colors flex items-center gap-2 ${
                              isOptionSelected(modifier.name, option.name)
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="mr-2">
                              {modifier.is_multi_select?.toLowerCase() === 'yes' ? (
                                <div className={`w-4 h-4 border rounded ${isOptionSelected(modifier.name, option.name) ? 'bg-red-500 border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                  {isOptionSelected(modifier.name, option.name) && <Check className="h-3 w-3 text-white" />}
                                </div>
                              ) : (
                                <div className={`w-4 h-4 border rounded-full ${isOptionSelected(modifier.name, option.name) ? 'border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                  {isOptionSelected(modifier.name, option.name) && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                                </div>
                              )}
                            </div>
                            <div className="font-medium flex items-center justify-center line-clamp-1">
                              {option.name}
                            </div>
                            { option.price !== undefined && (
                              <div className="text-sm text-gray-600 ml-auto">(+{typeof option.price === 'number' ? "$"+option.price?.toFixed(2) : option.price})</div>
                            )}
                          </button>
                        ))}
                      </div>
                      {validationErrors[modifier.name] && (
                        <div className="text-red-500 text-sm mt-2">Please select at least one option</div>
                      )}
                    </div>
                  ))}

                {/* Non-required Spice Level Modifier */}
                {spiceLevelModifier.is_forced?.toLowerCase() !== 'yes' && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">
                      {spiceLevelModifier.name}
                      <span className="text-gray-500 text-xs ml-1">
                        {/* ({spiceLevelModifier.is_multi_select?.toLowerCase() === 'yes' ? 'Select multiple' : 'Select one'}) */}
                      </span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {spiceLevelModifier.options.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => handleOptionToggle(spiceLevelModifier.name, option)}
                          className={`p-2 rounded-lg border text-left transition-colors flex items-center ${
                            isOptionSelected(spiceLevelModifier.name, option.name)
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="mr-2">
                            {spiceLevelModifier.is_multi_select?.toLowerCase() === 'yes' ? (
                              <div className={`w-4 h-4 border rounded ${isOptionSelected(spiceLevelModifier.name, option.name) ? 'bg-red-500 border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                {isOptionSelected(spiceLevelModifier.name, option.name) && <Check className="h-3 w-3 text-white" />}
                              </div>
                            ) : (
                              <div className={`w-4 h-4 border rounded-full ${isOptionSelected(spiceLevelModifier.name, option.name) ? 'border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                {isOptionSelected(spiceLevelModifier.name, option.name) && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                              </div>
                            )}
                          </div>
                          <div className="font-medium flex items-center justify-center">
                            <div className="ml-2 flex">
                              {option.name === 'Mild' && <FaPepperHot className="text-red-300 h-4 w-4" />}
                              {option.name === 'Medium' && (
                                <>
                                  <FaPepperHot className="text-red-400 h-4 w-4" />
                                  <FaPepperHot className="text-red-400 h-4 w-4 ml-1" />
                                </>
                              )}
                              {option.name === 'Hot' && (
                                <>
                                  <FaPepperHot className="text-red-500 h-4 w-4" />
                                  <FaPepperHot className="text-red-500 h-4 w-4 ml-1" />
                                  <FaPepperHot className="text-red-500 h-4 w-4 ml-1" />
                                </>
                              )}
                            </div>
                          </div>
                          {typeof option.price === 'number' && option.price > 0 && (
                            <div className="text-sm text-gray-600 ml-auto">+{option.price?.toFixed(2)}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Non-required Extra Toppings Modifiers */}
                {extraToppingsModifiers
                  .filter(modifier => modifier.is_forced?.toLowerCase() !== 'yes')
                  .map((modifier) => (
                    <div key={modifier.name} className="mb-6">
                    <h3 className="font-semibold mb-2">
                      {modifier.name}
                      <span className="text-gray-500 text-xs ml-1">
                        {/* ({modifier.is_multi_select?.toLowerCase() === 'yes' ? 'Select multiple' : 'Select one'}) */}
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {modifier.options.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => handleOptionToggle(modifier.name, option)}
                          className={`p-2 rounded-lg border text-left transition-colors flex items-center gap-2 ${
                            isOptionSelected(modifier.name, option.name)
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="mr-2">
                            {modifier.is_multi_select?.toLowerCase() === 'yes' ? (
                              <div className={`w-4 h-4 border rounded ${isOptionSelected(modifier.name, option.name) ? 'bg-red-500 border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                {isOptionSelected(modifier.name, option.name) && <Check className="h-3 w-3 text-white" />}
                              </div>
                            ) : (
                              <div className={`w-4 h-4 border rounded-full ${isOptionSelected(modifier.name, option.name) ? 'border-red-500' : 'border-gray-400'} flex items-center justify-center`}>
                                {isOptionSelected(modifier.name, option.name) && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                              </div>
                            )}
                          </div>
                          <div className="font-medium flex items-center justify-center line-clamp-1">
                            {option.name}
                          </div>
                          { option.price !== undefined && (
                            <div className="text-sm text-gray-600 ml-auto">(+{typeof option.price === 'number' ? "$"+option.price?.toFixed(2) : option.price})</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t p-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
                >
                  {menuItem.selectedModifiers ? 'Update Item' : 'Add to Cart'} - ${(menuItem.price + calculateAdditionalPrice())?.toFixed(2)}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
