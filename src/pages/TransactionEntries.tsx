
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw } from 'lucide-react';

// Mock data type and fetch function since they're not exported in api.ts
interface TransactionEntryData {
  _id: string;
  transactionId: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

const mockTransactionEntries: TransactionEntryData[] = [
  {
    _id: '1234567890',
    transactionId: 'tx123',
    type: 'Credit',
    amount: 250.00,
    status: 'completed',
    createdAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '2345678901',
    transactionId: 'tx456',
    type: 'Debit',
    amount: 75.50,
    status: 'pending',
    createdAt: '2023-05-16T14:45:00Z'
  },
  {
    _id: '3456789012',
    transactionId: 'tx789',
    type: 'Credit',
    amount: 120.00,
    status: 'failed',
    createdAt: '2023-05-17T09:15:00Z'
  }
];

// Mock fetch function
const fetchTransactionEntriesData = async (): Promise<TransactionEntryData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTransactionEntries), 500);
  });
};

const TransactionEntries = () => {
  const { data: transactionEntries, isLoading } = useQuery({
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
      sortable: true,
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
      cell: (row: TransactionEntryData) => `$${row.amount.toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row: TransactionEntryData) => (
        <Badge variant={
          row.status === 'completed' ? 'default' : 
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
            data={transactionEntries || []} 
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
