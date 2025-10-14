import api from './api';
import endpoints from '../config/endpoints';

export const festivalMenuService = {
  getFestivalMenu: async () => {
    try {
      // Use the same endpoint as siteContent but with folder_path=festival
      const url = `${endpoints.siteContent.getAll}${endpoints.siteContent.getAll.includes('?') ? '&' : '?'}folder_path=festival`;
      
      console.log('Fetching quick menu from:', url);
      
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching quick menu:', error);
      throw error.message || 'Failed to fetch quick menu';
    }
  }
};
