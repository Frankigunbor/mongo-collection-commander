
// This file contains API client functions to interact with MongoDB

const DATABASE_URL = "mongodb+srv://admin:3iHpVd6snupiW8M0@cluster0.ggagjiv.mongodb.net/broadsend-backend?retryWrites=true";

// Define interfaces for our collections
export interface KycData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  currency: string;
  kycLevel: string;
  kycRequirements: any[];
  singleTransactionLimit: number;
  dailyTransactionLimit: number;
  accountMaximumBalance: number;
  weeklyTransactionLimit: number;
  monthlyTransactionLimit: number;
}

export interface ActivityData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  description: string;
  accountId: string;
  recentUserActivityType: string;
}

export interface RewardData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  rewardAmount: number;
  rewardAmountCurrency: string;
  status: boolean;
  rewardCriteraId: string;
  creatorId: string;
}

export interface TransactionData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  actionId: string;
  reference: string;
  amount: number;
  currency: string;
  senderAccountId: string;
  recipientAccountId: string;
  transactionType: string;
  transactionStatus: string;
  transactionSource: string;
  userId: string;
  narration: string;
  requeryCount: number;
  processingMessage: string;
  vendor: string;
  vendorReference: string;
  conversionRate: number;
  completedAt: string;
}

// Since we can't directly connect to MongoDB from the browser, 
// in a real-world application we would need an API server
// For this demo, we'll use mock data that matches the schema

// Mock data for KYC
const mockKyc: KycData[] = [
  {
    _id: "3feb1c22-1d14-4302-918c-8f283a7e34b7",
    createdAt: "2023-12-26T18:39:30.742+00:00",
    updatedAt: "2023-12-26T18:39:30.742+00:00",
    creatorId: "5f52fb9d-654b-4a07-9fec-3e30a04aecf1",
    currency: "CAD",
    kycLevel: "LEVEL_ONE",
    kycRequirements: ["ID Verification", "Address Proof"],
    singleTransactionLimit: 50000,
    dailyTransactionLimit: 50000,
    accountMaximumBalance: 50000,
    weeklyTransactionLimit: 50000,
    monthlyTransactionLimit: 50000
  },
  {
    _id: "4feb1c22-1d14-4302-918c-8f283a7e34b8",
    createdAt: "2023-12-27T12:39:30.742+00:00",
    updatedAt: "2023-12-28T10:39:30.742+00:00",
    creatorId: "6f52fb9d-654b-4a07-9fec-3e30a04aecf2",
    currency: "USD",
    kycLevel: "LEVEL_TWO",
    kycRequirements: ["ID Verification", "Address Proof", "Income Verification"],
    singleTransactionLimit: 100000,
    dailyTransactionLimit: 100000,
    accountMaximumBalance: 200000,
    weeklyTransactionLimit: 200000,
    monthlyTransactionLimit: 300000
  },
  {
    _id: "5feb1c22-1d14-4302-918c-8f283a7e34b9",
    createdAt: "2023-12-28T14:39:30.742+00:00",
    updatedAt: "2023-12-29T16:39:30.742+00:00",
    creatorId: "7f52fb9d-654b-4a07-9fec-3e30a04aecf3",
    currency: "EUR",
    kycLevel: "LEVEL_THREE",
    kycRequirements: ["ID Verification", "Address Proof", "Income Verification", "Video Call"],
    singleTransactionLimit: 200000,
    dailyTransactionLimit: 200000,
    accountMaximumBalance: 500000,
    weeklyTransactionLimit: 500000,
    monthlyTransactionLimit: 1000000
  }
];

