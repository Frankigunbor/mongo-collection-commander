
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchWalletHistoryData, WalletHistoryData, fetchUserData } from '@/lib/api';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

const WalletHistory = () => {
  const { data: walletHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['walletHistory'],
    queryFn: fetchWalletHistoryData
  });
  
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  // Create a map of user IDs to user names for quick lookup
  const userMap = React.useMemo(() => {
    if (!users) return {};
    
    return users.reduce((acc, user) => {
      acc[user._id] = `${user.firstName} ${user.lastName}`;
      return acc;
    }, {} as Record<string, string>);
  }, [users]);

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: WalletHistoryData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: WalletHistoryData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'walletId',
      header: 'Wallet ID',
      cell: (row: WalletHistoryData) => row.walletId.substring(0, 8) + '...',
    },
    {
      key: 'transactionReference',
      header: 'Transaction Reference',
      cell: (row: WalletHistoryData) => row.transactionReference.substring(0, 8) + '...',
    },
    {
      key: 'balanceChange',
      header: 'Balance Change',
      sortable: true,
      cell: (row: WalletHistoryData) => {
        const change = row.currentBalance - row.previousBalance;
        const isPositive = change >= 0;
        return (
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {isPositive ? '+' : ''}{change.toLocaleString()}
          </div>
        );
      },
    },
    {
      key: 'previousBalance',
      header: 'Previous Balance',
      sortable: true,
      cell: (row: WalletHistoryData) => row.previousBalance.toLocaleString(),
    },
    {
      key: 'currentBalance',
      header: 'Current Balance',
      sortable: true,
      cell: (row: WalletHistoryData) => row.currentBalance.toLocaleString(),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: WalletHistoryData) => format(new Date(row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
  ];

  return (
   
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <History className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Wallet History</h1>
          </div>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable 
            data={walletHistory || []} 
            columns={columns} 
            onView={(history) => {
              console.log("View history", history);
            }}
          />
        )}
      </div>
  
  );
};

export default WalletHistory;
