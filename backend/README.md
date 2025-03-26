
# Broadsend Backend API

This is a simple Express server that connects to MongoDB and provides API endpoints for the Broadsend frontend application.

## Setup

1. Make sure you have Node.js installed (version 14 or higher recommended).

2. Install dependencies:
```
cd backend
npm install
```

3. Create a `.env` file with your MongoDB connection string (already done):
```
PORT=5000
MONGODB_URI=mongodb+srv://admin:3iHpVd6snupiW8M0@cluster0.ggagjiv.mongodb.net/broadsend-backend?retryWrites=true
```

4. Start the server:
```
node server.js
```

The server will start on port 5000 (or the port specified in the .env file).

## API Endpoints

The server provides the following endpoints:

- `GET /api/status` - Check MongoDB connection status
- `GET /api/kyc` - Get all KYC data
- `GET /api/activities` - Get all activity data
- `GET /api/rewards` - Get all reward data
- `GET /api/transactions` - Get all transaction data
- `GET /api/transaction-entries` - Get all transaction entry data
- `GET /api/users` - Get all user data
- `GET /api/wallets` - Get all wallet data
- `GET /api/wallet-history` - Get all wallet history data
- `GET /api/vendor-responses` - Get all vendor transaction response trail data
- `GET /api/user-referrals` - Get all user referral data
- `GET /api/user-kyc-details` - Get all user KYC detail data
- `GET /api/user-kycs` - Get all user KYC data
- `GET /api/user-auth` - Get all user auth data
- `POST /api/auth/login` - Authenticate a user
- `POST /api/auth/register` - Register a new user
- `GET /api/dashboard/stats` - Get dashboard statistics

## Important Notes

- This server should ONLY be used for local development.
- The MongoDB connection string contains credentials and should be kept secure.
- In a production environment, you would want to implement proper authentication, input validation, error handling, and security measures.
- The server provides a simple API with minimal functionality. In a real-world scenario, you would want to add more endpoints and features.
