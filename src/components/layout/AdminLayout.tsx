
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Handle redirection if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">You need to be logged in to access this page</h1>
        <div className="space-x-4">
          <Button onClick={() => navigate('/auth/login')}>
            Sign In
          </Button>
          <Button variant="outline" onClick={() => navigate('/auth/signup')}>
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-[70px]'}`}>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}
