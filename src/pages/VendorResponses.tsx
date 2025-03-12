
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { fetchVendorResponsesData, VendorResponseData } from '@/lib/api';
import { ShoppingBag } from 'lucide-react';

const VendorResponses = () => {
  const { data: responses, isLoading } = useQuery({
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
      key: 'transactionId',
      header: 'Transaction ID',
      cell: (row: VendorResponseData) => row.transactionId.substring(0, 8) + '...',
    },
    {
      key: 'vendor',
      header: 'Vendor',
      sortable: true,
    },
    {
      key: 'responseCode',
      header: 'Response Code',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row: VendorResponseData) => (
        <Badge variant={
          row.status === 'success' ? 'default' : 
          row.status === 'failed' ? 'destructive' : 
          'outline'
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
            data={responses || []} 
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
