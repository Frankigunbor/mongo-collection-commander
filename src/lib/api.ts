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

// New collection interfaces
export interface TransactionEntryData {
  _id: string;
  entryType: string;
  amount: number;
  currency: string;
  accountId: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userPhoneNumber: string;
  userPhoneNumberCountryCode: string;
  status: string;
  userPhoneNumberActivated: boolean;
  userEmailActivated: boolean;
  securityQuestionEnabled: boolean;
  transactionPinEnabled: boolean;
  countryCurrencyCode: string;
  verificationVendorReference: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  fcmRegistrationToken: string;
  userGroup: string;
}

export interface WalletData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  userId: string;
  currency: string;
  balance: number;
}

export interface WalletHistoryData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  walletId: string;
  transactionReference: string;
  previousBalance: number;
  currentBalance: number;
}

export interface VendorTransactionResponseTrailData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  vendor: string;
  vendorReference: string;
  processingMessage: string;
  transactionId: string;
  transactionStatus: string;
}

export interface UserReferralData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  referralCode: string;
}

export interface UserKycDetailData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  kycRequirement: string;
  kycId: string;
  verified: boolean;
  vendor: string;
  vendorReference: string;
}

export interface UserKycData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  currency: string;
  kycId: string;
}

export interface UserAuthData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  passwordHash: string;
  transactionPinHash: string;
}

// Mock data for existing collections - in a real app, this would connect to MongoDB
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

// New mock data for the additional collections
const transactionEntryMockData: TransactionEntryData[] = [
  {
    _id: "fd831d7b-361a-43bf-8a45-a31e25c5d005",
    entryType: "CREDIT",
    amount: 1,
    currency: "CAD",
    accountId: "fd7a7702-0547-4b2a-a79e-3dfb727a0c18",
    transactionId: "b5ce0bbf-1023-4c72-9ba2-3c50600cfca5",
    createdAt: "2024-01-20T13:27:54.624+00:00",
    updatedAt: "2024-01-20T13:27:54.624+00:00"
  },
  {
    _id: "ge942e8c-472b-54cg-9b56-b42f36d6e116",
    entryType: "DEBIT",
    amount: 200,
    currency: "USD",
    accountId: "ge8b8813-6523-5d99-c321-62c5f613g75",
    transactionId: "c6df1ccg-2134-5d83-0cb3-4d61711dgdb6",
    createdAt: "2024-01-18T09:45:12.456+00:00",
    updatedAt: "2024-01-18T09:45:12.456+00:00"
  }
];

const userMockData: UserData[] = [
  {
    _id: "1de324c9-8c25-4e76-a87c-ce123b6864af",
    createdAt: "2024-01-20T13:02:29.826+00:00",
    updatedAt: "2025-03-01T11:03:31.647+00:00",
    userPhoneNumber: "6134152384",
    userPhoneNumberCountryCode: "+1",
    status: "ACTIVE",
    userPhoneNumberActivated: true,
    userEmailActivated: true,
    securityQuestionEnabled: false,
    transactionPinEnabled: true,
    countryCurrencyCode: "CAD",
    verificationVendorReference: "+16134152384",
    firstName: "Isaac",
    middleName: "",
    lastName: "Ezeh",
    email: "dynamiteezeh@gmail.com",
    fcmRegistrationToken: "c6qdGdASTkaVfLePWh3WxJ:APA91bHzn7U1JE4-BvW-qaL2uC7GhTZfZiVRhS0Ryv9g2s8",
    userGroup: "SALES_FORCE"
  },
  {
    _id: "2ef435da-9d36-5e87-b98d-df234c7975bg",
    createdAt: "2024-01-18T10:15:45.123+00:00",
    updatedAt: "2025-02-28T09:22:18.456+00:00",
    userPhoneNumber: "4165559876",
    userPhoneNumberCountryCode: "+1",
    status: "ACTIVE",
    userPhoneNumberActivated: true,
    userEmailActivated: true,
    securityQuestionEnabled: true,
    transactionPinEnabled: true,
    countryCurrencyCode: "CAD",
    verificationVendorReference: "+14165559876",
    firstName: "Sarah",
    middleName: "Jane",
    lastName: "Thompson",
    email: "saraht@example.com",
    fcmRegistrationToken: "d7reHeBTlbWgMzQRXi4XyK:BPA92cIzn8U2KF5-CvX-rbD8hUaYgZiWSiT1Sxv0h3t9",
    userGroup: "USER"
  }
];

