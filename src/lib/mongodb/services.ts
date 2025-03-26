
import { connectToDatabase } from './client';
import { 
  KycData, 
  ActivityData, 
  RewardData, 
  TransactionData,
  TransactionEntryData,
  UserData,
  WalletData,
  WalletHistoryData,
  VendorTransactionResponseTrailData,
  UserReferralData,
  UserKycDetailData,
  UserKycData,
  UserAuthData
} from '../api';

// Helper function to safely cast MongoDB documents to our types
function castToType<T>(documents: any[]): T[] {
  return documents as unknown as T[];
}

// Kyc collection functions
export async function getKycData(): Promise<KycData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('kyc_data');
    const result = await collection.find({}).toArray();
    return castToType<KycData>(result);
  } catch (error) {
    console.error("Error fetching KYC data:", error);
    throw error;
  }
}

// Activity collection functions
export async function getActivityData(): Promise<ActivityData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('activity_data');
    const result = await collection.find({}).toArray();
    return castToType<ActivityData>(result);
  } catch (error) {
    console.error("Error fetching activity data:", error);
    throw error;
  }
}

// Reward collection functions
export async function getRewardData(): Promise<RewardData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('reward_data');
    const result = await collection.find({}).toArray();
    return castToType<RewardData>(result);
  } catch (error) {
    console.error("Error fetching reward data:", error);
    throw error;
  }
}

// Transaction collection functions
export async function getTransactionData(): Promise<TransactionData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('transaction_data');
    const result = await collection.find({}).toArray();
    return castToType<TransactionData>(result);
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    throw error;
  }
}

// TransactionEntry collection functions
export async function getTransactionEntryData(): Promise<TransactionEntryData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('transaction_entry_data');
    const result = await collection.find({}).toArray();
    return castToType<TransactionEntryData>(result);
  } catch (error) {
    console.error("Error fetching transaction entry data:", error);
    throw error;
  }
}

// User collection functions
export async function getUserData(): Promise<UserData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user_data');
    const result = await collection.find({}).toArray();
    return castToType<UserData>(result);
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// Wallet collection functions
export async function getWalletData(): Promise<WalletData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('wallet_data');
    const result = await collection.find({}).toArray();
    return castToType<WalletData>(result);
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    throw error;
  }
}

// WalletHistory collection functions
export async function getWalletHistoryData(): Promise<WalletHistoryData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('wallet_history_data');
    const result = await collection.find({}).toArray();
    return castToType<WalletHistoryData>(result);
  } catch (error) {
    console.error("Error fetching wallet history data:", error);
    throw error;
  }
}

// VendorTransactionResponseTrail collection functions
export async function getVendorTransactionResponseTrailData(): Promise<VendorTransactionResponseTrailData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('vendor_transaction_response_trail_data');
    const result = await collection.find({}).toArray();
    return castToType<VendorTransactionResponseTrailData>(result);
  } catch (error) {
    console.error("Error fetching vendor transaction response trail data:", error);
    throw error;
  }
}

// UserReferral collection functions
export async function getUserReferralData(): Promise<UserReferralData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user_referral_data');
    const result = await collection.find({}).toArray();
    return castToType<UserReferralData>(result);
  } catch (error) {
    console.error("Error fetching user referral data:", error);
    throw error;
  }
}

// UserKycDetail collection functions
export async function getUserKycDetailData(): Promise<UserKycDetailData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user_kyc_detail_data');
    const result = await collection.find({}).toArray();
    return castToType<UserKycDetailData>(result);
  } catch (error) {
    console.error("Error fetching user KYC detail data:", error);
    throw error;
  }
}

// UserKyc collection functions
export async function getUserKycData(): Promise<UserKycData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user_kyc_data');
    const result = await collection.find({}).toArray();
    return castToType<UserKycData>(result);
  } catch (error) {
    console.error("Error fetching user KYC data:", error);
    throw error;
  }
}

// UserAuth collection functions
export async function getUserAuthData(): Promise<UserAuthData[]> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user_auth_data');
    const result = await collection.find({}).toArray();
    return castToType<UserAuthData>(result);
  } catch (error) {
    console.error("Error fetching user auth data:", error);
    throw error;
  }
}

// Authentication functions
export async function authenticateUser(email: string, password: string): Promise<{user: UserData, token: string} | null> {
  try {
    const db = await connectToDatabase();
    const userCollection = db.collection('user_data');
    const user = await userCollection.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return null;
    }
    
    // In a real implementation, you would verify the password hash
    // For now, we'll just accept any password for the demo
    return {
      user: user as unknown as UserData,
      token: `jwt-token-${user._id}`
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}

// Registration function
export async function registerUser(userData: Partial<UserData>): Promise<{user: UserData, token: string} | null> {
  try {
    const db = await connectToDatabase();
    const userCollection = db.collection('user_data');
    
    // Check if user already exists
    const existingUser = await userCollection.findOne({ email: userData.email?.toLowerCase() });
    if (existingUser) {
      throw new Error("User already exists");
    }
    
    const newUser: UserData = {
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
    
    // Convert the newUser to unknown first to avoid TypeScript conversion errors
    await userCollection.insertOne(newUser as unknown as any);
    
    return {
      user: newUser,
      token: `jwt-token-${newUser._id}`
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Dashboard stats function
export async function getDashboardStats() {
  try {
    const db = await connectToDatabase();
    const userCollection = db.collection('user_data');
    const transactionCollection = db.collection('transaction_data');
    const kycCollection = db.collection('kyc_data');
    
    const totalUsers = await userCollection.countDocuments();
    const activeUsers = await userCollection.countDocuments({ status: "ACTIVE" });
    const transactions = await transactionCollection.find({}).toArray();
    const totalTransactions = transactions.length;
    const totalAmount = castToType<TransactionData>(transactions).reduce((sum, t) => sum + t.amount, 0);
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
    
    return {
      totalUsers,
      activeUsers,
      totalTransactions,
      totalAmount,
      pendingKyc,
      completedKyc,
      recentTransactions: castToType<TransactionData>(recentTransactions),
      recentActivities: castToType<ActivityData>(recentActivities)
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}
