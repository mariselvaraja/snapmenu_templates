/**
 * Site content service for handling site content-related API calls
 */

import api, { ApiResponse } from './api';
import endpoints from '../config/endpoints';
import { SiteContent } from '../redux/slices/siteContentSlice';

/**
 * Service for handling site content-related operations
 */
export const siteContentService = {
  /**
   * Fetches the site content data from the API
   */
  getSiteContent: async (): Promise<{ transformedData: SiteContent, rawApiResponse: any }> => {
    console.log('Fetching site content data from API');
    
    try {
      // Check if we're in preview mode from sessionStorage
      const isPreviewMode = sessionStorage.getItem('isPreviewMode') === 'true';
      
      // Determine the folder path based on preview mode
      const folderPath = isPreviewMode ? 'preview' : 'v1';
      
      // Add folder_path parameter to the API call
      const url = `${endpoints.siteContent.getAll}${endpoints.siteContent.getAll.includes('?') ? '&' : '?'}folder_path=${folderPath}`;
      
      console.log(`Using folder_path=${folderPath} for site content API call`);
      
      const response = await api.get<any>(url);
      
      // Store the raw API response
      let rawApiResponse = response.data;
      
      // Check if response.data is a string (JSON string)
      if (typeof response.data === 'string') {
        try {
          rawApiResponse = JSON.parse(response.data);
        } catch (e) {
          console.error('Error parsing site content data JSON string:', e);
        }
      }
      
      // Transform the API response to the expected format
      const data = rawApiResponse || {};
      
      const transformedData: SiteContent = {
        about: {
          story: data.about?.story || '',
          team: data.about?.team || [],
        },
        gallery: data.gallery || [],
        events: data.events || [],
        blog: data.blog || [],
        reservation: data.reservation || {
          title: '',
          description: '',
          image: '',
        },
        contact: data.contact || {
          address: '',
          phone: '',
          email: '',
          hours: '',
          image: '',
        },
        locations: data.locations || [],
      };
      
      return { transformedData, rawApiResponse };
    } catch (error) {
      console.error('Error fetching site content data:', error);
      throw error;
    }
  },

  /**
   * Fetches a specific section of the site content
   */
  getSiteContentSection: async (section: string): Promise<any> => {
    try {
      // Check if we're in preview mode from sessionStorage
      const isPreviewMode = sessionStorage.getItem('isPreviewMode') === 'true';
      
      // Determine the folder path based on preview mode
      const folderPath = isPreviewMode ? 'preview' : 'v1';
      
      // Add folder_path and section parameters to the API call
      const url = `${endpoints.siteContent.getAll}${endpoints.siteContent.getAll.includes('?') ? '&' : '?'}folder_path=${folderPath}&section=${section}`;
      
      console.log(`Using folder_path=${folderPath} and section=${section} for site content API call`);
      
      // Make API call to get the specific section
      const response = await api.get<any>(url);
      
      // Log the section API response for debugging
      console.log(`SiteContentService: Raw API response for section "${section}"`, response);
      
      // Check if response data is valid
      if (!response.data) {
        console.warn(`SiteContentService: Empty data for section "${section}"`);
        return {};
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching site content section ${section}:`, error);
      // Return empty object instead of throwing
      return {};
    }
  }
};

export default siteContentService;
