
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = process.env.MONGODB_URI || "mongodb+srv://admin:3iHpVd6snupiW8M0@cluster0.ggagjiv.mongodb.net/broadsend-backend?retryWrites=true";

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database connection
let db;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("broadsend-backend");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// API Routes

// Get database status
app.get('/api/status', async (req, res) => {
  try {
    if (!db) {
      await connectToDatabase();
    }
    res.json({ status: 'connected', database: 'broadsend-backend' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// KYC Data
app.get('/api/kyc', async (req, res) => {
  try {
    const kycCollection = db.collection('kyc_data');
    const result = await kycCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activity Data
app.get('/api/activities', async (req, res) => {
  try {
    const activityCollection = db.collection('activity_data');
    const result = await activityCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reward Data
app.get('/api/rewards', async (req, res) => {
  try {
    const rewardCollection = db.collection('reward_data');
    const result = await rewardCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction Data
app.get('/api/transactions', async (req, res) => {
  try {
    const transactionCollection = db.collection('transaction_data');
    const result = await transactionCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction Entries
app.get('/api/transaction-entries', async (req, res) => {
  try {
    const entriesCollection = db.collection('transaction_entry_data');
    const result = await entriesCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Data
app.get('/api/users', async (req, res) => {
  try {
    const userCollection = db.collection('user_data');
    const result = await userCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Wallet Data
app.get('/api/wallets', async (req, res) => {
  try {
    const walletCollection = db.collection('wallet_data');
    const result = await walletCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Wallet History
app.get('/api/wallet-history', async (req, res) => {
  try {
    const historyCollection = db.collection('wallet_history_data');
    const result = await historyCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor Transaction Response Trail
app.get('/api/vendor-responses', async (req, res) => {
  try {
    const vendorCollection = db.collection('vendor_transaction_response_trail_data');
    const result = await vendorCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Referrals
app.get('/api/user-referrals', async (req, res) => {
  try {
    const referralCollection = db.collection('user_referral_data');
    const result = await referralCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User KYC Details
app.get('/api/user-kyc-details', async (req, res) => {
  try {
    const kycDetailCollection = db.collection('user_kyc_detail_data');
    const result = await kycDetailCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User KYC
app.get('/api/user-kycs', async (req, res) => {
  try {
    const userKycCollection = db.collection('user_kyc_data');
    const result = await userKycCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Auth
app.get('/api/user-auth', async (req, res) => {
  try {
    const authCollection = db.collection('user_auth_data');
    const result = await authCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userCollection = db.collection('user_data');
    const user = await userCollection.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In a real implementation, you would verify the password hash
    // For now, we'll just accept any password for the demo
    return res.json({
      user,
      token: `jwt-token-${user._id}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const userData = req.body;
    
    const userCollection = db.collection('user_data');
    
    // Check if user already exists
    const existingUser = await userCollection.findOne({ email: userData.email?.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    
    const newUser = {
      _id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userPhoneNumber: userData.userPhoneNumber || "",
      userPhoneNumberCountryCode: userData.userPhoneNumberCountryCode || "+1",
      status: "ACTIVE",
      userPhoneNumberActivated: false,
      userEmailActivated: false,
      securityQuestionEnabled: false,
      transactionPinEnabled: false,
      countryCurrencyCode: userData.countryCurrencyCode || "CAD",
      verificationVendorReference: "",
      firstName: userData.firstName || "",
      middleName: userData.middleName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      fcmRegistrationToken: "",
      userGroup: "USER"
    };
    
    await userCollection.insertOne(newUser);
    
    return res.status(201).json({
      user: newUser,
      token: `jwt-token-${newUser._id}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const userCollection = db.collection('user_data');
    const transactionCollection = db.collection('transaction_data');
    const kycCollection = db.collection('kyc_data');
    
    const totalUsers = await userCollection.countDocuments();
    const activeUsers = await userCollection.countDocuments({ status: "ACTIVE" });
    const transactions = await transactionCollection.find({}).toArray();
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const pendingKyc = 12; // Placeholder
    const completedKyc = await kycCollection.countDocuments();
    
    const recentTransactions = await transactionCollection.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
      
    const activityCollection = db.collection('activity_data');
    const recentActivities = await activityCollection.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    res.json({
      totalUsers,
      activeUsers,
      totalTransactions,
      totalAmount,
      pendingKyc,
      completedKyc,
      recentTransactions,
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database. Server not started.');
    process.exit(1);
  }
}

startServer();

// Close the connection when the server is terminated
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});
