
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditDialog, FieldConfig } from '@/components/ui-custom/EditDialog';
import { Button } from '@/components/ui/button';
import { fetchUserData, fetchUserKycDetailData, updateUserKycDetail } from '@/lib/api';

// Define the UserKycDetailData interface since it's used in the mock function
export interface UserKycDetailData {
  _id: string;
  userId: string;
  documentType: string;
  kycRequirement: string;
  kycId: string;
  status: string;
  verified: boolean;
  vendor: string;
  vendorReference: string;
  submittedAt?: string;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const UserKycDetails = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDetail, setSelectedDetail] = useState<UserKycDetailData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: userKycDetails, isLoading } = useQuery({
    queryKey: ['userKycDetails'],
    queryFn: fetchUserKycDetailData
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  // Create map for user lookup
  const userMap = React.useMemo(() => {
    if (!users) return {};
    
    return users.reduce((acc, user) => {
      acc[user._id] = `${user.firstName} ${user.lastName}`;
      return acc;
    }, {} as Record<string, string>);
  }, [users]);

  const updateUserKycDetailMutation = useMutation({
    mutationFn: updateUserKycDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userKycDetails'] });
      toast({
        title: 'Success',
        description: 'KYC document status updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update KYC document status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const handleEditDetail = (detail: UserKycDetailData) => {
    setSelectedDetail(detail);
    setIsEditDialogOpen(true);
  };

  const handleSaveDetail = (updatedData: Record<string, any>) => {
    if (!selectedDetail) return;
    
    // If verified status changed to true, set verifiedAt to current time
    const verifiedChanged = selectedDetail.verified !== updatedData.verified;
    const newVerifiedAt = verifiedChanged && updatedData.verified 
      ? new Date().toISOString() 
      : updatedData.verifiedAt;
    
    updateUserKycDetailMutation.mutate({
      ...selectedDetail,
      ...updatedData,
      verifiedAt: newVerifiedAt
    } as UserKycDetailData);
  };

  const userKycDetailFields: FieldConfig[] = [
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
      name: 'documentType', 
      label: 'Document Type', 
      type: 'select',
      options: [
        { value: 'Passport', label: 'Passport' },
        { value: 'National ID', label: 'National ID' },
        { value: 'Driver License', label: 'Driver License' },
        { value: 'PHONE', label: 'Phone Verification' },
        { value: 'ID_VERIFICATION', label: 'ID Verification' },
        { value: 'ADDRESS_VERIFICATION', label: 'Address Verification' }
      ]
    },
    { name: 'kycRequirement', label: 'KYC Requirement', type: 'text' },
    { name: 'kycId', label: 'KYC ID', type: 'text', readOnly: true },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'verified', label: 'Verified' },
        { value: 'rejected', label: 'Rejected' }
      ]
    },
    { name: 'verified', label: 'Verified', type: 'switch' },
    { name: 'vendor', label: 'Verification Vendor', type: 'text' },
    { name: 'vendorReference', label: 'Vendor Reference', type: 'text' },
    { name: 'submittedAt', label: 'Submitted At', type: 'date', readOnly: true },
    { name: 'verifiedAt', label: 'Verified At', type: 'date', readOnly: true },
    { name: 'createdAt', label: 'Created At', type: 'date', readOnly: true },
    { name: 'updatedAt', label: 'Updated At', type: 'date', readOnly: true }
  ];

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: UserKycDetailData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: UserKycDetailData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'documentType',
      header: 'Document Type',
      sortable: true,
      cell: (row: UserKycDetailData) => row.documentType || row.kycRequirement,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row: UserKycDetailData) => (
        <Badge variant={
          row.status === 'verified' || row.verified ? 'default' : 
          row.status === 'pending' ? 'secondary' : 'destructive'
        }>
          {row.status || (row.verified ? 'verified' : 'pending')}
        </Badge>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Submitted At',
      sortable: true,
      cell: (row: UserKycDetailData) => row.submittedAt ? format(new Date(row.submittedAt), 'MMM dd, yyyy') : format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
    {
      key: 'verifiedAt',
      header: 'Verified At',
      sortable: true,
      cell: (row: UserKycDetailData) => row.verifiedAt ? format(new Date(row.verifiedAt), 'MMM dd, yyyy') : '-',
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FileCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">KYC Document Details</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable 
          data={userKycDetails || []} 
          columns={columns} 
          onView={(detail) => {
            console.log("View KYC detail", detail);
          }}
          onEdit={handleEditDetail}
        />
      )}

      {selectedDetail && (
        <EditDialog
          title="Edit KYC Document Details"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveDetail}
          fields={userKycDetailFields}
          initialData={selectedDetail}
          isLoading={updateUserKycDetailMutation.isPending}
        />
      )}
    </div>
  );
};

export default UserKycDetails;
