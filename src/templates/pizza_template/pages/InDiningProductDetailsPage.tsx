import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../common/store';
import InDiningProductDetails from '../components/in-dining/InDiningProductDetails';

const InDiningProductDetailsPage: React.FC = () => {
  const { table, productId } = useParams<{ table: string; productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Get menu data from Redux
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const currentMenuType = useSelector((state: RootState) => state.menu.currentMenuType);
  
  // Find the product from menuItems
  useEffect(() => {
    if (productId && menuItems.length > 0) {
      const product = menuItems.find((item: any) => 
        item.id?.toString() === productId || 
        item.pk_id?.toString() === productId
      );
      
      if (product) {
        setSelectedProduct(product);
      } else {
        // Product not found, navigate back
        handleClose();
      }
    }
  }, [productId, menuItems]);
  
  const handleClose = () => {
    // Navigate back to the in-dining order page with the same table
    navigate(`/placeindiningorder?table=${table}`);
  };
  
  const handleProductSelect = (product: any) => {
    // Navigate to the new product's detail page
    navigate(`/placeindiningorder/${table}/product/${product.id || product.pk_id}`);
  };
  
  const handleViewOrders = () => {
    // Navigate to orders view (you might need to adjust this based on your routing)
    navigate(`/placeindiningorder?table=${table}&view=orders`);
  };
  
  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <InDiningProductDetails
      product={selectedProduct}
      onClose={handleClose}
      menuItems={menuItems}
      currentMenuType={currentMenuType}
      onProductSelect={handleProductSelect}
      onViewOrders={handleViewOrders}
    />
  );
};

export default InDiningProductDetailsPage;
