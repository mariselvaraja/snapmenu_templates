import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Component to handle redirecting from old query parameter format to new path parameter format
 * Old format: /festivalMenu?restaurant=123&franchise=456
 * New format: /festivalMenu/123/456
 */
const FestivalMenuRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're on the festivalMenu route with query parameters
    if (location.pathname === '/festivalMenu' && location.search) {
      const searchParams = new URLSearchParams(location.search);
      const restaurant = searchParams.get('restaurant');
      const franchise = searchParams.get('franchise');

      // If all required parameters are present, redirect to path parameter format
      if (restaurant && franchise) {
        const newPath = `/festivalMenu/${restaurant}/${franchise}`;
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

export default FestivalMenuRedirect;
