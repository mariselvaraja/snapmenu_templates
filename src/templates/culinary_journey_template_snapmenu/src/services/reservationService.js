import axios from 'axios';
import { reservationConfig, generateTimeSlots } from '../config/reservationConfig';
import { format } from 'date-fns';

// In-memory storage for reservations
const reservations = [];
const tables = [
  { id: '1', number: 1, capacity: 2, section: 'Main', status: 'available' },
  { id: '2', number: 2, capacity: 4, section: 'Main', status: 'available' },
  { id: '3', number: 3, capacity: 6, section: 'Main', status: 'available' },
  { id: '4', number: 4, capacity: 8, section: 'Main', status: 'available' },
  { id: '5', number: 5, capacity: 10, section: 'Main', status: 'available' },
];

/**
 * Create a new reservation
 * @param {Object} data - Reservation data
 * @returns {Promise<Object>} - Created reservation
 */
export async function createReservation(data) {
  console.log('Creating reservation with data:', data);

  const api = "https://appliance.genaiembed.ai/p5093"

  try {
    // Find an available table
    const tableId = data.table_id || findAvailableTable(Number(data.party_size));
    
    // Prepare the payload for the API
    const payload = {
      restaurant_id: sessionStorage.getItem('rid'),
      table_id: tableId,
      reservation_time: data.time || data.reservation_time,
      party_size: Number(data.party_size),
      customer_name: data.customer_name,
      customer_phone: data.customer_phone || data.phone,
      customer_email: data.customer_email || data.email,
      notes: data.special_requests || ""
    };
    
    console.log('Sending reservation request to API:', payload);
    
    // Call the API endpoint
    const response = await axios.post(api+'/table/reservations', payload);
    
    // If the API call is successful, create a local reservation object
    if (response.data && response.data.status === "Reserved") {
      // Generate a unique ID
      const id = Math.random().toString(36).substring(2, 15);
      const tableNumber = tables.find(t => t.id === tableId)?.number || 1;
      
      // Create the reservation object
      const reservation = {
        id,
        reservation_date: data.date || data.reservation_date,
        reservation_time: data.time || data.reservation_time,
        party_size: Number(data.party_size),
        customer_name: data.customer_name,
        customer_email: data.customer_email || data.email,
        customer_phone: data.customer_phone || data.phone,
        special_requests: data.special_requests,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        table: {
          id: tableId,
          number: tableNumber,
          capacity: Number(data.party_size),
          section: "Main",
          status: "reserved"
        }
      };
      
      // Store the reservation
      reservations.push(reservation);
      
      console.log('Reservation created successfully:', reservation);
      return reservation;
    } else {
      throw new Error('Failed to create reservation: ' + (response.data?.detail || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error in createReservation:', error);
    throw error;
  }
}

/**
 * Find an available table for the given party size
 * @param {number} partySize - Number of guests
 * @returns {string} - Table ID
 */
function findAvailableTable(partySize) {
  // Find the smallest table that can accommodate the party
  const availableTable = tables
    .filter(table => table.status === 'available' && table.capacity >= partySize)
    .sort((a, b) => a.capacity - b.capacity)[0];
  
  return availableTable?.id || '1';
}

/**
 * Get all reservations for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} - List of reservations
 */
export async function getReservations(startDate, endDate) {
  console.log('Fetching reservations:', { startDate, endDate });

  try {
    // Filter reservations by date range
    const filteredReservations = reservations.filter(reservation => {
      return reservation.reservation_date >= startDate && 
             reservation.reservation_date <= endDate;
    });
    
    console.log('Fetched reservations:', filteredReservations);
    return filteredReservations;
  } catch (error) {
    console.error('Error in getReservations:', error);
    throw error;
  }
}

/**
 * Update a reservation's status
 * @param {string} id - Reservation ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated reservation
 */
export async function updateReservationStatus(id, status) {
  console.log('Updating reservation status:', { id, status });

  try {
    // Find the reservation
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('No reservation found with the provided ID');
    }
    
    // Update the status
    reservations[index].status = status;
    
    console.log('Reservation status updated:', reservations[index]);
    return reservations[index];
  } catch (error) {
    console.error('Error in updateReservationStatus:', error);
    throw error;
  }
}

/**
 * Get a reservation by ID
 * @param {string} id - Reservation ID
 * @returns {Promise<Object>} - Reservation details
 */
export async function getReservation(id) {
  console.log('Fetching reservation:', id);

  try {
    // Find the reservation
    const reservation = reservations.find(r => r.id === id);
    
    // If no reservation found, create a mock one for demo purposes
    if (!reservation) {
      const mockReservation = {
        id,
        reservation_date: format(new Date(), 'yyyy-MM-dd'),
        reservation_time: '19:00',
        party_size: 4,
        customer_name: 'John Doe',
        customer_email: 'john.doe@example.com',
        customer_phone: '(555) 123-4567',
        special_requests: 'Window seat if possible',
        status: 'confirmed',
        created_at: new Date().toISOString(),
        table: {
          id: '2',
          number: 2,
          capacity: 4,
          section: 'Main',
          status: 'reserved'
        }
      };
      
      // Add to reservations array for future reference
      reservations.push(mockReservation);
      
      console.log('Created mock reservation:', mockReservation);
      return mockReservation;
    }
    
    console.log('Fetched reservation:', reservation);
    return reservation;
  } catch (error) {
    console.error('Error in getReservation:', error);
    throw error;
  }
}

/**
 * Check if a table is available for the given date, time, and party size
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {string} time - Time (HH:MM)
 * @param {number} partySize - Number of guests
 * @returns {Promise<Object>} - Availability result
 */
export async function getTableAvailability(date, time, partySize) {
  console.log('Checking table availability:', { date, time, partySize });

  try {
    // For demo purposes, always return available
    const result = { 
      available: true, 
      message: 'Table available', 
      table_id: findAvailableTable(Number(partySize))
    };
    
    console.log('Table availability result:', result);
    return result;
  } catch (error) {
    console.error('Error in getTableAvailability:', error);
    throw error;
  }
}

/**
 * Get available time slots for a given date and party size
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {number} partySize - Number of guests
 * @returns {Promise<Array>} - List of time slots
 */
export async function getAvailableTimeSlots(date, partySize) {
  console.log('Getting available time slots:', { date, partySize });
  
  try {
    // Get day of week
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    // Generate time slots based on operating hours
    const allTimeSlots = generateTimeSlots(dayOfWeek, date);
    
    // For demo purposes, mark some slots as unavailable
    const availableTimeSlots = allTimeSlots.map(time => ({
      time: time + ':00', // Add seconds for consistent format
      available: Math.random() > 0.3 // 70% chance of being available
    }));
    
    console.log('Available time slots:', availableTimeSlots);
    return availableTimeSlots;
  } catch (error) {
    console.error('Error in getAvailableTimeSlots:', error);
    throw error;
  }
}
