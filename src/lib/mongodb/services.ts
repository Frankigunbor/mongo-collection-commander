
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
    const collection = db.collection('UserKycDetail');
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
    const collection = db.collection('StreamChannel');
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
    const collection = db.collection('RewardCriteria');
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
    const collection = db.collection('Transaction');
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
    const collection = db.collection('TransactionEntry');
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
    const collection = db.collection('User');
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
    const collection = db.collection('Wallet');
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
    const collection = db.collection('WalletHistory');
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
    const collection = db.collection('VendorTransactionResponseTrail');
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
    const collection = db.collection('UserReferral');
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
    const collection = db.collection('UserKycDetail');
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
    const collection = db.collection('UserKyc');
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
    const collection = db.collection('UserAuth');
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
    const userCollection = db.collection('User');
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
    const userCollection = db.collection('User');
    
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
    const userCollection = db.collection('User');
    const transactionCollection = db.collection('Transaction');
    const kycCollection = db.collection('UserKycDetail');
    
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
      
    const streamChannelCollection = db.collection('StreamChannel');
    const recentActivities = await streamChannelCollection.find({})
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

// Add the update functions
export async function updateUser(userData: UserData): Promise<UserData> {
  try {
    const db = await connectToDatabase();
    const userCollection = db.collection('User');
    
    const updatedUser = {
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    await userCollection.updateOne({ _id: userData._id }, { $set: updatedUser });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function updateUserKyc(userKycData: UserKycData): Promise<UserKycData> {
  try {
    const db = await connectToDatabase();
    const userKycCollection = db.collection('UserKyc');
    
    const updatedUserKyc = {
      ...userKycData,
      updatedAt: new Date().toISOString()
    };
    
    await userKycCollection.updateOne({ _id: userKycData._id }, { $set: updatedUserKyc });
    return updatedUserKyc;
  } catch (error) {
    console.error("Error updating user KYC:", error);
    throw error;
  }
}

export async function updateUserKycDetail(userKycDetailData: UserKycDetailData): Promise<UserKycDetailData> {
  try {
    const db = await connectToDatabase();
    const userKycDetailCollection = db.collection('UserKycDetail');
    
    const updatedUserKycDetail = {
      ...userKycDetailData,
      updatedAt: new Date().toISOString()
    };
    
    await userKycDetailCollection.updateOne({ _id: userKycDetailData._id }, { $set: updatedUserKycDetail });
    return updatedUserKycDetail;
  } catch (error) {
    console.error("Error updating user KYC detail:", error);
    throw error;
  }
}

export async function updateWallet(walletData: WalletData): Promise<WalletData> {
  try {
    const db = await connectToDatabase();
    const walletCollection = db.collection('Wallet');
    
    const updatedWallet = {
      ...walletData,
      updatedAt: new Date().toISOString()
    };
    
    await walletCollection.updateOne({ _id: walletData._id }, { $set: updatedWallet });
    return updatedWallet;
  } catch (error) {
    console.error("Error updating wallet:", error);
    throw error;
  }
}

export async function updateWalletHistory(historyData: WalletHistoryData): Promise<WalletHistoryData> {
  try {
    const db = await connectToDatabase();
    const historyCollection = db.collection('WalletHistory');
    
    const updatedHistory = {
      ...historyData,
      updatedAt: new Date().toISOString()
    };
    
    await historyCollection.updateOne({ _id: historyData._id }, { $set: updatedHistory });
    return updatedHistory;
  } catch (error) {
    console.error("Error updating wallet history:", error);
    throw error;
  }
}

export async function updateTransaction(transactionData: TransactionData): Promise<TransactionData> {
  try {
    const db = await connectToDatabase();
    const transactionCollection = db.collection('Transaction');
    
    const updatedTransaction = {
      ...transactionData,
      updatedAt: new Date().toISOString()
    };
    
    await transactionCollection.updateOne({ _id: transactionData._id }, { $set: updatedTransaction });
    return updatedTransaction;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}

export async function updateTransactionEntry(entryData: TransactionEntryData): Promise<TransactionEntryData> {
  try {
    const db = await connectToDatabase();
    const entryCollection = db.collection('TransactionEntry');
    
    const updatedEntry = {
      ...entryData,
      updatedAt: new Date().toISOString()
    };
    
    await entryCollection.updateOne({ _id: entryData._id }, { $set: updatedEntry });
    return updatedEntry;
  } catch (error) {
    console.error("Error updating transaction entry:", error);
    throw error;
  }
}

export async function updateActivity(activityData: ActivityData): Promise<ActivityData> {
  try {
    const db = await connectToDatabase();
    const activityCollection = db.collection('StreamChannel');
    
    const updatedActivity = {
      ...activityData,
      updatedAt: new Date().toISOString()
    };
    
    await activityCollection.updateOne({ _id: activityData._id }, { $set: updatedActivity });
    return updatedActivity;
  } catch (error) {
    console.error("Error updating activity:", error);
    throw error;
  }
}

export async function createTransaction(transactionData: Partial<TransactionData>): Promise<TransactionData> {
  try {
    const db = await connectToDatabase();
    const transactionCollection = db.collection('Transaction');
    
    const newTransaction: TransactionData = {
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
    
    await transactionCollection.insertOne(newTransaction as any);
    return newTransaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

export async function createTransactionEntry(entryData: Partial<TransactionEntryData>): Promise<TransactionEntryData> {
  try {
    const db = await connectToDatabase();
    const entryCollection = db.collection('TransactionEntry');
    
    const newEntry: TransactionEntryData = {
      _id: `entry-${Date.now()}`,
      entryType: entryData.entryType || "CREDIT",
      amount: entryData.amount || 0,
      currency: entryData.currency || "CAD",
      accountId: entryData.accountId || "",
      transactionId: entryData.transactionId || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await entryCollection.insertOne(newEntry as any);
    return newEntry;
  } catch (error) {
    console.error("Error creating transaction entry:", error);
    throw error;
  }
}

export async function createActivity(activityData: Partial<ActivityData>): Promise<ActivityData> {
  try {
    const db = await connectToDatabase();
    const activityCollection = db.collection('StreamChannel');
    
    const newActivity: ActivityData = {
      _id: `activity-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: activityData.userId || "",
      description: activityData.description || "",
      accountId: activityData.accountId || "",
      recentUserActivityType: activityData.recentUserActivityType || "TRANSACTION"
    };
    
    await activityCollection.insertOne(newActivity as any);
    return newActivity;
  } catch (error) {
    console.error("Error creating activity:", error);
    throw error;
  }
}