// Mock data for activities
const mockActivities: ActivityData[] = [
  {
    _id: "b11f639d-998e-4264-a1b0-01f69330243a",
    createdAt: "2024-01-20T13:10:45.380+00:00",
    updatedAt: "2024-01-20T13:10:45.380+00:00",
    userId: "1de324c9-8c25-4e76-a87c-ce123b6864af",
    description: "Added Beneficiary - Guaranty Trust Bank (GTB) 0167457740",
    accountId: "2a3573a7-a0b5-4c21-9b26-5881ef192837",
    recentUserActivityType: "BENEFICIARY"
  },
  {
    _id: "c11f639d-998e-4264-a1b0-01f69330243b",
    createdAt: "2024-01-21T09:15:45.380+00:00",
    updatedAt: "2024-01-21T09:15:45.380+00:00",
    userId: "2de324c9-8c25-4e76-a87c-ce123b6864bg",
    description: "Updated profile information - Changed phone number",
    accountId: "3a3573a7-a0b5-4c21-9b26-5881ef192838",
    recentUserActivityType: "PROFILE"
  },
  {
    _id: "d11f639d-998e-4264-a1b0-01f69330243c",
    createdAt: "2024-01-21T16:22:45.380+00:00",
    updatedAt: "2024-01-21T16:22:45.380+00:00",
    userId: "3de324c9-8c25-4e76-a87c-ce123b6864ch",
    description: "Login - Device: iPhone 13, Location: Toronto",
    accountId: "4a3573a7-a0b5-4c21-9b26-5881ef192839",
    recentUserActivityType: "AUTH"
  }
];

// Mock data for rewards
const mockRewards: RewardData[] = [
  {
    _id: "987ce2aa-cb48-4624-ab18-5825f9d5e8bb",
    createdAt: "2024-04-20T19:02:47.838+00:00",
    updatedAt: "2024-04-20T19:02:47.838+00:00",
    rewardAmount: 500,
    rewardAmountCurrency: "CAD",
    status: true,
    rewardCriteraId: "050d5f13-9977-437e-9fe2-568533725326",
    creatorId: "1de324c9-8c25-4e76-a87c-ce123b6864af"
  },
  {
    _id: "987ce2aa-cb48-4624-ab18-5825f9d5e8bc",
    createdAt: "2024-04-21T15:12:47.838+00:00",
    updatedAt: "2024-04-21T15:12:47.838+00:00",
    rewardAmount: 250,
    rewardAmountCurrency: "USD",
    status: true,
    rewardCriteraId: "150d5f13-9977-437e-9fe2-568533725327",
    creatorId: "2de324c9-8c25-4e76-a87c-ce123b6864bg"
  },
  {
    _id: "987ce2aa-cb48-4624-ab18-5825f9d5e8bd",
    createdAt: "2024-04-22T10:22:47.838+00:00",
    updatedAt: "2024-04-22T10:22:47.838+00:00",
    rewardAmount: 100,
    rewardAmountCurrency: "EUR",
    status: false,
    rewardCriteraId: "250d5f13-9977-437e-9fe2-568533725328",
    creatorId: "3de324c9-8c25-4e76-a87c-ce123b6864ch"
  }
];

