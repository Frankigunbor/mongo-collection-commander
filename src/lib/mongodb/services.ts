
// Important note: This file has been modified to use the API client instead of direct MongoDB connections
import { connectToDatabase, closeDatabaseConnection } from "./client";

// Helper function to ensure database connection
async function getCollection(collectionName: string) {
  const db = await connectToDatabase();
  return db.collection(collectionName);
}

// User Services
export async function getUserById(userId: string) {
  try {
    const collection = await getCollection('User');
    return await collection.findOne({ _id: userId });
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  } finally {
    await closeDatabaseConnection();
  }
}

export async function getAllUsers() {
  try {
    const collection = await getCollection('User');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function createUser(userData: any) {
  try {
    const collection = await getCollection('User');
    const result = await collection.insertOne(userData);
    return { ...userData, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

export async function updateUser(userData: any) {
  try {
    const { _id, ...updateData } = userData;
    const collection = await getCollection('User');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return userData;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

// Transaction Services
export async function getTransactionById(transactionId: string) {
  try {
    const collection = await getCollection('Transaction');
    return await collection.findOne({ _id: transactionId });
  } catch (error) {
    console.error("Error getting transaction by ID:", error);
    return null;
  } finally {
    await closeDatabaseConnection();
  }
}

export async function getAllTransactions() {
  try {
    const collection = await getCollection('Transaction');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all transactions:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function createTransaction(transactionData: any) {
  try {
    const collection = await getCollection('Transaction');
    const result = await collection.insertOne(transactionData);
    return { ...transactionData, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

export async function updateTransaction(transactionData: any) {
  try {
    const { _id, ...updateData } = transactionData;
    const collection = await getCollection('Transaction');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return transactionData;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

// Wallet Services
export async function getWalletById(walletId: string) {
  try {
    const collection = await getCollection('Wallet');
    return await collection.findOne({ _id: walletId });
  } catch (error) {
    console.error("Error getting wallet by ID:", error);
    return null;
  } finally {
    await closeDatabaseConnection();
  }
}

export async function getWalletsByUserId(userId: string) {
  try {
    const collection = await getCollection('Wallet');
    return await collection.find({ userId }).toArray();
  } catch (error) {
    console.error("Error getting wallets by user ID:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function getAllWallets() {
  try {
    const collection = await getCollection('Wallet');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all wallets:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function createWallet(walletData: any) {
  try {
    const collection = await getCollection('Wallet');
    const result = await collection.insertOne(walletData);
    return { ...walletData, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

export async function updateWallet(walletData: any) {
  try {
    const { _id, ...updateData } = walletData;
    const collection = await getCollection('Wallet');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return walletData;
  } catch (error) {
    console.error("Error updating wallet:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

// KYC Services
export async function getKycById(kycId: string) {
  try {
    const collection = await getCollection('UserKyc');
    return await collection.findOne({ _id: kycId });
  } catch (error) {
    console.error("Error getting KYC by ID:", error);
    return null;
  } finally {
    await closeDatabaseConnection();
  }
}

export async function getKycByUserId(userId: string) {
  try {
    const collection = await getCollection('UserKyc');
    return await collection.findOne({ userId });
  } catch (error) {
    console.error("Error getting KYC by user ID:", error);
    return null;
  } finally {
    await closeDatabaseConnection();
  }
}

export async function getAllKycs() {
  try {
    const collection = await getCollection('UserKyc');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all KYCs:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function createKyc(kycData: any) {
  try {
    const collection = await getCollection('UserKyc');
    const result = await collection.insertOne(kycData);
    return { ...kycData, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating KYC:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

export async function updateKyc(kycData: any) {
  try {
    const { _id, ...updateData } = kycData;
    const collection = await getCollection('UserKyc');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return kycData;
  } catch (error) {
    console.error("Error updating KYC:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

// Activity Services
export async function getAllActivities() {
  try {
    const collection = await getCollection('Activity');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all activities:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function updateActivity(activityData: any) {
  try {
    const { _id, ...updateData } = activityData;
    const collection = await getCollection('Activity');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return activityData;
  } catch (error) {
    console.error("Error updating activity:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

// Reward Services
export async function getAllRewards() {
  try {
    const collection = await getCollection('Reward');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all rewards:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function updateReward(rewardData: any) {
  try {
    const { _id, ...updateData } = rewardData;
    const collection = await getCollection('Reward');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return rewardData;
  } catch (error) {
    console.error("Error updating reward:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

// Transaction Entry Services
export async function getAllTransactionEntries() {
  try {
    const collection = await getCollection('TransactionEntry');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all transaction entries:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function updateTransactionEntry(entryData: any) {
  try {
    const { _id, ...updateData } = entryData;
    const collection = await getCollection('TransactionEntry');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return entryData;
  } catch (error) {
    console.error("Error updating transaction entry:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

// UserKycDetail Services
export async function getAllUserKycDetails() {
  try {
    const collection = await getCollection('UserKycDetail');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all user KYC details:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function updateUserKycDetail(detailData: any) {
  try {
    const { _id, ...updateData } = detailData;
    const collection = await getCollection('UserKycDetail');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return detailData;
  } catch (error) {
    console.error("Error updating user KYC detail:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

// Vendor Response Services
export async function getAllVendorResponses() {
  try {
    const collection = await getCollection('VendorTransactionResponseTrail');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all vendor responses:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

// User Referral Services
export async function getAllUserReferrals() {
  try {
    const collection = await getCollection('UserReferral');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all user referrals:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function updateUserReferral(referralData: any) {
  try {
    const { _id, ...updateData } = referralData;
    const collection = await getCollection('UserReferral');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return referralData;
  } catch (error) {
    console.error("Error updating user referral:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

// User Auth Services
export async function getAllUserAuth() {
  try {
    const collection = await getCollection('UserAuth');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all user auth records:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

// Wallet History Services
export async function getAllWalletHistory() {
  try {
    const collection = await getCollection('WalletHistory');
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error getting all wallet history:", error);
    return [];
  } finally {
    await closeDatabaseConnection();
  }
}

export async function updateWalletHistory(historyData: any) {
  try {
    const { _id, ...updateData } = historyData;
    const collection = await getCollection('WalletHistory');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return historyData;
  } catch (error) {
    console.error("Error updating wallet history:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}

// User Kyc Services
export async function updateUserKyc(userKycData: any) {
  try {
    const { _id, ...updateData } = userKycData;
    const collection = await getCollection('UserKyc');
    await collection.updateOne(
      { _id },
      { $set: updateData }
    );
    return userKycData;
  } catch (error) {
    console.error("Error updating user kyc:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
}
