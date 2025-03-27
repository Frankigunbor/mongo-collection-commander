
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditDialog, FieldConfig } from '@/components/ui-custom/EditDialog';
import { Button } from '@/components/ui/button';
import { fetchTransactionEntryData, fetchUserData, updateTransactionEntry, createTransactionEntry, TransactionEntryData } from '@/lib/api';

const TransactionEntries = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedEntry, setSelectedEntry] = useState<TransactionEntryData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: transactionEntries, isLoading } = useQuery({
    queryKey: ['transactionEntries'],
    queryFn: fetchTransactionEntryData
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  const updateTransactionEntryMutation = useMutation({
    mutationFn: updateTransactionEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionEntries'] });
      toast({
        title: 'Success',
        description: 'Transaction entry updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update transaction entry: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const createTransactionEntryMutation = useMutation({
    mutationFn: createTransactionEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionEntries'] });
      toast({
        title: 'Success',
        description: 'Transaction entry created successfully',
      });
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create transaction entry: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const handleEditEntry = (entry: TransactionEntryData) => {
    setSelectedEntry(entry);
    setIsEditDialogOpen(true);
  };

  const handleCreateEntry = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveEntry = (updatedData: Record<string, any>) => {
    if (!selectedEntry) return;
    
    updateTransactionEntryMutation.mutate({
      ...selectedEntry,
      ...updatedData,
    } as TransactionEntryData);
  };

  const handleCreateNewEntry = (data: Record<string, any>) => {
    createTransactionEntryMutation.mutate(data as Partial<TransactionEntryData>);
  };

  const entryFields: FieldConfig[] = [
    { name: '_id', label: 'ID', type: 'text', readOnly: true },
    { 
      name: 'entryType', 
      label: 'Type', 
      type: 'select',
      options: [
        { value: 'CREDIT', label: 'Credit' },
        { value: 'DEBIT', label: 'Debit' }
      ] 
    },
    { name: 'amount', label: 'Amount', type: 'number' },
    { 
      name: 'currency', 
      label: 'Currency', 
      type: 'select',
      options: [
        { value: 'CAD', label: 'Canadian Dollar (CAD)' },
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
        { value: 'GBP', label: 'British Pound (GBP)' }
      ] 
    },
    { name: 'accountId', label: 'Account ID', type: 'text' },
    { name: 'transactionId', label: 'Transaction ID', type: 'text' },
    { name: 'createdAt', label: 'Created At', type: 'date', readOnly: true },
    { name: 'updatedAt', label: 'Updated At', type: 'date', readOnly: true }
  ];

  const createEntryFields: FieldConfig[] = [
    { 
      name: 'entryType', 
      label: 'Type', 
      type: 'select',
      options: [
        { value: 'CREDIT', label: 'Credit' },
        { value: 'DEBIT', label: 'Debit' }
      ] 
    },
    { name: 'amount', label: 'Amount', type: 'number' },
    { 
      name: 'currency', 
      label: 'Currency', 
      type: 'select',
      options: [
        { value: 'CAD', label: 'Canadian Dollar (CAD)' },
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
        { value: 'GBP', label: 'British Pound (GBP)' }
      ] 
    },
    { name: 'accountId', label: 'Account ID', type: 'text' },
    { name: 'transactionId', label: 'Transaction ID', type: 'text' }
  ];

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
      key: 'entryType',
      header: 'Type',
      sortable: true,
      cell: (row: TransactionEntryData) => (
        <Badge variant={row.entryType === 'CREDIT' ? 'default' : 'secondary'}>
          {row.entryType}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      cell: (row: TransactionEntryData) => `${row.currency} ${row.amount.toFixed(2)}`,
    },
    {
      key: 'accountId',
      header: 'Account ID',
      sortable: true,
      cell: (row: TransactionEntryData) => row.accountId.substring(0, 8) + '...',
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: TransactionEntryData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <RefreshCcw className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Transaction Entries</h1>
        </div>
        <Button 
          onClick={handleCreateEntry}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Entry
        </Button>
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
          onEdit={handleEditEntry}
        />
      )}

      {/* Edit Dialog */}
      {selectedEntry && (
        <EditDialog
          title="Edit Transaction Entry"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEntry}
          fields={entryFields}
          initialData={selectedEntry}
          isLoading={updateTransactionEntryMutation.isPending}
        />
      )}

      {/* Create Dialog */}
      <EditDialog
        title="Add New Transaction Entry"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleCreateNewEntry}
        fields={createEntryFields}
        initialData={{}}
        isLoading={createTransactionEntryMutation.isPending}
      />
    </div>
  );
};

export default TransactionEntries;