// Mock data for transactions
const mockTransactions: TransactionData[] = [
  {
    _id: "b5ce0bbf-1023-4c72-9ba2-3c50600cfca5",
    createdAt: "2024-01-20T13:27:54.083+00:00",
    updatedAt: "2024-01-20T13:28:45.870+00:00",
    actionId: "1705757271536",
    reference: "APP-TRANSFER-17057-1705757271536",
    amount: 1000,
    currency: "CAD",
    senderAccountId: "62718e13-5412-4c88-b210-51b4e3502f64",
    recipientAccountId: "2a3573a7-a0b5-4c21-9b26-5881ef192837",
    transactionType: "TRANSFER",
    transactionStatus: "SUCCESS",
    transactionSource: "ANDROID_APP",
    userId: "1de324c9-8c25-4e76-a87c-ce123b6864af",
    narration: "Rent payment",
    requeryCount: 1,
    processingMessage: "SUCCESS",
    vendor: "PAYMENT_VENDOR_NOMBA",
    vendorReference: "APP-TRANSFER-17057-1705757271536",
    conversionRate: 1000,
    completedAt: "2024-01-20T13:28:45.869+00:00"
  },
  {
    _id: "c5ce0bbf-1023-4c72-9ba2-3c50600cfca6",
    createdAt: "2024-01-21T09:15:54.083+00:00",
    updatedAt: "2024-01-21T09:16:45.870+00:00",
    actionId: "1705757271537",
    reference: "APP-TRANSFER-17057-1705757271537",
    amount: 500,
    currency: "USD",
    senderAccountId: "62718e13-5412-4c88-b210-51b4e3502f65",
    recipientAccountId: "3a3573a7-a0b5-4c21-9b26-5881ef192838",
    transactionType: "DEPOSIT",
    transactionStatus: "PENDING",
    transactionSource: "WEB_APP",
    userId: "2de324c9-8c25-4e76-a87c-ce123b6864bg",
    narration: "Salary deposit",
    requeryCount: 0,
    processingMessage: "PROCESSING",
    vendor: "PAYMENT_VENDOR_PAYSTACK",
    vendorReference: "APP-DEPOSIT-17057-1705757271537",
    conversionRate: 1000,
    completedAt: ""
  },
  {
    _id: "d5ce0bbf-1023-4c72-9ba2-3c50600cfca7",
    createdAt: "2024-01-21T16:22:54.083+00:00",
    updatedAt: "2024-01-21T16:23:45.870+00:00",
    actionId: "1705757271538",
    reference: "APP-TRANSFER-17057-1705757271538",
    amount: 250,
    currency: "EUR",
    senderAccountId: "62718e13-5412-4c88-b210-51b4e3502f66",
    recipientAccountId: "4a3573a7-a0b5-4c21-9b26-5881ef192839",
    transactionType: "WITHDRAWAL",
    transactionStatus: "FAILED",
    transactionSource: "IOS_APP",
    userId: "3de324c9-8c25-4e76-a87c-ce123b6864ch",
    narration: "ATM withdrawal",
    requeryCount: 2,
    processingMessage: "INSUFFICIENT_FUNDS",
    vendor: "PAYMENT_VENDOR_FLUTTERWAVE",
    vendorReference: "APP-WITHDRAWAL-17057-1705757271538",
    conversionRate: 1000,
    completedAt: ""
  }
];

// API functions to fetch data
export async function fetchKycData(): Promise<KycData[]> {
  // In a real app, this would be a fetch to your API
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockKyc), 500);
  });
}

export async function fetchActivityData(): Promise<ActivityData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockActivities), 500);
  });
}

export async function fetchRewardData(): Promise<RewardData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRewards), 500);
  });
}

export async function fetchTransactionData(): Promise<TransactionData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTransactions), 500);
  });
}

// Function to update a KYC record (mock)
export async function updateKyc(kyc: KycData): Promise<KycData> {
  // In a real app, this would update in the database
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedKyc = { ...kyc, updatedAt: new Date().toISOString() };
      return resolve(updatedKyc);
    }, 500);
  });
}

// Function to update a reward record (mock)
export async function updateReward(reward: RewardData): Promise<RewardData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedReward = { ...reward, updatedAt: new Date().toISOString() };
      return resolve(updatedReward);
    }, 500);
  });
}

// Function to get dashboard stats (mock)
export async function fetchDashboardStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        totalUsers: 1254,
        activeUsers: 987,
        totalTransactions: 5872,
        transactionVolume: 2456789,
        totalRewards: 45600,
        activeRewards: 35800,
        kycVerified: 1102,
        pendingKyc: 152,
        transactionsByDay: [
          { date: '2024-01-15', count: 245 },
          { date: '2024-01-16', count: 267 },
          { date: '2024-01-17', count: 298 },
          { date: '2024-01-18', count: 310 },
          { date: '2024-01-19', count: 354 },
          { date: '2024-01-20', count: 278 },
          { date: '2024-01-21', count: 286 }
        ],
        usersByDay: [
          { date: '2024-01-15', count: 25 },
          { date: '2024-01-16', count: 17 },
          { date: '2024-01-17', count: 29 },
          { date: '2024-01-18', count: 31 },
          { date: '2024-01-19', count: 34 },
          { date: '2024-01-20', count: 28 },
          { date: '2024-01-21', count: 26 }
        ]
      });
    }, 500);
  });
}
