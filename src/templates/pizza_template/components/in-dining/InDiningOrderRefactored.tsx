import React from 'react';
import { useInDiningOrder } from './hooks/useInDiningOrder';
import InDiningNavbar from './components/InDiningNavbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import MenuItemsList from './components/MenuItemsList';
import InDiningProductDetails from './InDiningProductDetails';
import InDiningCartDrawer from './InDiningCartDrawer';
import InDiningOrders from './InDiningOrders';
import SearchBarComponent from '../SearchBarComponent';
import ModifierModal from '../ModifierModal';

export default function InDiningOrderRefactored() {
  const {
    // State
    isSearchActive,
    showOrders,
    selectedProduct,
    isProductDetailsOpen,
    isModifierModalOpen,
    selectedMenuItem,
    orderNumber,
    
    // Data
    brand,
    tableName,
    banners,
    selectedCategory,
    selectedSubcategory,
    uniqueCategories,
    uniqueSubcategories,
    filteredMenuItems,
    menuItems,
    loading,
    
    // Handlers
    handleSearchClick,
    handleOrdersClick,
    handleCategoryChange,
    handleSubcategoryChange,
    handleViewAllItems,
    handleProductClick,
    openModifiersPopup,
    closeProductDetails,
    handlePlaceOrder,
    resetOrder,
    setShowOrders,
    setIsSearchActive,
    setIsModifierModalOpen
  } = useInDiningOrder();

  // Show orders view if showOrders is true
  if (showOrders) {
    return (
      <InDiningOrders 
        onClose={() => {
          setShowOrders(false);
          // If we just placed an order, reset the cart
          if (orderNumber) {
            resetOrder();
          }
        }}
        newOrderNumber={orderNumber}
      />
    );
  }

  // If search is active, render only the SearchBarComponent
  if (isSearchActive) {
    return <SearchBarComponent onClose={() => setIsSearchActive(false)} />;
  }

  return (
    <div className="pt-0 pb-8 sm:pb-20">
      {/* Navbar */}
      <InDiningNavbar
        brandLogo={brand?.logo?.icon || ''}
        brandName={brand?.name || ''}
        tableName={tableName}
        onSearchClick={handleSearchClick}
        onOrdersClick={handleOrdersClick}
      />
      
      {/* Hero Banner Section with Carousel */}
      <HeroBanner banners={banners} />
      
      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        uniqueCategories={uniqueCategories}
        uniqueSubcategories={uniqueSubcategories}
        filteredItemsCount={filteredMenuItems.length}
        onCategoryChange={handleCategoryChange}
        onSubcategoryChange={handleSubcategoryChange}
      />
      
      {/* Menu Items List */}
      <MenuItemsList
        menuItems={menuItems}
        filteredMenuItems={filteredMenuItems}
        loading={loading}
        selectedCategory={selectedCategory}
        onProductClick={handleProductClick}
        onAddToOrder={openModifiersPopup}
        onViewAllItems={handleViewAllItems}
      />
      
      {/* Product Details Component */}
      {isProductDetailsOpen && selectedProduct && (
        <InDiningProductDetails
          product={selectedProduct}
          onClose={closeProductDetails}
          menuItems={menuItems}
          currentMenuType = ""
        />
      )}
      
      {/* Cart Drawer Component */}
      <InDiningCartDrawer onPlaceOrder={handlePlaceOrder} />
      
      {/* Modifier Modal */}
      <ModifierModal
        isOpen={isModifierModalOpen}
        onClose={() => setIsModifierModalOpen(false)}
        menuItem={selectedMenuItem}
      />
    </div>
  );
}
