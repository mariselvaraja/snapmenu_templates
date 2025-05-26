import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import MenuItemCard from './MenuItemCard';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  dietary?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
  };
}

interface MenuItemsListProps {
  menuItems: MenuItem[];
  filteredMenuItems: MenuItem[];
  loading: boolean;
  selectedCategory: string;
  onProductClick: (item: MenuItem) => void;
  onAddToOrder: (item: MenuItem) => void;
  onViewAllItems: () => void;
}

const MenuItemsList: React.FC<MenuItemsListProps> = ({
  menuItems,
  filteredMenuItems,
  loading,
  selectedCategory,
  onProductClick,
  onAddToOrder,
  onViewAllItems
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading menu items...</p>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No menu items available</p>
      </div>
    );
  }

  if (filteredMenuItems.length === 0) {
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
          <button
            onClick={onViewAllItems}
            className="px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center mx-auto"
          >
            View All Menu Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <div>
          <div className="space-y-4 sm:space-y-6">
            {filteredMenuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onProductClick={onProductClick}
                onAddToOrder={onAddToOrder}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemsList;
