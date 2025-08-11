import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface EmptyStateProps {
  selectedCategory?: string;
  onViewAll?: () => void;
  isMenuEmpty?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  selectedCategory, 
  onViewAll,
  isMenuEmpty = false 
}) => {
  if (isMenuEmpty) {
    // Show when both food and drinks menus are empty
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <UtensilsCrossed className="h-12 w-12 text-red-400" style={{ color: '#ef4421' }} />
          </div>
          <h3 className="text-xl font-semibold text-black-800 mb-3">No Menu Available</h3>
          <p className="text-black-600 mb-8 text-sm">
            We're currently updating our menu. Please check back later or contact our staff for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Show when category has no items
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <UtensilsCrossed className="h-12 w-12 text-red-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Items Available</h3>
        <p className="text-gray-600 mb-8 px-4">
          There are no items available in the "{selectedCategory}" category at the moment.
        </p>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center mx-auto"
          >
            View All Menu Items
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
