
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchWalletData, WalletData, fetchUserData, UserData } from '@/lib/api';
import { Wallet } from 'lucide-react';

const Wallets = () => {
  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: fetchWalletData
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
      cell: (row: WalletData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'accountId',
      header: 'Account ID',
      cell: (row: WalletData) => row.accountId.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: WalletData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'currency',
      header: 'Currency',
      sortable: true,
    },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      cell: (row: WalletData) => `${row.currency} ${row.balance.toLocaleString()}`,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: WalletData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      sortable: true,
      cell: (row: WalletData) => format(new Date(row.updatedAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Wallets</h1>
          </div>
        </div>

        {walletsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable 
            data={wallets || []} 
            columns={columns} 
            onView={(wallet) => {
              console.log("View wallet", wallet);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Wallets;
