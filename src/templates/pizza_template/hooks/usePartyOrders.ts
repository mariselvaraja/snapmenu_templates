/**
 * Custom hook for managing party orders data
 */

import { useState, useCallback } from 'react';
import { partyOrdersService, PartyOrder, PartyOrdersResponse } from '../../../services/partyOrdersService';

interface UsePartyOrdersReturn {
  partyOrders: PartyOrder[];
  loading: boolean;
  error: string | null;
  fetchPartyOrders: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Type guard to check if a value is a valid PartyOrder
 */
const isValidPartyOrder = (party: any): party is PartyOrder => {
  return (
    party != null &&
    typeof party === 'object' &&
    party?.party_id != null &&
    typeof party?.title === 'string' &&
    party?.title?.trim?.()?.length > 0 &&
    typeof party?.is_enabled === 'boolean'
  );
};

/**
 * Safely extracts party orders data from API response
 */
const extractPartyOrdersData = (response: any): PartyOrder[] => {
  // Handle null/undefined response
  if (!response?.data) {
    return [];
  }

  const { data } = response;
  
  // Handle different response structures with optional chaining
  let partyOrdersArray: any[] = [];
  
  // Case 1: response.data is directly an array
  if (Array.isArray(data)) {
    partyOrdersArray = data;
  }
  // Case 2: response.data has nested data property { data: [...] }
  else if (data?.data && Array.isArray(data.data)) {
    partyOrdersArray = data.data;
  }
  // Case 3: response.data is an object with array property
  else if (typeof data === 'object' && data !== null) {
    // Look for common array property names
    const possibleArrayKeys = ['items', 'results', 'partyOrders', 'orders', 'party_orders'];
    for (const key of possibleArrayKeys) {
      if (Array.isArray(data?.[key])) {
        partyOrdersArray = data[key];
        break;
      }
    }
  }

  // Safely filter and validate party orders
  return partyOrdersArray
    ?.filter?.(isValidPartyOrder)
    ?.filter?.(party => party?.is_enabled === true) || [];
};

/**
 * Safely extracts error message from error object
 */
const extractErrorMessage = (error: any): string => {
  // Handle different error structures with optional chaining
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error?.message || 'An unknown error occurred';
  }
  
  // Handle API error objects
  return error?.message || 
         error?.error?.message || 
         error?.data?.message || 
         'Failed to fetch party orders';
};

/**
 * Custom hook for fetching and managing party orders
 */
export const usePartyOrders = (): UsePartyOrdersReturn => {
  const [partyOrders, setPartyOrders] = useState<PartyOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPartyOrders = useCallback(async () => {
    // Early return if service is not available
    if (!partyOrdersService?.getPartyOrders) {
      setError('Party orders service is not available');
      setPartyOrders([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Safe service call with optional chaining
      const response = await partyOrdersService?.getPartyOrders?.();
      
      // Extract and validate party orders data
      const validPartyOrders = extractPartyOrdersData(response);
      
      setPartyOrders(validPartyOrders);
    } catch (err) {
      // Safe error handling with optional chaining
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      setPartyOrders([]); // Reset to empty array on error
      
      // Log error for debugging (optional chaining for console methods)
      console?.error?.('Failed to fetch party orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchPartyOrders?.();
  }, [fetchPartyOrders]);

  return {
    partyOrders: partyOrders || [], // Ensure never null/undefined
    loading: loading ?? false,      // Ensure never null/undefined
    error,
    fetchPartyOrders,
    refetch,
  };
};

export default usePartyOrders;
