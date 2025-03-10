
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchDashboardStats, fetchTransactionData, fetchActivityData } from '@/lib/api';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { 
  Users, 
  CreditCard, 
  BarChart, 
  DollarSign, 
  FileCheck, 
  Clock
} from 'lucide-react';
import { BarChart as ReChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsData = await fetchDashboardStats();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const formatCurrency = (amount: number, currency = 'CAD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Placeholder chart data - in a real app, this would be calculated from transaction data
  const chartData = [
    { name: 'Jan', transfers: 2400, deposits: 4000, withdrawals: 1000 },
    { name: 'Feb', transfers: 1398, deposits: 3000, withdrawals: 800 },
    { name: 'Mar', transfers: 9800, deposits: 2000, withdrawals: 1700 },
    { name: 'Apr', transfers: 3908, deposits: 2780, withdrawals: 500 },
    { name: 'May', transfers: 4800, deposits: 1890, withdrawals: 700 },
    { name: 'Jun', transfers: 3800, deposits: 2390, withdrawals: 900 },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <CardDescription>Active & Inactive</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">{stats?.activeUsers.toLocaleString()}</span> currently active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CardDescription>Across all accounts</CardDescription>
            </div>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTransactions.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <CardDescription>All currencies</CardDescription>
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalAmount)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
              <CardDescription>Verification levels</CardDescription>
            </div>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedKyc} verified</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-500 font-medium">{stats?.pendingKyc}</span> pending verification
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Transaction Overview</CardTitle>
            <CardDescription>
              Monthly transaction volume by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="transfers" fill="#3b82f6" name="Transfers" />
                  <Bar dataKey="deposits" fill="#10b981" name="Deposits" />
                  <Bar dataKey="withdrawals" fill="#f59e0b" name="Withdrawals" />
                </ReChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Last 5 transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentTransactions.map((tx: any, index: number) => (
                <div key={tx._id} className="flex items-center">
                  <div className={`rounded-full p-2 mr-3 ${
                    tx.transactionType === 'DEPOSIT' ? 'bg-green-100' : 
                    tx.transactionType === 'WITHDRAW' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {tx.transactionType === 'DEPOSIT' ? (
                      <DollarSign className="h-4 w-4 text-green-600" />
                    ) : tx.transactionType === 'WITHDRAW' ? (
                      <CreditCard className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <BarChart className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium">{tx.transactionType}</div>
                      <div className="text-right font-semibold">{formatCurrency(tx.amount, tx.currency)}</div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div>{formatDate(tx.createdAt)}</div>
                      <StatusBadge status={tx.transactionStatus} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Last 5 user activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivities.map((activity: any, index: number) => (
                <div key={activity._id} className="flex items-center">
                  <div className="rounded-full p-2 mr-3 bg-blue-100">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium line-clamp-1">{activity.description}</div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div>{formatDate(activity.createdAt)}</div>
                      <StatusBadge status={activity.recentUserActivityType} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
