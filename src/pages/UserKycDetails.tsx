
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { fetchUserKycDetailsData, UserKycDetailsData } from '@/lib/api';
import { FileCheck } from 'lucide-react';

const UserKycDetails = () => {
  const { data: kycDetails, isLoading } = useQuery({
    queryKey: ['userKycDetails'],
    queryFn: fetchUserKycDetailsData
  });

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: UserKycDetailsData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User ID',
      cell: (row: UserKycDetailsData) => row.userId.substring(0, 8) + '...',
    },
    {
      key: 'documentType',
      header: 'Document Type',
      sortable: true,
    },
    {
      key: 'documentNumber',
      header: 'Document Number',
      sortable: true,
      cell: (row: UserKycDetailsData) => 
        row.documentNumber.substring(0, 4) + '...' + row.documentNumber.substring(row.documentNumber.length - 4),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row: UserKycDetailsData) => (
        <Badge variant={
          row.status === 'approved' ? 'default' : 
          row.status === 'pending' ? 'outline' : 
          'destructive'
        }>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: UserKycDetailsData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto">
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
