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
      const response = await api.get<any>(endpoints.siteContent.getAll);
      
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
};

export default siteContentService;
