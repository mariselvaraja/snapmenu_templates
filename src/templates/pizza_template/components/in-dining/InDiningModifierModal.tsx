import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../common/store';
import { addItem } from '../../../../common/redux/slices/inDiningCartSlice';
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

interface InDiningModifierModalProps {
  isOpen: boolean;
  onClose: (updatedItem?: any) => void;
  menuItem: any | null;
}

export default function InDiningModifierModal({ isOpen, onClose, menuItem }: InDiningModifierModalProps) {
  // Get menu items from Redux store
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const dispatch = useDispatch<AppDispatch>();
  
  // Find the original menu item to get its modifiers
  const originalMenuItem = menuItem ? menuItems.find(item => item.pk_id === menuItem.pk_id || item.id === menuItem.id) : null;
  
  // Helper function to check if spice level should be shown based on is_spice_applicable
  const shouldShowSpiceLevel = () => {
    // Check if product has is_spice_applicable field and it's "yes"
    if (originalMenuItem?.is_spice_applicable?.toLowerCase() === 'yes') {
      return true;
    }
    // Also check in the menuItem directly (for cart items)
    if (menuItem?.is_spice_applicable?.toLowerCase() === 'yes') {
      return true;
    }
    // Also check in raw_api_data if it exists
    if (originalMenuItem?.raw_api_data) {
      try {
        const rawData = typeof originalMenuItem.raw_api_data === 'string' 
          ? JSON.parse(originalMenuItem.raw_api_data) 
          : originalMenuItem.raw_api_data;
        if (rawData?.is_spice_applicable?.toLowerCase() === 'yes') {
          return true;
        }
      } catch (e) {
        // If parsing fails, continue with other checks
      }
    }
    // Check in menuItem's raw_api_data as well
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

  // Get modifiers from the original menu item or from the current item
  const extraToppingsModifiers: Modifier[] = originalMenuItem?.modifiers_list || 
    (Array.isArray(menuItem?.modifiers_list) 
      ? menuItem?.modifiers_list 
      : menuItem?.modifiers_list ? [menuItem?.modifiers_list] : []);

  console.log("InDining - menuItem?.modifiers_list", menuItem?.modifiers_list);
  console.log("InDining - originalMenuItem:", originalMenuItem);
  console.log("InDining - extraToppingsModifiers:", extraToppingsModifiers);
  console.log("InDining - shouldShowSpiceLevel():", shouldShowSpiceLevel());
  console.log("InDining - menuItem:", menuItem);

  // Define available modifiers - only show spice level if applicable
  const spiceLevelModifier: Modifier = {
    name: 'Spice Level',
    is_multi_select: 'no',
    is_forced: shouldShowSpiceLevel() ? 'yes' : 'no',
    options: [
      { name: 'Mild', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Hot', price: 0 },
    ]
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
    
    // Check if spice level is selected (if required and applicable)
    if (shouldShowSpiceLevel() && spiceLevelModifier.is_forced?.toLowerCase() === 'yes') {
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
    
    // Create cart item for in-dining cart
    const cartItem = {
      id: menuItem.id || menuItem.pk_id || Date.now(), // Use pk_id as fallback, or timestamp as last resort
      name: menuItem.name,
      price: menuItem.indining_price || 0,
      image: menuItem.image || '',
      quantity: menuItem.quantity || 1,
      selectedModifiers: selectedModifiers.map(modifier => ({
        name: modifier.name,
        options: modifier.options.map(option => ({
          name: option.name,
          price: typeof option.price === 'number' ? option.price : parseFloat(String(option.price).replace(/[^\d.-]/g, '')) || 0
        }))
      }))
    };
    
    console.log('InDining - Adding item to cart:', cartItem);
    console.log('InDining - Selected modifiers:', selectedModifiers);
    console.log('InDining - Calculated additional price:', calculateAdditionalPrice());
    
    // Dispatch to in-dining cart
    dispatch(addItem(cartItem));
    console.log('InDining - Item dispatched to inDiningCart');
    
    // Close the modal after successful dispatch
    onClose();
  };

  // Get site content from Redux state
  const { rawApiResponse } = useSelector((state: RootState) => state.siteContent);
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const homepage = siteContent.homepage;
  const siteConfiguration = siteContent?.siteConfiguration;
  const showPrice = siteConfiguration?.hidePriceInWebsite? false:  siteConfiguration?.hidePriceInMenu?false:true;

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
                {/* Check if no modifiers are available */}
                {!shouldShowSpiceLevel() && 
                 (!extraToppingsModifiers || extraToppingsModifiers.length === 0 || 
                  extraToppingsModifiers.every(modifier => 
                    !modifier.options || modifier.options.every(option => option.isEnabled === false)
                  )) && (
                  <div className="text-center py-6 text-gray-500">
                    <p className="mb-2">No Customizations Available</p>
                    <p>Proceed to add this item to the cart</p>
                  </div>
                )}
                {/* Sort modifiers - required first, then non-required */}
                {/* Spice Level Modifier - Only show if spice is applicable */}
                {shouldShowSpiceLevel() && spiceLevelModifier.is_forced?.toLowerCase() === 'yes' && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">
                      {spiceLevelModifier.name}
                      <span className="text-red-500 text-sm ml-1">*</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {spiceLevelModifier.options.filter(option => option.isEnabled !== false).map((option) => (
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
                          {showPrice && typeof option.price === 'number' && option.price > 0 && (
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
                  .map((modifier) => {
                    const enabledOptions = modifier.options?.filter(option => option.isEnabled !== false) || [];
                    
                    if (enabledOptions.length === 0) return null;
                    
                    return (
                    <div key={modifier.name} className="mb-6">
                      <h3 className="font-semibold mb-2">
                        {modifier.name}
                        <span className="text-red-500 text-sm ml-1">*</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {modifier.options.filter(option => option.isEnabled !== false).map((option) => (
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
                            {showPrice && option.price !== undefined && (
                              <div className="text-sm text-gray-600 ml-auto">(+{typeof option.price === 'number' ? "$"+option.price?.toFixed(2) : option.price})</div>
                            )}
                          </button>
                        ))}
                      </div>
                      {validationErrors[modifier.name] && (
                        <div className="text-red-500 text-sm mt-2">Please select at least one option</div>
                      )}
                    </div>
                  );
                })}

                {/* Non-required Spice Level Modifier */}
                {shouldShowSpiceLevel() && spiceLevelModifier.is_forced?.toLowerCase() !== 'yes' && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">
                      {spiceLevelModifier.name}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {spiceLevelModifier.options.filter(option => option.isEnabled !== false).map((option) => (
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
                          {showPrice && typeof option.price === 'number' && option.price > 0 && (
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
                  .map((modifier) => {
                    const enabledOptions = modifier.options?.filter(option => option.isEnabled !== false) || [];
                    
                    if (enabledOptions.length === 0) return null;
                    
                    return (
                    <div key={modifier.name} className="mb-6">
                    <h3 className="font-semibold mb-2">
                      {modifier.name}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {modifier.options.filter(option => option.isEnabled !== false).map((option) => (
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
                          {showPrice && option.price !== undefined && (
                            <div className="text-sm text-gray-600 ml-auto">(+{typeof option.price === 'number' ? "$"+option.price?.toFixed(2) : option.price})</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              </div>

              {/* Footer */}
              <div className="border-t p-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
                >
                  {menuItem.selectedModifiers ? 'Update Item' : 'Add to Cart'} - ${(Number(menuItem.indining_price) || Number(menuItem.price) || 0).toFixed(2)}{calculateAdditionalPrice() > 0 && ` + $${calculateAdditionalPrice().toFixed(2)}`}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
