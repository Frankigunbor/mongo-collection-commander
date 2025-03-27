
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui-custom/DataTable';
import { 
  fetchUserKycData, 
  UserKycData, 
  fetchUserData, 
  fetchKycData,
  updateUserKyc
} from '@/lib/api';
import { Shield, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { EditDialog, FieldConfig } from '@/components/ui-custom/EditDialog';
import { Button } from '@/components/ui/button';

const UserKycs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedUserKyc, setSelectedUserKyc] = useState<UserKycData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: userKycs, isLoading } = useQuery({
    queryKey: ['userKycs'],
    queryFn: fetchUserKycData
  });
  
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  const { data: kycLevels } = useQuery({
    queryKey: ['kyc'],
    queryFn: fetchKycData
  });

  const updateUserKycMutation = useMutation({
    mutationFn: updateUserKyc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userKycs'] });
      toast({
        title: 'Success',
        description: 'User KYC level updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update user KYC level: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Create maps for quick lookups
  const userMap = React.useMemo(() => {
    if (!users) return {};
    
    return users.reduce((acc, user) => {
      acc[user._id] = `${user.firstName} ${user.lastName}`;
      return acc;
    }, {} as Record<string, string>);
  }, [users]);

  const kycLevelMap = React.useMemo(() => {
    if (!kycLevels) return {};
    
    return kycLevels.reduce((acc, kyc) => {
      acc[kyc._id] = kyc.kycLevel;
      return acc;
    }, {} as Record<string, string>);
  }, [kycLevels]);

  const handleEditUserKyc = (userKyc: UserKycData) => {
    setSelectedUserKyc(userKyc);
    setIsEditDialogOpen(true);
  };

  const handleSaveUserKyc = (updatedData: Record<string, any>) => {
    if (!selectedUserKyc) return;
    
    updateUserKycMutation.mutate({
      ...selectedUserKyc,
      ...updatedData,
    } as UserKycData);
  };

  const userKycFields: FieldConfig[] = [
    { name: '_id', label: 'ID', type: 'text', readOnly: true },
    { 
      name: 'userId', 
      label: 'User', 
      type: 'select',
      options: users?.map(user => ({
        value: user._id,
        label: `${user.firstName} ${user.lastName}`
      })) || [],
      readOnly: true
    },
    { 
      name: 'currency', 
      label: 'Currency', 
      type: 'select',
      options: [
        { value: 'CAD', label: 'Canadian Dollar (CAD)' },
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
        { value: 'GBP', label: 'British Pound (GBP)' }
      ] 
    },
    { 
      name: 'kycId', 
      label: 'KYC Level', 
      type: 'select',
      options: kycLevels?.map(kyc => ({
        value: kyc._id,
        label: kyc.kycLevel
      })) || []
    },
    { name: 'createdAt', label: 'Created At', type: 'date', readOnly: true },
    { name: 'updatedAt', label: 'Updated At', type: 'date', readOnly: true }
  ];

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: UserKycData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: UserKycData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'currency',
      header: 'Currency',
      sortable: true,
    },
    {
      key: 'kycId',
      header: 'KYC Level',
      sortable: true,
      cell: (row: UserKycData) => {
        const level = kycLevelMap[row.kycId] || 'Unknown';
        return (
          <Badge variant="outline" className="font-semibold">
            {level}
          </Badge>
        );
      }
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: UserKycData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      sortable: true,
      cell: (row: UserKycData) => format(new Date(row.updatedAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">User KYC Levels</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable 
          data={userKycs || []} 
          columns={columns} 
          onView={(userKyc) => {
            console.log("View user KYC", userKyc);
          }}
          onEdit={handleEditUserKyc}
        />
      )}

      {selectedUserKyc && (
        <EditDialog
          title="Edit User KYC Level"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveUserKyc}
          fields={userKycFields}
          initialData={selectedUserKyc}
          isLoading={updateUserKycMutation.isPending}
        />
      )}
    </div>
  );
};

export default UserKycs;
