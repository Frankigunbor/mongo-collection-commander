
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Kyc from "./pages/Kyc";
import Activities from "./pages/Activities";
import Rewards from "./pages/Rewards";
import Transactions from "./pages/Transactions";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";

// New pages
import TransactionEntries from "./pages/TransactionEntries";
import Users from "./pages/Users";
import Wallets from "./pages/Wallets";
import WalletHistory from "./pages/WalletHistory";
import VendorResponses from "./pages/VendorResponses";
import UserReferrals from "./pages/UserReferrals";
import UserKycDetails from "./pages/UserKycDetails";
import UserKycs from "./pages/UserKycs";
import UserAuth from "./pages/UserAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<AdminLayout requireAuth={false}><Index /></AdminLayout>} />
            <Route path="/auth/login" element={<AdminLayout requireAuth={false}><Login /></AdminLayout>} />
            <Route path="/auth/signup" element={<AdminLayout requireAuth={false}><SignUp /></AdminLayout>} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/kyc" element={<ProtectedRoute><Kyc /></ProtectedRoute>} />
            <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
            <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            
            {/* New protected routes */}
            <Route path="/transaction-entries" element={<ProtectedRoute><TransactionEntries /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/wallets" element={<ProtectedRoute><Wallets /></ProtectedRoute>} />
            <Route path="/wallet-history" element={<ProtectedRoute><WalletHistory /></ProtectedRoute>} />
            <Route path="/vendor-responses" element={<ProtectedRoute><VendorResponses /></ProtectedRoute>} />
            <Route path="/user-referrals" element={<ProtectedRoute><UserReferrals /></ProtectedRoute>} />
            <Route path="/user-kyc-details" element={<ProtectedRoute><UserKycDetails /></ProtectedRoute>} />
            <Route path="/user-kycs" element={<ProtectedRoute><UserKycs /></ProtectedRoute>} />
            <Route path="/user-auth" element={<ProtectedRoute><UserAuth /></ProtectedRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<AdminLayout requireAuth={false}><NotFound /></AdminLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