const walletMockData: WalletData[] = [
  {
    _id: "213e3d4b-8277-4f60-8349-5da6db3f8c29",
    createdAt: "2024-01-20T13:04:22.533+00:00",
    updatedAt: "2024-08-22T15:19:52.955+00:00",
    accountId: "62718e13-5412-4c88-b210-51b4e3502f64",
    userId: "1de324c9-8c25-4e76-a87c-ce123b6864af",
    currency: "CAD",
    balance: 0
  },
  {
    _id: "324f4e5c-9388-5g71-9450-6eb7ec4g9d30",
    createdAt: "2024-01-18T11:30:15.789+00:00",
    updatedAt: "2024-08-20T14:25:33.123+00:00",
    accountId: "73829f24-6523-5d99-c321-62c5f613g75",
    userId: "2ef435da-9d36-5e87-b98d-df234c7975bg",
    currency: "USD",
    balance: 1250
  }
];

const walletHistoryMockData: WalletHistoryData[] = [
  {
    _id: "c259b947-3238-40fc-8e2c-d06f75f62a8e",
    createdAt: "2024-01-31T14:20:57.367+00:00",
    updatedAt: "2024-01-31T14:20:57.367+00:00",
    userId: "48596d04-d980-4e53-b0fa-853efd308f21",
    walletId: "bdb08754-f18e-491f-9771-07984d57e525",
    transactionReference: "db0cf505-3a67-4339-a56d-269e554bbc7d",
    previousBalance: 0,
    currentBalance: 201
  },
  {
    _id: "d360c058-4349-51gd-9f3d-e17g86g73b9f",
    createdAt: "2024-01-25T10:15:33.123+00:00",
    updatedAt: "2024-01-25T10:15:33.123+00:00",
    userId: "2ef435da-9d36-5e87-b98d-df234c7975bg",
    walletId: "324f4e5c-9388-5g71-9450-6eb7ec4g9d30",
    transactionReference: "ec1dg616-4b78-5450-b67e-380g665cce8e",
    previousBalance: 1000,
    currentBalance: 1250
  }
];

const vendorTransactionResponseTrailMockData: VendorTransactionResponseTrailData[] = [
  {
    _id: "e4de197c-cb43-4f82-b771-bfb464c77a5b",
    createdAt: "2024-01-20T13:28:45.869+00:00",
    updatedAt: "2024-01-20T13:28:45.869+00:00",
    vendor: "PAYMENT_VENDOR_NOMBA",
    vendorReference: "APP-TRANSFER-17057-1705757271536",
    processingMessage: "SUCCESS",
    transactionId: "b5ce0bbf-1023-4c72-9ba2-3c50600cfca5",
    transactionStatus: "SUCCESS"
  },
  {
    _id: "f5ef208d-dc54-5g93-c882-cgc575d88b6c",
    createdAt: "2024-01-18T09:46:33.789+00:00",
    updatedAt: "2024-01-18T09:46:33.789+00:00",
    vendor: "PAYMENT_VENDOR_STRIPE",
    vendorReference: "APP-TRANSFER-17056-1705645512456",
    processingMessage: "SUCCESS",
    transactionId: "c6df1ccg-2134-5d83-0cb3-4d61711dgdb6",
    transactionStatus: "SUCCESS"
  }
];

