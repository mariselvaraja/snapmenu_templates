/**
 * Party Orders service for handling party-related API calls
 */

import { api } from './api';
import { endpoints } from '../config/endpoints';

/**
 * Party Product interface
 */
export interface PartyProduct {
  product_id: string;
  name: string;
  quantity: number;
}

/**
 * Party Order interface
 */
export interface PartyOrder {
  party_id: number;
  restaurant_id: string;
  title: string;
  description: string;
  image: string;
  products: PartyProduct[];
  no_of_serving: number;
  price: string;
  is_enabled: boolean;
  created_date: string;
}

/**
 * Party Orders API Response interface
 */
export interface PartyOrdersResponse {
  data: PartyOrder[];
}

export const partyOrdersService = {
  getPartyOrders: () => {
    const timestamp = Date.now();
    return api.get(
      endpoints.partyOrders.getAll,
      {}, // options (headers will be auto-added by api service)
      {
        type: 'website',
        _t: timestamp
      } // query parameters
    );
  },

  getPartyOrderById: (partyId: number) => {
    const timestamp = Date.now();
    return api.get(
      endpoints.partyOrders.getAll,
      {}, // options (headers will be auto-added by api service)
      {
        type: 'website',
        party_id: partyId,
        _t: timestamp
      } // query parameters
    );
  },
};

export default partyOrdersService;
