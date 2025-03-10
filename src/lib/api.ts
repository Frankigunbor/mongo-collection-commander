
// This file contains API utilities for interacting with MongoDB collections

// Collection interfaces based on MongoDB structure
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

// Mock data for testing - in a real app, this would connect to MongoDB
// (The MongoDB connection would be handled by backend APIs)

// Kyc mock data
const kycMockData: KycData[] = [
  {
    _id: "3feb1c22-1d14-4302-918c-8f283a7e34b7",
    createdAt: "2023-12-26T18:39:30.742+00:00",
    updatedAt: "2023-12-26T18:39:30.742+00:00",
    creatorId: "5f52fb9d-654b-4a07-9fec-3e30a04aecf1",
    currency: "CAD",
    kycLevel: "LEVEL_ONE",
    kycRequirements: ["ID_VERIFICATION", "ADDRESS_VERIFICATION"],
    singleTransactionLimit: 50000,
    dailyTransactionLimit: 50000,
    accountMaximumBalance: 50000,
    weeklyTransactionLimit: 50000,
    monthlyTransactionLimit: 50000
  },
  {
    _id: "4e7c2d33-2e25-5413-029d-9f394a8e45c8",
    createdAt: "2023-12-15T14:22:15.123+00:00",
    updatedAt: "2023-12-20T09:45:12.456+00:00",
    creatorId: "6g63gc0e-765c-5b18-0fed-4f41b15bfdg2",
    currency: "USD",
    kycLevel: "LEVEL_TWO",
    kycRequirements: ["ID_VERIFICATION", "ADDRESS_VERIFICATION", "INCOME_VERIFICATION"],
    singleTransactionLimit: 100000,
    dailyTransactionLimit: 100000,
    accountMaximumBalance: 250000,
    weeklyTransactionLimit: 200000,
    monthlyTransactionLimit: 500000
  },
  {
    _id: "5f8d3e44-3f36-6524-130e-0g405b9f56d9",
    createdAt: "2024-01-10T11:33:45.789+00:00",
    updatedAt: "2024-01-15T16:20:33.987+00:00",
    creatorId: "7h74hd1f-876d-6c29-1gfe-5g52c26cgeh3",
    currency: "EUR",
    kycLevel: "LEVEL_THREE",
    kycRequirements: ["ID_VERIFICATION", "ADDRESS_VERIFICATION", "INCOME_VERIFICATION", "SOURCE_OF_FUNDS"],
    singleTransactionLimit: 200000,
    dailyTransactionLimit: 200000,
    accountMaximumBalance: 500000,
    weeklyTransactionLimit: 400000,
    monthlyTransactionLimit: 1000000
  }
];

// Activity mock data
const activityMockData: ActivityData[] = [
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
    _id: "c22g740e-009f-5375-b2c1-12g70441354b",
    createdAt: "2024-01-18T09:25:33.222+00:00",
    updatedAt: "2024-01-18T09:25:33.222+00:00",
    userId: "2ef435da-9d36-5e87-b98d-df234c7975bg",
    description: "Logged in from new device - iPhone 13",
    accountId: "3b4684b8-b1c6-5d32-c037-6992fg293948",
    recentUserActivityType: "AUTH"
  },
  {
    _id: "d33h851f-110g-6486-c3d2-23h81552465c",
    createdAt: "2024-01-15T17:40:12.555+00:00",
    updatedAt: "2024-01-15T17:40:12.555+00:00",
    userId: "3fg546eb-0e47-6f98-c09e-eg345d8086ch",
    description: "Changed account password",
    accountId: "4c5795c9-c2d7-6e43-d148-7003gh304059",
    recentUserActivityType: "AUTH"
  },
  {
    _id: "e44i962g-221h-7597-d4e3-34i92663576d",
    createdAt: "2024-01-12T14:15:55.888+00:00",
    updatedAt: "2024-01-12T14:15:55.888+00:00",
    userId: "4gh657fc-1f58-7g09-d10f-fh456e9197di",
    description: "Sent CAD 1,500 to Jennifer Smith",
    accountId: "5d6806d0-d3e8-7f54-e259-8114hi415160",
    recentUserActivityType: "TRANSACTION"
  }
];

