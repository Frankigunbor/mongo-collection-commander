
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { fetchUserData, UserData, updateUser } from '@/lib/api';
import { Users as UsersIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EditDialog, FieldConfig } from '@/components/ui-custom/EditDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Users = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = (updatedData: Record<string, any>) => {
    if (!selectedUser) return;
    
    updateUserMutation.mutate({
      ...selectedUser,
      ...updatedData,
    } as UserData);
  };

  const userFields: FieldConfig[] = [
    { name: '_id', label: 'ID', type: 'text', readOnly: true },
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'lastName', label: 'Last Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'userPhoneNumber', label: 'Phone Number', type: 'text' },
    { name: 'userPhoneNumberCountryCode', label: 'Country Code', type: 'text' },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'SUSPENDED', label: 'Suspended' },
        { value: 'BLOCKED', label: 'Blocked' }
      ] 
    },
    { name: 'userPhoneNumberActivated', label: 'Phone Verified', type: 'switch' },
    { name: 'userEmailActivated', label: 'Email Verified', type: 'switch' },
    { name: 'securityQuestionEnabled', label: 'Security Question', type: 'switch' },
    { name: 'transactionPinEnabled', label: 'Transaction PIN', type: 'switch' },
    { 
      name: 'countryCurrencyCode', 
      label: 'Currency', 
      type: 'select',
      options: [
        { value: 'CAD', label: 'Canadian Dollar (CAD)' },
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
        { value: 'GBP', label: 'British Pound (GBP)' }
      ] 
    },
    { name: 'userGroup', label: 'User Group', type: 'select',
      options: [
        { value: 'USER', label: 'Regular User' },
        { value: 'ADMIN', label: 'Administrator' },
        { value: 'SALES_FORCE', label: 'Sales Force' },
        { value: 'SUPPORT', label: 'Support' }
      ]
    }
  ];

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
      key: 'userPhoneNumber',
      header: 'Phone',
      sortable: true,
      cell: (row: UserData) => `${row.userPhoneNumberCountryCode} ${row.userPhoneNumber}`,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row: UserData) => (
        <Badge variant={
          row.status === 'ACTIVE' ? 'default' :
          row.status === 'INACTIVE' ? 'secondary' :
          row.status === 'SUSPENDED' ? 'warning' : 'destructive'
        }>
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
            // In a real app, this would navigate to a user detail page
            // For now, we can navigate to the profile page
            if (user) {
              navigate(`/profile?id=${user._id}`);
            }
          }}
          onEdit={handleEditUser}
        />
      )}

      {selectedUser && (
        <EditDialog
          title="Edit User"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveUser}
          fields={userFields}
          initialData={selectedUser}
          isLoading={updateUserMutation.isPending}
        />
      )}
    </div>
  );
};

export default Users;
