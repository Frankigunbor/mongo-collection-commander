
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchUserAuthData, UserAuthData, fetchUserData } from '@/lib/api';
import { Lock } from 'lucide-react';

const UserAuth = () => {
  const { data: userAuth, isLoading } = useQuery({
    queryKey: ['userAuth'],
    queryFn: fetchUserAuthData
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
      cell: (row: UserAuthData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: UserAuthData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'passwordHash',
      header: 'Password Hash',
      cell: (row: UserAuthData) => (
        <div className="flex items-center">
          <code className="bg-gray-100 px-2 py-1 rounded text-xs truncate w-32">
            {row.passwordHash.substring(0, 16)}...
          </code>
        </div>
      ),
    },
    {
      key: 'hasTransactionPin',
      header: 'Transaction PIN',
      cell: (row: UserAuthData) => row.transactionPinHash ? 'Set' : 'Not set',
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: UserAuthData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      sortable: true,
      cell: (row: UserAuthData) => format(new Date(row.updatedAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Lock className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">User Authentication</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable 
          data={userAuth || []} 
          columns={columns} 
          onView={(auth) => {
            console.log("View auth", auth);
          }}
        />
      )}
    </div>
  );
};

export default UserAuth;
