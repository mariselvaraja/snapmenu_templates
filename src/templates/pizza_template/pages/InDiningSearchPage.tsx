import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../common/store';
import { placeInDiningOrderRequest } from '../../../common/redux/slices/inDiningOrderSlice';
import SearchBarComponent from '../components/SearchBarComponent';

const InDiningSearchPage: React.FC = () => {
  const { table } = useParams<{ table: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const handleClose = () => {
    // Navigate back to the in-dining order page with the same table
    navigate(`/placeindiningorder?table=${table}`);
  };
  
  const handlePlaceOrder = (specialRequest: string = '') => {
    // You can handle the order placement logic here or pass it through
    // For now, we'll just navigate back to the main page
    // The actual order placement should be handled by the parent component
    navigate(`/placeindiningorder?table=${table}&placeOrder=true&specialRequest=${encodeURIComponent(specialRequest)}`);
  };
  
  return (
    <SearchBarComponent 
      onClose={handleClose}
      onPlaceOrder={handlePlaceOrder}
    />
  );
};

export default InDiningSearchPage;
