
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';

// Mock data type and fetch function since they're not exported in api.ts
interface VendorResponseData {
  _id: string;
  vendorName: string;
  responseType: string;
  status: string;
  amount: number;
  createdAt: string;
}

const mockVendorResponses: VendorResponseData[] = [
  {
    _id: '1234567890',
    vendorName: 'Vendor A',
    responseType: 'Payment',
    status: 'successful',
    amount: 250.00,
    createdAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '2345678901',
    vendorName: 'Vendor B',
    responseType: 'Refund',
    status: 'pending',
    amount: 75.50,
    createdAt: '2023-05-16T14:45:00Z'
  },
  {
    _id: '3456789012',
    vendorName: 'Vendor C',
    responseType: 'Subscription',
    status: 'failed',
    amount: 120.00,
    createdAt: '2023-05-17T09:15:00Z'
  }
];

// Mock fetch function
const fetchVendorResponsesData = async (): Promise<VendorResponseData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockVendorResponses), 500);
  });
};

const VendorResponses = () => {
  const { data: vendorResponses, isLoading } = useQuery({
    queryKey: ['vendorResponses'],
    queryFn: fetchVendorResponsesData
  });

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: VendorResponseData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'vendorName',
      header: 'Vendor Name',
      sortable: true,
    },
    {
      key: 'responseType',
      header: 'Response Type',
      sortable: true,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      cell: (row: VendorResponseData) => `$${row.amount.toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row: VendorResponseData) => (
        <Badge variant={
          row.status === 'successful' ? 'default' : 
          row.status === 'pending' ? 'secondary' : 'destructive'
        }>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: VendorResponseData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Vendor Responses</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable 
            data={vendorResponses || []} 
            columns={columns} 
            onView={(response) => {
              console.log("View vendor response", response);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default VendorResponses;
