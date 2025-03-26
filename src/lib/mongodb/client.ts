
import { MongoClient, ServerApiVersion } from 'mongodb';

// Flag to check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// MongoDB connection URI
// NOTE: In a production environment, this should be stored in environment variables
// and accessed through a backend service, not exposed in the frontend
const uri = "mongodb+srv://admin:3iHpVd6snupiW8M0@cluster0.ggagjiv.mongodb.net/broadsend-backend?retryWrites=true";

// Create a MongoClient only if not in browser
const client = !isBrowser 
  ? new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    })
  : null;

// Mock database reference for browser environment
let mockDb: any = null;

export async function connectToDatabase() {
  if (isBrowser) {
    console.log("Browser environment detected, using mock database");
    // Create a mock database for browser environment
    mockDb = mockDb || {
      collection: (name: string) => ({
        find: () => ({ 
          toArray: async () => [], 
          sort: () => ({ limit: () => ({ toArray: async () => [] }) }) 
        }),
        findOne: async () => null,
        countDocuments: async () => 0,
        insertOne: async () => ({ insertedId: `mock-${Date.now()}` })
      })
    };
    return mockDb;
  }

  try {
    // Connect the client to the server (only in Node.js environment)
    await client?.connect();
    console.log("Connected to MongoDB");
    return client?.db("broadsend-backend");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Create a function to close the connection
export async function closeDatabaseConnection() {
  if (isBrowser) {
    console.log("Browser environment: No MongoDB connection to close");
    return;
  }

  try {
    await client?.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}