const userReferralMockData: UserReferralData[] = [
  {
    _id: "7c9f9063-c508-410f-a9dd-e151c53a05cd",
    createdAt: "2024-01-20T13:03:47.162+00:00",
    updatedAt: "2024-01-20T13:03:47.162+00:00",
    userId: "1de324c9-8c25-4e76-a87c-ce123b6864af",
    referralCode: "ISAA9J0E"
  },
  {
    _id: "8d0g0174-d619-521g-b0ee-f262d64b16de",
    createdAt: "2024-01-18T10:20:15.456+00:00",
    updatedAt: "2024-01-18T10:20:15.456+00:00",
    userId: "2ef435da-9d36-5e87-b98d-df234c7975bg",
    referralCode: "SARA8K2T"
  }
];

const userKycDetailMockData: UserKycDetailData[] = [
  {
    _id: "c8ef7c9f-644a-4258-8482-1aa961464f13",
    createdAt: "2024-01-20T13:00:04.557+00:00",
    updatedAt: "2024-01-20T13:00:04.733+00:00",
    userId: "9c9e9318-e4ee-42a2-9f89-4aebd8619248",
    kycRequirement: "PHONE",
    kycId: "3feb1c22-1d14-4302-918c-8f283a7e34b7",
    verified: false,
    vendor: "TWILIO",
    vendorReference: "+16138935286"
  },
  {
    _id: "d9fg8d0g-755b-5369-9593-2bb072575g24",
    createdAt: "2024-01-18T09:45:33.789+00:00",
    updatedAt: "2024-01-18T09:45:33.789+00:00",
    userId: "2ef435da-9d36-5e87-b98d-df234c7975bg",
    kycRequirement: "ID_VERIFICATION",
    kycId: "4e7c2d33-2e25-5413-029d-9f394a8e45c8",
    verified: true,
    vendor: "JUMIO",
    vendorReference: "IDV-2024011809455"
  }
];

const userKycMockData: UserKycData[] = [
  {
    _id: "648c04ee-a2a1-4ba4-917d-c350a7f0bfb1",
    createdAt: "2024-01-20T13:04:15.015+00:00",
    updatedAt: "2024-01-20T13:04:15.015+00:00",
    userId: "1de324c9-8c25-4e76-a87c-ce123b6864af",
    currency: "CAD",
    kycId: "3feb1c22-1d14-4302-918c-8f283a7e34b7"
  },
  {
    _id: "759d15ff-b3b2-5cb5-028e-d461b8g1cgc2",
    createdAt: "2024-01-18T10:30:25.456+00:00",
    updatedAt: "2024-01-18T10:30:25.456+00:00",
    userId: "2ef435da-9d36-5e87-b98d-df234c7975bg",
    currency: "USD",
    kycId: "4e7c2d33-2e25-5413-029d-9f394a8e45c8"
  }
];

const userAuthMockData: UserAuthData[] = [
  {
    _id: "70e090dc-b187-4088-bf50-fba1dd7b1e8b",
    createdAt: "2024-01-20T13:42:17.225+00:00",
    updatedAt: "2025-02-23T14:09:52.309+00:00",
    userId: "e5a78e1f-df19-4b6c-97ac-0884ad98b8ec",
    passwordHash: "$2b$10$P/XCuRRup6J.3s/23BGBu.00M3yvz3ofUIHMvQ49pixxIzfTUcGU2",
    transactionPinHash: "$2b$10$R//QfQJJ/iB1xZ8egOmXje/3mEKPpg95wzNVgRuyJOYkc.rPlpHMm"
  },
  {
    _id: "81f101ed-c298-5199-cg61-gcb2ee8c2f9c",
    createdAt: "2024-01-18T11:15:45.789+00:00",
    updatedAt: "2025-02-20T10:22:33.456+00:00",
    userId: "2ef435da-9d36-5e87-b98d-df234c7975bg",
    passwordHash: "$2b$10$Q0YDuSSuq7J4s024CGCDv.11N4yvz4pgVJINvQ50qjyyzJgUVdGV3",
    transactionPinHash: "$2b$10$S11RgRKK0jC2t29fgPnYkf04nFLQqh06xzOWgStzKPZlc/sSmpINn"
  }
];

