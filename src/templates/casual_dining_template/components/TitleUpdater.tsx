import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../shared/redux';

/**
 * Component that updates the document title based on the current page and restaurant name
 * Also adds a preview indicator when in preview mode
 */
export default function TitleUpdater() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Check session storage for preview mode on component mount
  useEffect(() => {
    const previewMode = sessionStorage.getItem('isPreviewMode') === 'true';
    setIsPreviewMode(previewMode);
  }, []);
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Simplified brand name logic
  const restaurantName = rawApiResponse?.homepage?.brand?.name || 
                         rawApiResponse?.navigationBar?.brand?.name || 
                         'Restaurant';
  
  const location = useLocation();
  const params = useParams();
  
  // Get blog posts if available
  const blog = rawApiResponse?.blog || { posts: [] };
  
  // Get menu items from Redux store for product detail pages
  const menuItems = useAppSelector(state => state.menu.items);

  useEffect(() => {
    let title = restaurantName;
    
    // Check if we're on a blog post page
    if (location.pathname.startsWith('/blog/') && params.id && blog?.posts) {
      const blogPost = blog.posts.find((post: any) => post.id === params.id);
      if (blogPost) {
        title = `${blogPost.title} | ${restaurantName}`;
      } else {
        title = `Blog | ${restaurantName}`;
      }
    } 
    // Check if we're on a product detail page
    else if (location.pathname.startsWith('/product/') && params.productId && menuItems.length > 0) {
      const productId = parseInt(params.productId);
      const product = menuItems.find(item => item.id === productId);
      if (product) {
        title = `${product.name} | ${restaurantName}`;
      } else {
        title = `Menu | ${restaurantName}`;
      }
    }
    // For other pages, use the page name from the path
    else {
      const pageName = getPageNameFromPath(location.pathname);
      if (pageName) {
        title = `${pageName} | ${restaurantName}`;
      }
    }
    
    // Set the document title with preview indicator if in preview mode
    document.title = isPreviewMode ? `[Preview] ${title}` : title;
  }, [location.pathname, restaurantName, params, blog, menuItems, isPreviewMode]);

  // Helper function to get the page name from the path
  const getPageNameFromPath = (path: string): string => {
    // Remove leading slash and get the first segment
    const segment = path.substring(1).split('/')[0];
    
    if (!segment) return 'Home';
    
    // Capitalize the first letter of each word
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // This component doesn't render anything
  return null;
}
