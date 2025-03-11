
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { fetchTransactionEntriesData, TransactionEntryData } from '@/lib/api';
import { RefreshCcw } from 'lucide-react';

const TransactionEntries = () => {
  const { data: entries, isLoading } = useQuery({
    queryKey: ['transactionEntries'],
    queryFn: fetchTransactionEntriesData
  });

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: TransactionEntryData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
      cell: (row: TransactionEntryData) => row.transactionId.substring(0, 8) + '...',
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      cell: (row: TransactionEntryData) => `${row.currency} ${row.amount.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row: TransactionEntryData) => (
        <Badge variant={
          row.status === 'completed' ? 'default' : 
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
      cell: (row: TransactionEntryData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Transaction Entries</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable 
            data={entries || []} 
            columns={columns} 
            onView={(entry) => {
              console.log("View transaction entry", entry);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default TransactionEntries;
