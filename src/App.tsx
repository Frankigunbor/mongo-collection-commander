
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

import Rewards from "./pages/Rewards";
import Transactions from "./pages/Transactions";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

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
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import RecentUserActivities from "./pages/RecentUserActivities";

// Create QueryClient outside of component to avoid recreation on render
const queryClient = new QueryClient();

// Use a function component with explicit return
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<AdminLayout requireAuth={false}><Index /></AdminLayout>} />
              <Route path="/auth/login" element={<AdminLayout requireAuth={false}><Login /></AdminLayout>} />
              <Route path="/auth/forgot-password" element={<AdminLayout requireAuth={false}><ForgotPassword /></AdminLayout>} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<AdminLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AdminLayout>} />
            
              <Route path="/rewards" element={<AdminLayout><ProtectedRoute><Rewards /></ProtectedRoute></AdminLayout>} />
              <Route path="/transactions" element={<AdminLayout><ProtectedRoute><Transactions /></ProtectedRoute></AdminLayout>} />
              
              {/* New protected routes */}
              <Route path="/transaction-entries" element={<AdminLayout><ProtectedRoute><TransactionEntries /></ProtectedRoute></AdminLayout>} />
              <Route path="/users" element={<AdminLayout><ProtectedRoute><Users /></ProtectedRoute></AdminLayout>} />
              <Route path="/wallets" element={<AdminLayout><ProtectedRoute><Wallets /></ProtectedRoute></AdminLayout>} />
              <Route path="/wallet-history" element={<AdminLayout><ProtectedRoute><WalletHistory /></ProtectedRoute></AdminLayout>} />
              <Route path="/vendor-responses" element={<AdminLayout><ProtectedRoute><VendorResponses /></ProtectedRoute></AdminLayout>} />
              <Route path="/user-referrals" element={<AdminLayout><ProtectedRoute><UserReferrals /></ProtectedRoute></AdminLayout>} />
              <Route path="/user-kyc-details" element={<AdminLayout><ProtectedRoute><UserKycDetails /></ProtectedRoute></AdminLayout>} />
              <Route path="/user-kycs" element={<AdminLayout><ProtectedRoute><UserKycs /></ProtectedRoute></AdminLayout>} />
              <Route path="/user-auth" element={<AdminLayout><ProtectedRoute><UserAuth /></ProtectedRoute></AdminLayout>} />
              <Route path="/profile" element={<AdminLayout><ProtectedRoute><Profile /></ProtectedRoute></AdminLayout>} />
              <Route path="/settings" element={<AdminLayout><ProtectedRoute><Settings /></ProtectedRoute></AdminLayout>} />
              <Route path="/recent-user-activities" element={<AdminLayout><ProtectedRoute><RecentUserActivities /></ProtectedRoute></AdminLayout>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<AdminLayout requireAuth={false}><NotFound /></AdminLayout>} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