// API Functions for existing collections
import { 
  getKycData as fetchKycFromMongoDB,
  getActivityData as fetchActivityFromMongoDB,
  getRewardData as fetchRewardFromMongoDB,
  getTransactionData as fetchTransactionFromMongoDB,
  getTransactionEntryData as fetchTransactionEntryFromMongoDB,
  getUserData as fetchUserFromMongoDB,
  getWalletData as fetchWalletFromMongoDB,
  getWalletHistoryData as fetchWalletHistoryFromMongoDB,
  getVendorTransactionResponseTrailData as fetchVendorResponseFromMongoDB,
  getUserReferralData as fetchUserReferralFromMongoDB,
  getUserKycDetailData as fetchUserKycDetailFromMongoDB,
  getUserKycData as fetchUserKycFromMongoDB,
  getUserAuthData as fetchUserAuthFromMongoDB,
  authenticateUser as authenticateUserFromMongoDB,
  registerUser as registerUserFromMongoDB,
  getDashboardStats as fetchDashboardStatsFromMongoDB
} from './mongodb/services';

export async function fetchKycData(): Promise<KycData[]> {
  try {
    const data = await fetchKycFromMongoDB();
    return data.length ? data : kycMockData;
  } catch (error) {
    console.error("Error fetching KYC data from MongoDB, using mock data:", error);
    return kycMockData;
  }
}

export async function fetchActivityData(): Promise<ActivityData[]> {
  try {
    const data = await fetchActivityFromMongoDB();
    return data.length ? data : activityMockData;
  } catch (error) {
    console.error("Error fetching activity data from MongoDB, using mock data:", error);
    return activityMockData;
  }
}

export async function fetchRewardData(): Promise<RewardData[]> {
  try {
    const data = await fetchRewardFromMongoDB();
    return data.length ? data : rewardMockData;
  } catch (error) {
    console.error("Error fetching reward data from MongoDB, using mock data:", error);
    return rewardMockData;
  }
}

export async function fetchTransactionData(): Promise<TransactionData[]> {
  try {
    const data = await fetchTransactionFromMongoDB();
    return data.length ? data : transactionMockData;
  } catch (error) {
    console.error("Error fetching transaction data from MongoDB, using mock data:", error);
    return transactionMockData;
  }
}

export async function fetchTransactionEntryData(): Promise<TransactionEntryData[]> {
  try {
    const data = await fetchTransactionEntryFromMongoDB();
    return data.length ? data : transactionEntryMockData;
  } catch (error) {
    console.error("Error fetching transaction entry data from MongoDB, using mock data:", error);
    return transactionEntryMockData;
  }
}

export async function fetchUserData(): Promise<UserData[]> {
  try {
    const data = await fetchUserFromMongoDB();
    return data.length ? data : userMockData;
  } catch (error) {
    console.error("Error fetching user data from MongoDB, using mock data:", error);
    return userMockData;
  }
}

export async function fetchWalletData(): Promise<WalletData[]> {
  try {
    const data = await fetchWalletFromMongoDB();
    return data.length ? data : walletMockData;
  } catch (error) {
    console.error("Error fetching wallet data from MongoDB, using mock data:", error);
    return walletMockData;
  }
}

export async function fetchWalletHistoryData(): Promise<WalletHistoryData[]> {
  try {
    const data = await fetchWalletHistoryFromMongoDB();
    return data.length ? data : walletHistoryMockData;
  } catch (error) {
    console.error("Error fetching wallet history data from MongoDB, using mock data:", error);
    return walletHistoryMockData;
  }
}

