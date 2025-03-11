
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchUserData, UserData } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users as UsersIcon, UserCheck, UserX } from 'lucide-react';

const Users = () => {
  const [activeTab, setActiveTab] = React.useState('all');
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    
    if (activeTab === 'all') return users;
    
    return users.filter(user => 
      user.status.toLowerCase() === activeTab.toLowerCase()
    );
  }, [users, activeTab]);

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: UserData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'fullName',
      header: 'Full Name',
      sortable: true,
      cell: (row: UserData) => {
        const middleName = row.middleName ? ` ${row.middleName} ` : ' ';
        return `${row.firstName}${middleName}${row.lastName}`;
      },
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'userPhoneNumber',
      header: 'Phone',
      cell: (row: UserData) => `${row.userPhoneNumberCountryCode} ${row.userPhoneNumber}`,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row: UserData) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'destructive'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'userGroup',
      header: 'User Group',
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: UserData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Users</h1>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              All Users
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              <UserX className="h-4 w-4" />
              Inactive
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable 
            data={filteredUsers} 
            columns={columns} 
            onView={(user) => {
              console.log("View user", user);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;
