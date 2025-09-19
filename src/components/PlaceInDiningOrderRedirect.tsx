import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Component to handle redirecting from old query parameter format to new path parameter format
 * Old format: /placeindiningorder?restaurant=123&franchise=456&table=789
 * New format: /placeindiningorder/123/456/789
 */
const PlaceInDiningOrderRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're on the placeindiningorder route with query parameters
    if (location.pathname === '/placeindiningorder' && location.search) {
      const searchParams = new URLSearchParams(location.search);
      const restaurant = searchParams.get('restaurant');
      const franchise = searchParams.get('franchise');
      const table = searchParams.get('table');

      // If all required parameters are present, redirect to path parameter format
      if (restaurant && franchise && table) {
        const newPath = `/placeindiningorder/${restaurant}/${franchise}/${table}`;
        console.log('Redirecting from query params to path params:', {
          from: `${location.pathname}${location.search}`,
          to: newPath
        });
        
        // Replace the current history entry to avoid back button issues
        navigate(newPath, { replace: true });
      }
    }
  }, [location, navigate]);

  // Return null - no UI needed, just redirect
  return null;
};

export default PlaceInDiningOrderRedirect;
