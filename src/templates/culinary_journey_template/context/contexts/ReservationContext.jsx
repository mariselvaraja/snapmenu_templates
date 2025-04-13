import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  createReservation, 
  getTableAvailability, 
  getReservation, 
  getAvailableTimeSlots 
} from '../../services/reservationService';
import { reservationConfig } from '../../config/reservationConfig';

export const ReservationContext = createContext();

export function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
}

export function ReservationProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [config, setConfig] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  // Load configuration on mount
  useEffect(() => {
    let mounted = true;
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading reservation configuration...');
        
        // Use the local config instead of fetching from Supabase
        if (mounted) {
          console.log('Setting config from local file');
          setConfig(reservationConfig);
          console.log('Configuration loaded successfully');
        }
      } catch (err) {
        console.error('Error loading reservation configuration:', err);
        if (mounted) {
          setError(err.message || 'Error loading configuration');
          setConfig(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    loadConfig();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchTimeSlots = useCallback(async (date, partySize) => {
    if (!config) {
      console.error('Configuration not loaded');
      throw new Error('Configuration not loaded');
    }

    // Debounce check (1 second)
    const now = Date.now();
    if (now - lastFetchTime < 1000) {
      console.log('Debouncing time slot fetch');
      return;
    }

    setLoading(true);
    setError(null);
    console.log(`Fetching time slots for date: ${date}, party size: ${partySize}`);
    
    try {
      // Use the local service instead of Supabase RPC
      const slots = await getAvailableTimeSlots(date, Number(partySize));

      if (!slots || slots.length === 0) {
        console.log('No time slots available');
        setTimeSlots([]);
        return [];
      }

      console.log('Time slots fetched:', slots);
      setTimeSlots(slots);
      setLastFetchTime(now);
      return slots;
    } catch (err) {
      console.error('Error in fetchTimeSlots:', err);
      setError(err.message || 'Failed to fetch time slots');
      setTimeSlots([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [config, lastFetchTime]);

  const makeReservation = useCallback(async (reservationData) => {
    setLoading(true);
    setError(null);
    console.log('Making reservation with data:', reservationData);

    try {
      // First check availability
      const availability = await getTableAvailability(
        reservationData.date || reservationData.reservation_date,
        reservationData.time || reservationData.reservation_time,
        reservationData.party_size
      );

      if (!availability.available) {
        throw new Error(availability.message || 'Selected time slot is no longer available');
      }

      // Create the reservation
      const result = await createReservation({
        ...reservationData,
        table_id: availability.table_id
      });

      if (!result) {
        throw new Error('No result returned from server');
      }

      console.log('Reservation created successfully:', result);
      return result;
    } catch (err) {
      console.error('Error in makeReservation:', err);
      setError(err.message || 'Failed to create reservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    loading,
    error,
    config,
    timeSlots,
    fetchTimeSlots,
    makeReservation,
    getReservation,
    clearError: () => setError(null)
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}
