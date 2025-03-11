
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchTransactionEntryData, TransactionEntryData } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, RefreshCcw } from 'lucide-react';

const TransactionEntries = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: transactionEntries, isLoading } = useQuery({
    queryKey: ['transactionEntries'],
    queryFn: fetchTransactionEntryData
  });

  const filteredEntries = React.useMemo(() => {
    if (!transactionEntries) return [];
    
    if (activeTab === 'all') return transactionEntries;
    
    return transactionEntries.filter(entry => 
      entry.entryType.toLowerCase() === activeTab.toLowerCase()
    );
  }, [transactionEntries, activeTab]);

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: TransactionEntryData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'entryType',
      header: 'Type',
      sortable: true,
      cell: (row: TransactionEntryData) => (
        <Badge variant={row.entryType === 'CREDIT' ? 'success' : 'destructive'}>
          {row.entryType}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      cell: (row: TransactionEntryData) => `${row.currency} ${row.amount.toLocaleString()}`,
    },
    {
      key: 'accountId',
      header: 'Account ID',
      cell: (row: TransactionEntryData) => row.accountId.substring(0, 8) + '...',
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
      cell: (row: TransactionEntryData) => row.transactionId.substring(0, 8) + '...',
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: TransactionEntryData) => format(new Date(row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Transaction Entries</h1>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              All Entries
            </TabsTrigger>
            <TabsTrigger value="credit" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Credits
            </TabsTrigger>
            <TabsTrigger value="debit" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Debits
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable 
            data={filteredEntries} 
            columns={columns} 
            onView={(entry) => {
              console.log("View entry", entry);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default TransactionEntries;
