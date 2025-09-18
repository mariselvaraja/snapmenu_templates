import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../common/redux/hooks';

/**
 * Component that updates the document title based on the restaurant name
 * Also adds a preview indicator when in preview mode
 */
export default function TitleUpdater() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Check session storage for preview mode on component mount
  useEffect(() => {
    const previewMode = sessionStorage.getItem('isPreviewMode') === 'true';
    setIsPreviewMode(previewMode);
  }, []);

  const { rawApiResponse, loading } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    { homepage: { brand: { logo: {} } } };
  
  // Get restaurant name from API response with fallback (using same path as Navbar)
  const { brand } = siteContent.homepage || { brand: { logo: {} } };
  const restaurantName = brand?.logo?.text || 'Pizza Palace';

  // Update document title based on restaurant name only
  useEffect(() => {
    // Don't update title while loading unless we have a fallback name
    if (loading && !restaurantName) {
      document.title = 'Loading...';
      return;
    }

    // Use only the restaurant name as the title
    const title = restaurantName;
    
    // Set the document title with preview indicator if in preview mode
    const finalTitle = isPreviewMode ? `[Preview] ${title}` : title;
    document.title = finalTitle;
    
    // Force update the title (sometimes needed for browser compatibility)
    setTimeout(() => {
      document.title = finalTitle;
    }, 100);
  }, [restaurantName, isPreviewMode, loading]);

  // Also set initial title on component mount
  useEffect(() => {
    if (!loading || restaurantName) {
      document.title = restaurantName;
    }
  }, [restaurantName, loading]);

  // Update favicon based on restaurant logo
  useEffect(() => {
    // Get the logo icon using the same data structure as the title
    const logoIcon = brand?.logo?.icon;
    
    if (logoIcon) {
      // Check if favicon link element already exists
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      
      // If it doesn't exist, create a new one
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      
      // Set the href attribute to the logo icon URL
      link.href = logoIcon;
      link.type = 'image/png'; // Adjust type based on your image format if needed
    }
  }, [brand?.logo?.icon]);

  // This component doesn't render anything visible
  return null;
}
