
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
            <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/kyc" element={<AdminLayout><Kyc /></AdminLayout>} />
            <Route path="/activities" element={<AdminLayout><Activities /></AdminLayout>} />
            <Route path="/rewards" element={<AdminLayout><Rewards /></AdminLayout>} />
            <Route path="/transactions" element={<AdminLayout><Transactions /></AdminLayout>} />
            
            {/* New protected routes */}
            <Route path="/transaction-entries" element={<AdminLayout><TransactionEntries /></AdminLayout>} />
            <Route path="/users" element={<AdminLayout><Users /></AdminLayout>} />
            <Route path="/wallets" element={<AdminLayout><Wallets /></AdminLayout>} />
            <Route path="/wallet-history" element={<AdminLayout><WalletHistory /></AdminLayout>} />
            <Route path="/vendor-responses" element={<AdminLayout><VendorResponses /></AdminLayout>} />
            <Route path="/user-referrals" element={<AdminLayout><UserReferrals /></AdminLayout>} />
            <Route path="/user-kyc-details" element={<AdminLayout><UserKycDetails /></AdminLayout>} />
            <Route path="/user-kycs" element={<AdminLayout><UserKycs /></AdminLayout>} />
            <Route path="/user-auth" element={<AdminLayout><UserAuth /></AdminLayout>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<AdminLayout requireAuth={false}><NotFound /></AdminLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
