
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchUserKycDetailData, UserKycDetailData, fetchUserData } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { FileCheck } from 'lucide-react';

const UserKycDetails = () => {
  const { data: kycDetails, isLoading } = useQuery({
    queryKey: ['userKycDetails'],
    queryFn: fetchUserKycDetailData
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
      cell: (row: UserKycDetailData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: UserKycDetailData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'kycRequirement',
      header: 'KYC Requirement',
      sortable: true,
    },
    {
      key: 'kycId',
      header: 'KYC ID',
      cell: (row: UserKycDetailData) => row.kycId.substring(0, 8) + '...',
    },
    {
      key: 'verified',
      header: 'Status',
      sortable: true,
      cell: (row: UserKycDetailData) => (
        <Badge variant={row.verified ? 'success' : 'warning'}>
          {row.verified ? 'Verified' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'vendor',
      header: 'Vendor',
      sortable: true,
    },
    {
      key: 'vendorReference',
      header: 'Vendor Reference',
      cell: (row: UserKycDetailData) => 
        row.vendorReference.length > 15 
          ? row.vendorReference.substring(0, 12) + '...' 
          : row.vendorReference,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: UserKycDetailData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FileCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">User KYC Details</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable 
            data={kycDetails || []} 
            columns={columns} 
            onView={(detail) => {
              console.log("View KYC detail", detail);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default UserKycDetails;
