
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchVendorTransactionResponseTrailData, VendorTransactionResponseTrailData } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';

const VendorResponses = () => {
  const { data: vendorResponses, isLoading } = useQuery({
    queryKey: ['vendorResponses'],
    queryFn: fetchVendorTransactionResponseTrailData
  });

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: VendorTransactionResponseTrailData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'vendor',
      header: 'Vendor',
      sortable: true,
      cell: (row: VendorTransactionResponseTrailData) => {
        const vendorName = row.vendor.replace('PAYMENT_VENDOR_', '');
        return <Badge variant="outline">{vendorName}</Badge>;
      }
    },
    {
      key: 'vendorReference',
      header: 'Vendor Reference',
      cell: (row: VendorTransactionResponseTrailData) => 
        row.vendorReference.length > 20 
          ? row.vendorReference.substring(0, 17) + '...' 
          : row.vendorReference,
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
      cell: (row: VendorTransactionResponseTrailData) => row.transactionId.substring(0, 8) + '...',
    },
    {
      key: 'transactionStatus',
      header: 'Status',
      sortable: true,
      cell: (row: VendorTransactionResponseTrailData) => (
        <Badge variant={
          row.transactionStatus === 'SUCCESS' ? 'success' : 
          row.transactionStatus === 'PENDING' ? 'warning' : 
          'destructive'
        }>
          {row.transactionStatus}
        </Badge>
      ),
    },
    {
      key: 'processingMessage',
      header: 'Processing Message',
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: VendorTransactionResponseTrailData) => format(new Date(row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Vendor Transaction Responses</h1>
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
              console.log("View response", response);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default VendorResponses;
