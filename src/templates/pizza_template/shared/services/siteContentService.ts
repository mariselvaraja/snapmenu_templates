/**
 * Site content service for handling site content-related API calls
 * This service transforms API data to match our application's data model
 */

import api from './api';
import endpoints from '../config/endpoints';
import { SiteContent } from '../redux/slices/siteContentSlice';

/**
 * Service for handling site content-related operations
 */
export const siteContentService = {
  /**
   * Transforms site content data to match our SiteContent interface
   * @param apiData Optional API data to transform. If not provided, will fetch from API.
   */
  getSiteContent: async (apiData?: any): Promise<SiteContent> => {
    try {
      // If no data is provided, fetch it from the API
      let data;
      if (!apiData) {
        // Make API call to get site content data
        const response = await api.get<any>(endpoints.siteContent.getAll);
        
        // Log the raw API response for debugging
        console.log('SiteContentService: Raw API response', response);
        
        // Extract the data from the response
        data = response.data;
      } else {
        data = apiData;
      }
      
      // Log the data before transformation
      console.log('SiteContentService: Data to transform', data);
      
      // Create a properly structured SiteContent object
      const transformedData: SiteContent = {
        about: {
          story: data.story?.hero?.description || '',
          team: data.story?.values?.map((value: any) => ({
            name: value.title || '',
            role: value.icon || '',
            bio: value.description || '',
            image: value.image || ''
          })) || []
        },
        gallery: data.gallery?.images?.map((image: any, index: number) => ({
          id: index + 1,
          title: image.title || '',
          image: image.image || '',
          description: image.description || ''
        })) || [],
        events: data.events?.items?.map((event: any, index: number) => ({
          id: index + 1,
          title: event.title || '',
          date: event.date || '',
          description: event.description || '',
          image: event.image || ''
        })) || [],
        blog: data.blog?.posts?.map((post: any, index: number) => ({
          id: index + 1,
          title: post.title || '',
          date: post.date || '',
          author: post.chef || '',
          content: post.content || '',
          image: post.image || '',
          excerpt: post.subtitle || ''
        })) || [],
        reservation: {
          title: data.reservation?.header?.title || '',
          description: data.reservation?.header?.description || '',
          image: data.reservation?.header?.image || ''
        },
        contact: {
          address: data.contact?.infoCards?.address ? [
            data.contact.infoCards.address.street,
            data.contact.infoCards.address.city,
            data.contact.infoCards.address.state
          ].filter(Boolean).join(', ') : '',
          phone: data.contact?.infoCards?.phone?.numbers?.[0] || '',
          email: data.contact?.infoCards?.email?.addresses?.[0] || '',
          hours: data.contact?.infoCards?.hours ? [
            data.contact.infoCards.hours.weekday,
            data.contact.infoCards.hours.weekend
          ].filter(Boolean).join('; ') : '',
          image: data.contact?.header?.image || ''
        },
        locations: data.contact?.infoCards?.address ? [{
          id: 1,
          name: data.contact.infoCards.address.label || 'Main Location',
          address: [
            data.contact.infoCards.address.street,
            data.contact.infoCards.address.city,
            data.contact.infoCards.address.state
          ].filter(Boolean).join(', '),
          phone: data.contact.infoCards.phone?.numbers?.[0] || '',
          hours: [
            data.contact.infoCards.hours?.weekday,
            data.contact.infoCards.hours?.weekend
          ].filter(Boolean).join('; '),
          image: '',
          coordinates: {
            lat: 40.7128,  // Default to NYC coordinates
            lng: -74.0060
          }
        }] : []
      };
      
      // Log the transformed data for debugging
      console.log('SiteContentService: Transformed data', transformedData);
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching site content:', error);
      throw error;
    }
  },

  /**
   * Fetches a specific section of the site content
   */
  getSiteContentSection: async (section: string): Promise<any> => {
    try {
      // Make API call to get the specific section
      const response = await api.get<any>(endpoints.siteContent.getSection(section));
      
      // Log the section API response for debugging
      console.log(`SiteContentService: Raw API response for section "${section}"`, response);
      console.log(`SiteContentService: API response data for section "${section}"`, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching site content section ${section}:`, error);
      throw error;
    }
  },
};

export default siteContentService;
