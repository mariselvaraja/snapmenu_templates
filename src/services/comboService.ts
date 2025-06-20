import { api } from './api';
import { endpoints } from '../config/endpoints';

export const comboService = {
  getCombos: () => {
    const timestamp = Date.now();
    return api.get(
      endpoints.combo.getAll, 
      {}, // options (headers will be auto-added by api service)
      { 
        type: 'website',
        _t: timestamp 
      } // query parameters
    );
  },
};