// Reward mock data
const rewardMockData: RewardData[] = [
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
    _id: "098df3bb-dc59-5735-bc29-6936g0e6f9cc",
    createdAt: "2024-04-18T14:30:22.456+00:00",
    updatedAt: "2024-04-18T14:30:22.456+00:00",
    rewardAmount: 250,
    rewardAmountCurrency: "USD",
    status: true,
    rewardCriteraId: "161e6g24-0088-548f-0gf3-679644836437",
    creatorId: "2ef435da-9d36-5e87-b98d-df234c7975bg"
  },
  {
    _id: "109eg4cc-ed60-6846-cd30-7047h1f7g0dd",
    createdAt: "2024-04-15T11:15:33.789+00:00",
    updatedAt: "2024-04-16T09:20:15.123+00:00",
    rewardAmount: 100,
    rewardAmountCurrency: "EUR",
    status: false,
    rewardCriteraId: "272f7h35-1199-659g-1hg4-780755947548",
    creatorId: "3fg546eb-0e47-6f98-c09e-eg345d8086ch"
  }
];

// Transaction mock data
const transactionMockData: TransactionData[] = [
  {
    _id: "b5ce0bbf-1023-4c72-9ba2-3c50600cfca5",
    createdAt: "2024-01-20T13:27:54.083+00:00",
    updatedAt: "2024-01-20T13:28:45.870+00:00",
    actionId: "1705757271536",
    reference: "APP-TRANSFER-17057-1705757271536",
    amount: 1,
    currency: "CAD",
    senderAccountId: "62718e13-5412-4c88-b210-51b4e3502f64",
    recipientAccountId: "2a3573a7-a0b5-4c21-9b26-5881ef192837",
    transactionType: "TRANSFER",
    transactionStatus: "SUCCESS",
    transactionSource: "ANDROID_APP",
    userId: "1de324c9-8c25-4e76-a87c-ce123b6864af",
    narration: "",
    requeryCount: 1,
    processingMessage: "SUCCESS",
    vendor: "PAYMENT_VENDOR_NOMBA",
    vendorReference: "APP-TRANSFER-17057-1705757271536",
    conversionRate: 1000,
    completedAt: "2024-01-20T13:28:45.869+00:00"
  },
  {
    _id: "c6df1ccg-2134-5d83-0cb3-4d61711dgdb6",
    createdAt: "2024-01-18T09:45:12.456+00:00",
    updatedAt: "2024-01-18T09:46:33.789+00:00",
    actionId: "1705645512456",
    reference: "APP-TRANSFER-17056-1705645512456",
    amount: 500,
    currency: "USD",
    senderAccountId: "73829f24-6523-5d99-c321-62c5f613g75",
    recipientAccountId: "84930g35-7634-6e00-d432-73d6g724h86",
    transactionType: "TRANSFER",
    transactionStatus: "SUCCESS",
    transactionSource: "WEB_APP",
    userId: "2ef435da-9d36-5e87-b98d-df234c7975bg",
    narration: "Monthly rent payment",
    requeryCount: 1,
    processingMessage: "SUCCESS",
    vendor: "PAYMENT_VENDOR_STRIPE",
    vendorReference: "APP-TRANSFER-17056-1705645512456",
    conversionRate: 1,
    completedAt: "2024-01-18T09:46:33.788+00:00"
  },
  {
    _id: "d7eg2ddh-3245-6e94-1dc4-5e72822egec7",
    createdAt: "2024-01-15T15:30:45.123+00:00",
    updatedAt: "2024-01-15T15:30:45.123+00:00",
    actionId: "1705335045123",
    reference: "APP-WITHDRAW-17053-1705335045123",
    amount: 200,
    currency: "EUR",
    senderAccountId: "95041h46-8745-7f11-e543-84e7h835i97",
    recipientAccountId: "06152i57-9856-8g22-f654-95f8i946j08",
    transactionType: "WITHDRAW",
    transactionStatus: "PENDING",
    transactionSource: "ANDROID_APP",
    userId: "3fg546eb-0e47-6f98-c09e-eg345d8086ch",
    narration: "ATM withdrawal",
    requeryCount: 2,
    processingMessage: "PROCESSING",
    vendor: "PAYMENT_VENDOR_PAYPAL",
    vendorReference: "APP-WITHDRAW-17053-1705335045123",
    conversionRate: 0.92,
    completedAt: ""
  },
  {
    _id: "e8fh3eei-4356-7f05-2ed5-6f83933fhfd8",
    createdAt: "2024-01-10T11:20:33.456+00:00",
    updatedAt: "2024-01-10T11:21:15.789+00:00",
    actionId: "1704886833456",
    reference: "APP-DEPOSIT-17048-1704886833456",
    amount: 1000,
    currency: "CAD",
    senderAccountId: "17263j68-0967-9h33-g765-06g9j057k19",
    recipientAccountId: "28374k79-1078-0i44-h876-17h0k168l20",
    transactionType: "DEPOSIT",
    transactionStatus: "SUCCESS",
    transactionSource: "WEB_APP",
    userId: "4gh657fc-1f58-7g09-d10f-fh456e9197di",
    narration: "Salary deposit",
    requeryCount: 1,
    processingMessage: "SUCCESS",
    vendor: "PAYMENT_VENDOR_NOMBA",
    vendorReference: "APP-DEPOSIT-17048-1704886833456",
    conversionRate: 1000,
    completedAt: "2024-01-10T11:21:15.788+00:00"
  },
  {
    _id: "f9gi4ffj-5467-8g16-3fe6-7g94044gigE9",
    createdAt: "2024-01-05T08:15:22.789+00:00",
    updatedAt: "2024-01-05T08:16:45.123+00:00",
    actionId: "1704438922789",
    reference: "APP-TRANSFER-17044-1704438922789",
    amount: 300,
    currency: "USD",
    senderAccountId: "39485l80-2189-1j55-i987-28i1l279m31",
    recipientAccountId: "40596m91-3290-2k66-j098-39j2m380n42",
    transactionType: "TRANSFER",
    transactionStatus: "FAILED",
    transactionSource: "ANDROID_APP",
    userId: "5hi768gd-2g69-8h10-e21g-gi567f0208ej",
    narration: "Gift for birthday",
    requeryCount: 3,
    processingMessage: "INSUFFICIENT_FUNDS",
    vendor: "PAYMENT_VENDOR_STRIPE",
    vendorReference: "APP-TRANSFER-17044-1704438922789",
    conversionRate: 1,
    completedAt: ""
  }
];

// API Functions - These would connect to your MongoDB in a real application
export async function fetchKycData(): Promise<KycData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(kycMockData), 500);
  });
}

export async function fetchActivityData(): Promise<ActivityData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(activityMockData), 500);
  });
}

export async function fetchRewardData(): Promise<RewardData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(rewardMockData), 500);
  });
}

export async function fetchTransactionData(): Promise<TransactionData[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(transactionMockData), 500);
  });
}

// In a real application, you would also have functions to update, create, and delete data
export async function updateKyc(kyc: KycData): Promise<KycData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({...kyc, updatedAt: new Date().toISOString()}), 500);
  });
}

export async function updateReward(reward: RewardData): Promise<RewardData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({...reward, updatedAt: new Date().toISOString()}), 500);
  });
}

// Mock dashboard stats for the dashboard page
export async function fetchDashboardStats() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({
      totalUsers: 1254,
      activeUsers: 876,
      totalTransactions: transactionMockData.length,
      totalAmount: transactionMockData.reduce((sum, t) => sum + t.amount, 0),
      pendingKyc: 12,
      completedKyc: kycMockData.length,
      recentTransactions: transactionMockData.slice(0, 5),
      recentActivities: activityMockData.slice(0, 5)
    }), 600);
  });
}
