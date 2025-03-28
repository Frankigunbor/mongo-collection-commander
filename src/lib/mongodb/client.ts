
// This file now acts as a client to our backend API instead of connecting directly to MongoDB

// Flag to check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// API base URL - adjust this for your local development
const url =import.meta.env.VITE_API_URL;
const API_BASE_URL = `${url}`;

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
              sort: (sortCriteria) => ({
                toArray: async () => {
                  try {
                    // For simplicity, we're not fully implementing sorting on the client
                    // In a real implementation, you would send sort criteria to the backend
                    const response = await fetch(`${API_BASE_URL}/${nameToEndpoint(name)}`);
                    const data = await response.json();
                    
                    // Simplified sort implementation for demonstration
                    // Sort by createdAt descending as default behavior
                    return data.sort((a, b) => {
                      const aDate = new Date(a.createdAt || 0).getTime();
                      const bDate = new Date(b.createdAt || 0).getTime();
                      return bDate - aDate;
                    });
                  } catch (error) {
                    console.error(`Error in sort for ${name}:`, error);
                    return [];
                  }
                },
                limit: (limitCount) => ({
                  toArray: async () => {
                    try {
                      const response = await fetch(`${API_BASE_URL}/${nameToEndpoint(name)}`);
                      const data = await response.json();
                      
                      // Sort by createdAt descending as default behavior
                      const sortedData = data.sort((a, b) => {
                        const aDate = new Date(a.createdAt || 0).getTime();
                        const bDate = new Date(b.createdAt || 0).getTime();
                        return bDate - aDate;
                      });
                      
                      return sortedData.slice(0, limitCount);
                    } catch (error) {
                      console.error(`Error in limit for ${name}:`, error);
                      return [];
                    }
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
            countDocuments: async (query = {}) => {
              try {
                const response = await fetch(`${API_BASE_URL}/${nameToEndpoint(name)}`);
                const data = await response.json();
                
                if (Object.keys(query).length) {
                  return data.filter(item => {
                    return Object.keys(query).every(key => item[key] === query[key]);
                  }).length;
                }
                
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
            },
            updateOne: async (filter, update) => {
              try {
                const response = await fetch(`${API_BASE_URL}/${nameToEndpoint(name)}/${filter._id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(update.$set || update),
                });
                const result = await response.json();
                return { modifiedCount: 1, upsertedId: null };
              } catch (error) {
                console.error(`Error in updateOne for ${name}:`, error);
                return { modifiedCount: 0, upsertedId: null };
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
            sort: () => ({ 
              toArray: async () => [],
              limit: () => ({ toArray: async () => [] }) 
            }) 
          }),
          findOne: async () => null,
          countDocuments: async () => 0,
          insertOne: async () => ({ insertedId: `mock-${Date.now()}` }),
          updateOne: async () => ({ modifiedCount: 0, upsertedId: null })
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
    'UserKycDetail': 'user-kyc-details',
    'StreamChannel': 'stream-channels',
    'StreamCollection': 'stream-collections',
    'RewardCriteria': 'reward-criteria',
    'Transaction': 'transactions',
    'TransactionEntry': 'transaction-entries',
    'User': 'users',
    'Wallet': 'wallets',
    'WalletHistory': 'wallet-history',
    'VendorTransactionResponseTrail': 'vendor-responses',
    'UserReferral': 'user-referrals',
    'UserKyc': 'user-kycs',
    'UserAuth': 'user-auth'
  };
  
  return endpointMap[name] || name.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
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
