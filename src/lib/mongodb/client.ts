
// This file now acts as a client to our backend API instead of connecting directly to MongoDB

// Flag to check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// API base URL - adjust this for your local development
const API_BASE_URL = 'http://localhost:5000/api';

// Function to check connection status
export async function checkConnectionStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking MongoDB connection:", error);
    return { status: 'error', message: error.message };
  }
}

// Mock function to maintain the same interface
export async function connectToDatabase() {
  if (isBrowser) {
    console.log("Using API backend to connect to MongoDB");
    try {
      const status = await checkConnectionStatus();
      if (status.status === 'connected') {
        return {
          collection: (name) => ({
            find: () => ({
              toArray: async () => {
                const response = await fetch(`${API_BASE_URL}/${nameToEndpoint(name)}`);
                return await response.json();
              },
              sort: () => ({
                limit: () => ({
                  toArray: async () => {
                    const response = await fetch(`${API_BASE_URL}/${nameToEndpoint(name)}`);
                    const data = await response.json();
                    return data.slice(0, 5); // Simple mock for limit
                  }
                })
              })
            }),
            findOne: async (query) => {
              try {
                // For simplicity, we're not handling complex queries here
                // In a real implementation, you would send the query to the backend
                const response = await fetch(`${API_BASE_URL}/${nameToEndpoint(name)}`);
                const data = await response.json();
                if (query && Object.keys(query).length) {
                  return data.find(item => {
                    return Object.keys(query).every(key => {
                      if (typeof query[key] === 'object') {
                        // Handle regex or other complex query operators
                        // This is a simplified implementation
                        return true;
                      }
                      return item[key] === query[key];
                    });
                  }) || null;
                }
                return data[0] || null;
              } catch (error) {
                console.error(`Error in findOne for ${name}:`, error);
                return null;
              }
            },
            countDocuments: async () => {
              try {
                const response = await fetch(`${API_BASE_URL}/${nameToEndpoint(name)}`);
                const data = await response.json();
                return data.length;
              } catch (error) {
                console.error(`Error in countDocuments for ${name}:`, error);
                return 0;
              }
            },
            insertOne: async (document) => {
              try {
                const response = await fetch(`${API_BASE_URL}/${nameToEndpoint(name)}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(document),
                });
                const result = await response.json();
                return { insertedId: result._id || `mock-${Date.now()}` };
              } catch (error) {
                console.error(`Error in insertOne for ${name}:`, error);
                return { insertedId: `mock-${Date.now()}` };
              }
            }
          })
        };
      } else {
        throw new Error(status.message || 'Failed to connect to MongoDB via API');
      }
    } catch (error) {
      console.error("Error connecting to MongoDB via API:", error);
      // Return mock database as fallback
      return {
        collection: (name) => ({
          find: () => ({ 
            toArray: async () => [], 
            sort: () => ({ limit: () => ({ toArray: async () => [] }) }) 
          }),
          findOne: async () => null,
          countDocuments: async () => 0,
          insertOne: async () => ({ insertedId: `mock-${Date.now()}` })
        })
      };
    }
  } else {
    // This code should never run in the browser
    throw new Error("Direct MongoDB connection is not supported in the browser");
  }
}

// Helper function to convert collection name to API endpoint
function nameToEndpoint(name) {
  const endpointMap = {
    'kyc_data': 'kyc',
    'activity_data': 'activities',
    'reward_data': 'rewards',
    'transaction_data': 'transactions',
    'transaction_entry_data': 'transaction-entries',
    'user_data': 'users',
    'wallet_data': 'wallets',
    'wallet_history_data': 'wallet-history',
    'vendor_transaction_response_trail_data': 'vendor-responses',
    'user_referral_data': 'user-referrals',
    'user_kyc_detail_data': 'user-kyc-details',
    'user_kyc_data': 'user-kycs',
    'user_auth_data': 'user-auth'
  };
  
  return endpointMap[name] || name.replace('_data', '').replace('_', '-');
}

// Function to handle authentication
export async function authenticateUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
}

// Function to handle registration
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Create a function to close the connection (mock for API client)
export async function closeDatabaseConnection() {
  console.log("API client: No actual connection to close");
  return;
}
