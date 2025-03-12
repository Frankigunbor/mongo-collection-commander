
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { FileCheck } from 'lucide-react';

// Mock data type and fetch function since they're not exported in api.ts
interface UserKycDetailData {
  _id: string;
  userId: string;
  documentType: string;
  status: string;
  submittedAt: string;
  verifiedAt: string | null;
}

const mockUserKycDetails: UserKycDetailData[] = [
  {
    _id: '1234567890',
    userId: 'user123',
    documentType: 'Passport',
    status: 'verified',
    submittedAt: '2023-04-10T10:30:00Z',
    verifiedAt: '2023-04-12T15:45:00Z'
  },
  {
    _id: '2345678901',
    userId: 'user456',
    documentType: 'National ID',
    status: 'pending',
    submittedAt: '2023-04-15T14:20:00Z',
    verifiedAt: null
  },
  {
    _id: '3456789012',
    userId: 'user789',
    documentType: 'Driver License',
    status: 'rejected',
    submittedAt: '2023-04-18T09:15:00Z',
    verifiedAt: '2023-04-19T11:30:00Z'
  }
];

// Mock fetch function
const fetchUserKycDetailsData = async (): Promise<UserKycDetailData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUserKycDetails), 500);
  });
};

const UserKycDetails = () => {
  const { data: userKycDetails, isLoading } = useQuery({
    queryKey: ['userKycDetails'],
    queryFn: fetchUserKycDetailsData
  });

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: UserKycDetailData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User ID',
      sortable: true,
      cell: (row: UserKycDetailData) => row.userId.substring(0, 8) + '...',
    },
    {
      key: 'documentType',
      header: 'Document Type',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row: UserKycDetailData) => (
        <Badge variant={
          row.status === 'verified' ? 'default' : 
          row.status === 'pending' ? 'secondary' : 'destructive'
        }>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Submitted At',
      sortable: true,
      cell: (row: UserKycDetailData) => format(new Date(row.submittedAt), 'MMM dd, yyyy'),
    },
    {
      key: 'verifiedAt',
      header: 'Verified At',
      sortable: true,
      cell: (row: UserKycDetailData) => row.verifiedAt ? format(new Date(row.verifiedAt), 'MMM dd, yyyy') : '-',
    },
  ];

  return (
    <AdminLayout>
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
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default UserKycDetails;
