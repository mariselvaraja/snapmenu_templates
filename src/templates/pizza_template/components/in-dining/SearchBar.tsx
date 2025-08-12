import React from 'react';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  menuType?: string | null;
}

export default function SearchBar({ searchQuery, onSearchChange, onBack, showBackButton = false, menuType }: SearchBarProps) {
  // Determine placeholder text based on menu type
  const getPlaceholderText = () => {
    if (menuType === 'drinks') {
      return 'Search for drinks...';
    } else if (menuType === 'food') {
      return 'Search for dishes...';
    }
    return 'Search for items...';
  };

  return (
    <div className="bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        
         
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={getPlaceholderText()}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
