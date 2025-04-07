import axios from 'axios';

// Base URL for the API
const API_URL = 'https://appliance.genaiembed.ai';

/**
 * Create a new reservation
 * @param {Object} reservationData The reservation details
 * @returns {Promise<Object>} The created reservation with confirmation details
 */
export const createReservation = async (reservationData) => {
  try {
    // Format the data for the API
    const payload = {
      restaurant_id: sessionStorage.getItem("restaurant_id") || "1", // Get from session storage or use default
      table_id: reservationData.tableNumber.toString(),
      reservation_time: `${reservationData.date} ${reservationData.time}`,
      party_size: reservationData.guests,
      customer_name: reservationData.name,
      customer_email: reservationData.email,
      customer_phone: reservationData.phone,
      notes: reservationData.specialRequests || ""
    };

    // Make the API call
    const response = await axios.post(`${API_URL}/table/reservations`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Process the response
    const result = {
      id: response.data.id || Math.random().toString(36).substring(2, 15),
      name: reservationData.name,
      email: reservationData.email,
      phone: reservationData.phone,
      date: reservationData.date,
      time: reservationData.time,
      guests: reservationData.guests,
      tableNumber: reservationData.tableNumber,
      specialRequests: reservationData.specialRequests,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    return result;
  } catch (error) {
    console.error('Error creating reservation:', error);
    
    // For development/demo purposes, return a mock successful response
    // In production, you would want to throw the error
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using mock reservation data due to API error');
      return {
        id: Math.random().toString(36).substring(2, 15),
        name: reservationData.name,
        email: reservationData.email,
        phone: reservationData.phone,
        date: reservationData.date,
        time: reservationData.time,
        guests: reservationData.guests,
        tableNumber: reservationData.tableNumber,
        specialRequests: reservationData.specialRequests,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
    }
    
    throw error;
  }
};

/**
 * Get a reservation by ID
 * @param {string} id The reservation ID
 * @returns {Promise<Object>} The reservation details
 */
export const getReservation = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/table/reservations/${id}`);
    
    // Process the response
    const data = response.data;
    
    return {
      id: data.id,
      name: data.customer_name,
      email: data.customer_email,
      phone: data.customer_phone,
      date: data.reservation_date,
      time: data.reservation_time,
      guests: data.party_size,
      tableNumber: data.table_id,
      specialRequests: data.notes,
      status: data.status,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error getting reservation:', error);
    
    // For development/demo purposes, return a mock response
    // In production, you would want to throw the error
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using mock reservation data due to API error');
      return {
        id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        date: '2025-03-20',
        time: '19:00',
        guests: 4,
        tableNumber: 12,
        specialRequests: 'Window seat if possible',
        status: 'confirmed',
        createdAt: '2025-03-13T12:00:00Z'
      };
    }
    
    throw error;
  }
};

/**
 * Update a reservation's status
 * @param {string} id The reservation ID
 * @param {string} status The new status
 * @returns {Promise<Object>} The updated reservation
 */
export const updateReservationStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/table/reservations/${id}`, { status });
    
    // Process the response
    const data = response.data;
    
    return {
      id: data.id,
      name: data.customer_name,
      email: data.customer_email,
      phone: data.customer_phone,
      date: data.reservation_date,
      time: data.reservation_time,
      guests: data.party_size,
      tableNumber: data.table_id,
      specialRequests: data.notes,
      status: data.status,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error updating reservation status:', error);
    
    // For development/demo purposes, return a mock response
    // In production, you would want to throw the error
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using mock reservation data due to API error');
      return {
        id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        date: '2025-03-20',
        time: '19:00',
        guests: 4,
        tableNumber: 12,
        specialRequests: 'Window seat if possible',
        status,
        createdAt: '2025-03-13T12:00:00Z'
      };
    }
    
    throw error;
  }
};