export async function fetchVendorTransactionResponseTrailData(): Promise<VendorTransactionResponseTrailData[]> {
  try {
    const data = await fetchVendorResponseFromMongoDB();
    return data.length ? data : vendorTransactionResponseTrailMockData;
  } catch (error) {
    console.error("Error fetching vendor transaction response trail data from MongoDB, using mock data:", error);
    return vendorTransactionResponseTrailMockData;
  }
}

export async function fetchUserReferralData(): Promise<UserReferralData[]> {
  try {
    const data = await fetchUserReferralFromMongoDB();
    return data.length ? data : userReferralMockData;
  } catch (error) {
    console.error("Error fetching user referral data from MongoDB, using mock data:", error);
    return userReferralMockData;
  }
}

export async function fetchUserKycDetailData(): Promise<UserKycDetailData[]> {
  try {
    const data = await fetchUserKycDetailFromMongoDB();
    return data.length ? data : userKycDetailMockData;
  } catch (error) {
    console.error("Error fetching user KYC detail data from MongoDB, using mock data:", error);
    return userKycDetailMockData;
  }
}

export async function fetchUserKycData(): Promise<UserKycData[]> {
  try {
    const data = await fetchUserKycFromMongoDB();
    return data.length ? data : userKycMockData;
  } catch (error) {
    console.error("Error fetching user KYC data from MongoDB, using mock data:", error);
    return userKycMockData;
  }
}

export async function fetchUserAuthData(): Promise<UserAuthData[]> {
  try {
    const data = await fetchUserAuthFromMongoDB();
    return data.length ? data : userAuthMockData;
  } catch (error) {
    console.error("Error fetching user auth data from MongoDB, using mock data:", error);
    return userAuthMockData;
  }
}

// Authentication functions
export async function login(email: string, password: string): Promise<{user: UserData, token: string} | null> {
  try {
    return await authenticateUserFromMongoDB(email, password);
  } catch (error) {
    console.error("Error during login, using mock authentication:", error);
    // Fall back to mock authentication
    const user = userMockData.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return null;
    }
    return {
      user,
      token: `mock-jwt-token-${user._id}`
    };
  }
}

export async function signup(userData: Partial<UserData>): Promise<{user: UserData, token: string} | null> {
  try {
    return await registerUserFromMongoDB(userData);
  } catch (error) {
    console.error("Error during signup, using mock registration:", error);
    // Fall back to mock registration
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
    
    return {
      user: newUser,
      token: `mock-jwt-token-${newUser._id}`
    };
  }
}

// Dashboard stats
export async function fetchDashboardStats() {
  try {
    return await fetchDashboardStatsFromMongoDB();
  } catch (error) {
    console.error("Error fetching dashboard stats from MongoDB, using mock data:", error);
    // Fall back to mock stats
    return {
      totalUsers: 1254,
      activeUsers: 876,
      totalTransactions: transactionMockData.length,
      totalAmount: transactionMockData.reduce((sum, t) => sum + t.amount, 0),
      pendingKyc: 12,
      completedKyc: kycMockData.length,
      recentTransactions: transactionMockData.slice(0, 5),
      recentActivities: activityMockData.slice(0, 5)
    };
  }
}

// Add the update functions
export async function updateKyc(kycData: KycData): Promise<KycData> {
  // Implementation would connect to MongoDB and update the document
  return new Promise((resolve) => {
    // For now, just pretend we updated it and return the data
    setTimeout(() => resolve({
      ...kycData,
      updatedAt: new Date().toISOString()
    }), 500);
  });
}

export async function updateReward(rewardData: RewardData): Promise<RewardData> {
  // Implementation would connect to MongoDB and update the document
  return new Promise((resolve) => {
    // For now, just pretend we updated it and return the data
    setTimeout(() => resolve({
      ...rewardData,
      updatedAt: new Date().toISOString()
    }), 500);
  });
}
