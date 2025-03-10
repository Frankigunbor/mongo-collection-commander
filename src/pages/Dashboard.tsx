
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchDashboardStats } from '@/lib/api';
import { 
  Users, 
  CreditCard, 
  Award, 
  UserCheck, 
  TrendingUp, 
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  transactionVolume: number;
  totalRewards: number;
  activeRewards: number;
  kycVerified: number;
  pendingKyc: number;
  transactionsByDay: { date: string; count: number }[];
  usersByDay: { date: string; count: number }[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data as DashboardStats);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format chart data
  const formattedTransactionData = stats?.transactionsByDay.map(day => ({
    ...day,
    date: formatDate(day.date)
  }));

  const formattedUserData = stats?.usersByDay.map(day => ({
    ...day,
    date: formatDate(day.date)
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="dashboard-card animate-pulse-soft">
              <CardHeader className="dashboard-card-header">
                <CardTitle className="text-sm font-medium h-4 bg-muted rounded" />
                <div className="h-8 w-8 rounded-full bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-3/4" />
                <p className="text-xs text-muted-foreground mt-2 h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Users" 
              value={stats?.totalUsers || 0} 
              subtitle={`${stats?.activeUsers || 0} active users`}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              trend={7.2}
            />
            <StatCard 
              title="Transaction Volume" 
              value={formatCurrency(stats?.transactionVolume || 0)} 
              subtitle={`${stats?.totalTransactions || 0} transactions`}
              icon={<CreditCard className="h-6 w-6 text-green-600" />}
              trend={12.5}
            />
            <StatCard 
              title="Total Rewards" 
              value={formatCurrency(stats?.totalRewards || 0)} 
              subtitle={`${stats?.activeRewards || 0} active rewards`}
              icon={<Award className="h-6 w-6 text-purple-600" />}
              trend={5.3}
            />
            <StatCard 
              title="KYC Verified" 
              value={stats?.kycVerified || 0} 
              subtitle={`${stats?.pendingKyc || 0} pending verification`}
              icon={<UserCheck className="h-6 w-6 text-orange-600" />}
              trend={9.1}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Transaction Activity</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formattedTransactionData}>
                    <defs>
                      <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      vertical={false}
                      stroke="hsl(var(--border))" 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        color: 'hsl(var(--card-foreground))'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      name="Transactions"
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorTx)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">New Users</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedUserData}>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      vertical={false}
                      stroke="hsl(var(--border))" 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        color: 'hsl(var(--card-foreground))'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="New Users"
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
}

const StatCard = ({ title, value, subtitle, icon, trend }: StatCardProps) => (
  <Card className="dashboard-card">
    <CardHeader className="dashboard-card-header">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="dashboard-card-content">{value}</div>
      <div className="flex items-center mt-1">
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        {trend && (
          <div className="flex items-center ml-auto text-xs font-medium text-green-600">
            <ArrowUpRight className="h-3 w-3 mr-0.5" />
            {trend}%
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;
