import React from 'react';
import { Utensils, Wine } from 'lucide-react';

interface MenuTypeSelectorProps {
  currentMenuType: string;
  showCategories: boolean;
  onFoodClick: () => void;
  onDrinksClick: () => void;
}

export default function MenuTypeSelector({ 
  currentMenuType, 
  showCategories,
  onFoodClick, 
  onDrinksClick 
}: MenuTypeSelectorProps) {
  return (
    <div className="bg-white px-2 py-1 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onFoodClick}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
            (!showCategories && currentMenuType === 'food') || (showCategories && currentMenuType === 'food')
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Utensils className="h-5 w-5" />
          Food Menu
        </button>
        
        <button
          onClick={onDrinksClick}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
            (!showCategories && currentMenuType === 'drinks') || (showCategories && currentMenuType === 'drinks')
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Wine className="h-5 w-5" />
          Drinks Menu
        </button>
      </div>
    </div>
  );
}
