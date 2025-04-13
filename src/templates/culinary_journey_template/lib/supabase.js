// Mock Supabase client implementation
// This file replaces the actual Supabase client with a mock implementation
// that mimics the Supabase API but doesn't actually connect to Supabase

console.log('Using mock Supabase client');

// Mock data for reservations
const mockReservations = [];
const mockWaitlist = [];
const mockTables = [
  { id: '1', number: 1, capacity: 2, section: 'main', status: 'available' },
  { id: '2', number: 2, capacity: 4, section: 'main', status: 'available' },
  { id: '3', number: 3, capacity: 6, section: 'main', status: 'available' },
  { id: '4', number: 4, capacity: 8, section: 'main', status: 'available' },
];

// Mock configuration
const mockConfigurations = {
  reservation: {
    openingTime: '11:00',
    closingTime: '22:00',
    timeSlotInterval: 30,
    maxPartySize: 10,
    minPartySize: 1,
    maxDaysInAdvance: 30,
  }
};

// Helper function to create a query builder
const createQueryBuilder = (table, initialData = []) => {
  let data = [...initialData];
  let filters = [];
  let selectedFields = '*';
  let orderByField = null;
  let orderDirection = 'asc';
  let limitCount = null;
  let singleResult = false;

  const builder = {
    // Select fields
    select: (fields) => {
      selectedFields = fields;
      return builder;
    },

    // Filter by equality
    eq: (field, value) => {
      filters.push(item => item[field] === value);
      return builder;
    },

    // Filter by greater than or equal
    gte: (field, value) => {
      filters.push(item => item[field] >= value);
      return builder;
    },

    // Filter by less than or equal
    lte: (field, value) => {
      filters.push(item => item[field] <= value);
      return builder;
    },

    // Order results
    order: (field, { ascending = true } = {}) => {
      orderByField = field;
      orderDirection = ascending ? 'asc' : 'desc';
      return builder;
    },

    // Limit results
    limit: (count) => {
      limitCount = count;
      return builder;
    },

    // Return a single result
    single: () => {
      singleResult = true;
      return builder;
    },

    // Insert data
    insert: (items) => {
      const newItems = items.map(item => ({
        id: Math.random().toString(36).substring(2, 15),
        ...item
      }));
      data = [...data, ...newItems];
      
      return {
        select: (fields) => {
          selectedFields = fields;
          return {
            single: () => {
              return Promise.resolve({
                data: singleResult ? newItems[0] : newItems,
                error: null
              });
            },
            then: (callback) => {
              return Promise.resolve({
                data: singleResult ? newItems[0] : newItems,
                error: null
              }).then(callback);
            }
          };
        },
        then: (callback) => {
          return Promise.resolve({
            data: newItems,
            error: null
          }).then(callback);
        }
      };
    },

    // Update data
    update: (updates) => {
      return {
        eq: (field, value) => {
          const index = data.findIndex(item => item[field] === value);
          if (index !== -1) {
            data[index] = { ...data[index], ...updates };
          }
          
          return {
            select: (fields) => {
              selectedFields = fields;
              return {
                single: () => {
                  return Promise.resolve({
                    data: index !== -1 ? data[index] : null,
                    error: null
                  });
                }
              };
            },
            then: (callback) => {
              return Promise.resolve({
                data: index !== -1 ? data[index] : null,
                error: null
              }).then(callback);
            }
          };
        }
      };
    },

    // Execute the query
    then: (callback) => {
      // Apply filters
      let result = data;
      for (const filter of filters) {
        result = result.filter(filter);
      }

      // Apply ordering
      if (orderByField) {
        result.sort((a, b) => {
          if (orderDirection === 'asc') {
            return a[orderByField] < b[orderByField] ? -1 : 1;
          } else {
            return a[orderByField] > b[orderByField] ? -1 : 1;
          }
        });
      }

      // Apply limit
      if (limitCount !== null) {
        result = result.slice(0, limitCount);
      }

      // Return single result if requested
      if (singleResult) {
        result = result.length > 0 ? result[0] : null;
      }

      return Promise.resolve({
        data: result,
        error: null
      }).then(callback);
    }
  };

  return builder;
};

// Create a mock client
const createMockClient = () => {
  return {
    from: (table) => {
      switch (table) {
        case 'reservations':
          return createQueryBuilder(table, mockReservations);
        case 'waitlist':
          return createQueryBuilder(table, mockWaitlist);
        case 'tables':
          return createQueryBuilder(table, mockTables);
        case 'configurations':
          return {
            select: () => ({
              eq: (field, value) => ({
                single: () => {
                  if (field === 'key' && value === 'reservation') {
                    return Promise.resolve({
                      data: { value: mockConfigurations.reservation },
                      error: null
                    });
                  }
                  return Promise.resolve({
                    data: null,
                    error: { message: 'Configuration not found' }
                  });
                }
              })
            })
          };
        default:
          return createQueryBuilder(table, []);
      }
    },
    
    rpc: (functionName, params = {}) => {
      if (functionName === 'check_table_availability') {
        const { p_date, p_time, p_party_size } = params;
        // Simple mock implementation that always returns available
        return Promise.resolve({
          data: [{ 
            available: true, 
            message: 'Table available', 
            table_id: mockTables[0].id 
          }],
          error: null
        });
      }
      
      if (functionName === 'get_available_time_slots') {
        // Generate mock time slots
        const slots = [];
        const startTime = new Date(`2000-01-01T${mockConfigurations.reservation.openingTime}`);
        const endTime = new Date(`2000-01-01T${mockConfigurations.reservation.closingTime}`);
        const interval = mockConfigurations.reservation.timeSlotInterval * 60 * 1000; // convert to ms
        
        for (let time = startTime.getTime(); time < endTime.getTime(); time += interval) {
          const date = new Date(time);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = '00'; // Add seconds for consistent format
          const timeString = `${hours}:${minutes}:${seconds}`;
          
          slots.push({
            time: timeString, // Use 'time' instead of 'slot_time' to match what the component expects
            available: Math.random() > 0.3 // 70% chance of being available
          });
        }
        
        return Promise.resolve({
          data: slots,
          error: null
        });
      }
      
      if (functionName === 'begin_transaction' || 
          functionName === 'commit_transaction' || 
          functionName === 'rollback_transaction') {
        return Promise.resolve({
          data: null,
          error: null
        });
      }
      
      return Promise.resolve({
        data: null,
        error: { message: `Function ${functionName} not implemented in mock` }
      });
    },
    
    auth: {
      getUser: () => {
        return Promise.resolve({
          data: { user: null },
          error: null
        });
      },
      getSession: () => {
        return Promise.resolve({
          data: { session: null },
          error: null
        });
      },
      signInWithPassword: () => {
        return Promise.resolve({
          data: { user: null, session: null },
          error: null
        });
      },
      signOut: () => {
        return Promise.resolve({
          error: null
        });
      },
      updateUser: () => {
        return Promise.resolve({
          data: { user: { user_metadata: { role: 'admin' } } },
          error: null
        });
      },
      onAuthStateChange: (callback) => {
        // Mock auth state change
        setTimeout(() => {
          callback('SIGNED_OUT', null);
        }, 0);
        
        return {
          data: { subscription: { unsubscribe: () => {} } },
          error: null
        };
      }
    }
  };
};

// Create mock clients without any environment variable dependencies
const mockClient = createMockClient();

// Export the mock clients
export const authClient = mockClient;
export const publicClient = mockClient;
export const supabase = mockClient;

console.log('Mock Supabase clients initialized without environment variables');
