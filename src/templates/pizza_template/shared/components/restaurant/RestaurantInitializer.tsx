import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantInfoRequest } from '../../redux/slices/restaurantSlice';
import { RootState } from '../../redux/rootReducer';

/**
 * Component that initializes restaurant data on app load
 * This component doesn't render anything visible, it just triggers the API call
 */
const RestaurantInitializer: React.FC = () => {
  const dispatch = useDispatch();
  const { info, loading, error } = useSelector((state: RootState) => state.restaurant);

  useEffect(() => {
    // Fetch restaurant info when component mounts
    dispatch(fetchRestaurantInfoRequest());
  }, [dispatch]);

  // Log restaurant info for debugging
  useEffect(() => {
    if (info) {
      console.log('Restaurant info loaded:', info);
      console.log('Restaurant ID:', info.restaurant_id);
      console.log('Working hours:', info.working_hours);
    }
  }, [info]);

  // Log any errors
  useEffect(() => {
    if (error) {
      console.error('Error loading restaurant info:', error);
    }
  }, [error]);

  // This component doesn't render anything visible
  return null;
};

export default RestaurantInitializer;
