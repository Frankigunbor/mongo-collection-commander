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

// KYC Data - Now using UserKycDetail
app.get('/api/kyc', async (req, res) => {
  try {
    const kycCollection = db.collection('UserKycDetail');
    const result = await kycCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stream Channels
app.get('/api/stream-channels', async (req, res) => {
  try {
    const streamChannelCollection = db.collection('StreamChannel');
    const result = await streamChannelCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stream Collections
app.get('/api/stream-collections', async (req, res) => {
  try {
    const streamCollectionCollection = db.collection('StreamCollection');
    const result = await streamCollectionCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reward Criteria
app.get('/api/reward-criteria', async (req, res) => {
  try {
    const rewardCriteriaCollection = db.collection('RewardCriteria');
    const result = await rewardCriteriaCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction Data
app.get('/api/transactions', async (req, res) => {
  try {
    const transactionCollection = db.collection('Transaction');
    const result = await transactionCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const transactionData = req.body;
    // Ensure amount is stored as is (already multiplied by 100 in the client)
    
    const transactionCollection = db.collection('Transaction');
    
    const newTransaction = {
      _id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      actionId: transactionData.actionId || `action-${Date.now()}`,
      reference: transactionData.reference || `REF-${Date.now()}`,
      amount: transactionData.amount || 0,
      currency: transactionData.currency || "CAD",
      senderAccountId: transactionData.senderAccountId || "",
      recipientAccountId: transactionData.recipientAccountId || "",
      transactionType: transactionData.transactionType || "TRANSFER",
      transactionStatus: transactionData.transactionStatus || "PENDING",
      transactionSource: transactionData.transactionSource || "WEB_APP",
      userId: transactionData.userId || "",
      narration: transactionData.narration || "",
      requeryCount: transactionData.requeryCount || 0,
      processingMessage: transactionData.processingMessage || "",
      vendor: transactionData.vendor || "",
      vendorReference: transactionData.vendorReference || "",
      conversionRate: transactionData.conversionRate || 1,
      completedAt: transactionData.completedAt || ""
    };
    
    await transactionCollection.insertOne(newTransaction);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transactionData = req.body;
    
    const transactionCollection = db.collection('Transaction');
    
    // Ensure amount is stored as is (already multiplied by 100 in the client)
    const updatedTransaction = {
      ...transactionData,
      updatedAt: new Date().toISOString()
    };
    
    const result = await transactionCollection.updateOne(
      { _id: id },
      { $set: updatedTransaction }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction Entries
app.get('/api/transaction-entries', async (req, res) => {
  try {
    const entriesCollection = db.collection('TransactionEntry');
    const result = await entriesCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Data
app.get('/api/users', async (req, res) => {
  try {
    const userCollection = db.collection('User');
    const result = await userCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Wallet Data
app.get('/api/wallets', async (req, res) => {
  try {
    const walletCollection = db.collection('Wallet');
    const result = await walletCollection.find({}).sort({ updatedAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Wallet History
app.get('/api/wallet-history', async (req, res) => {
  try {
    const historyCollection = db.collection('WalletHistory');
    const result = await historyCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor Transaction Response Trail
app.get('/api/vendor-responses', async (req, res) => {
  try {
    const vendorCollection = db.collection('VendorTransactionResponseTrail');
    const result = await vendorCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Referrals
app.get('/api/user-referrals', async (req, res) => {
  try {
    const referralCollection = db.collection('UserReferral');
    const result = await referralCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User KYC Details
app.get('/api/user-kyc-details', async (req, res) => {
  try {
    const kycDetailCollection = db.collection('UserKycDetail');
    const result = await kycDetailCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User KYC
app.get('/api/user-kycs', async (req, res) => {
  try {
    const userKycCollection = db.collection('UserKyc');
    const result = await userKycCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Auth
app.get('/api/user-auth', async (req, res) => {
  try {
    const authCollection = db.collection('UserAuth');
    const result = await authCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userCollection = db.collection('User');
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
    
    const userCollection = db.collection('User');
    
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

// Recent User Activities
app.get('/api/recent-user-activities', async (req, res) => {
  try {
    const activityCollection = db.collection('RecentUserActivity');
    const result = await activityCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Recent User Activity
app.put('/api/recent-user-activities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const activityData = req.body;
    
    const activityCollection = db.collection('RecentUserActivity');
    
    const updatedActivity = {
      ...activityData,
      updatedAt: new Date().toISOString()
    };
    
    const result = await activityCollection.updateOne(
      { _id: id },
      { $set: updatedActivity }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Activity not found" });
    }
    
    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const userCollection = db.collection('User');
    const transactionCollection = db.collection('Transaction');
    const kycCollection = db.collection('UserKycDetail');
    
    const totalUsers = await userCollection.countDocuments();
    const activeUsers = await userCollection.countDocuments({ status: "ACTIVE" });
    const transactions = await transactionCollection.find({}).toArray();
    const totalTransactions = transactions.length;
    
    // Divide amounts by 100 for display
    const totalAmount = transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0) / 100, 0);
    const pendingKyc = 12; // Placeholder
    const completedKyc = await kycCollection.countDocuments();
    
    const recentTransactions = await transactionCollection.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
      
    const recentUserActivityCollection = db.collection('RecentUserActivity');
    const recentActivities = await recentUserActivityCollection.find({})
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
