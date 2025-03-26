
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { fetchUserData, UserData } from '@/lib/api';
import { Users as UsersIcon } from 'lucide-react';

const Users = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: UserData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'firstName',
      header: 'First Name',
      sortable: true,
    },
    {
      key: 'lastName',
      header: 'Last Name',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'phone',
      header: 'Phone',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row: UserData) => (
        <Badge variant={row.status === 'active' ? 'default' : 'destructive'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: UserData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
  ];

  return (
  
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Users</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable 
            data={users || []} 
            columns={columns} 
            onView={(user) => {
              console.log("View user", user);
            }}
          />
        )}
      </div>
   
  );
};

export default Users;
