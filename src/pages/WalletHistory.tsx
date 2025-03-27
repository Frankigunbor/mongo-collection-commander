
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui-custom/DataTable';
import { 
  fetchWalletHistoryData, 
  WalletHistoryData, 
  fetchUserData,
  updateWalletHistory
} from '@/lib/api';
import { History, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditDialog, FieldConfig } from '@/components/ui-custom/EditDialog';
import { Button } from '@/components/ui/button';

const WalletHistory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedHistory, setSelectedHistory] = useState<WalletHistoryData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: walletHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['walletHistory'],
    queryFn: fetchWalletHistoryData
  });
  
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  // Convert the display amount (divided by 100) to the storage amount (multiplied by 100)
  const convertToStorageAmount = (amount: number): number => {
    return Math.round(amount * 100);
  };

  // Convert the storage amount to display amount by dividing by 100
  const convertToDisplayAmount = (amount: number): number => {
    return amount / 100;
  };

  const updateWalletHistoryMutation = useMutation({
    mutationFn: (history: WalletHistoryData) => {
      // Make a copy of the history to avoid modifying the original
      const historyToUpdate = { ...history };
      
      // Convert the balances back to storage format before saving
      if (typeof historyToUpdate.previousBalance === 'number') {
        historyToUpdate.previousBalance = convertToStorageAmount(historyToUpdate.previousBalance);
      }
      
      if (typeof historyToUpdate.currentBalance === 'number') {
        historyToUpdate.currentBalance = convertToStorageAmount(historyToUpdate.currentBalance);
      }
      
      return updateWalletHistory(historyToUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletHistory'] });
      toast({
        title: 'Success',
        description: 'Wallet history updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update wallet history: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Create a map of user IDs to user names for quick lookup
  const userMap = React.useMemo(() => {
    if (!users) return {};
    
    return users.reduce((acc, user) => {
      acc[user._id] = `${user.firstName} ${user.lastName}`;
      return acc;
    }, {} as Record<string, string>);
  }, [users]);

  const handleEditHistory = (history: WalletHistoryData) => {
    // Convert balances to display format for editing
    const historyForEdit = { 
      ...history,
      previousBalance: convertToDisplayAmount(history.previousBalance),
      currentBalance: convertToDisplayAmount(history.currentBalance)
    };
    setSelectedHistory(historyForEdit);
    setIsEditDialogOpen(true);
  };

  const handleSaveHistory = (updatedData: Record<string, any>) => {
    if (!selectedHistory) return;
    
    updateWalletHistoryMutation.mutate({
      ...selectedHistory,
      ...updatedData,
    } as WalletHistoryData);
  };

  const walletHistoryFields: FieldConfig[] = [
    { name: '_id', label: 'ID', type: 'text', readOnly: true },
    { 
      name: 'userId', 
      label: 'User', 
      type: 'select',
      options: users?.map(user => ({
        value: user._id,
        label: `${user.firstName} ${user.lastName}`
      })) || [],
      readOnly: true
    },
    { name: 'walletId', label: 'Wallet ID', type: 'text', readOnly: true },
    { name: 'transactionReference', label: 'Transaction Reference', type: 'text', readOnly: true },
    { name: 'previousBalance', label: 'Previous Balance', type: 'number' },
    { name: 'currentBalance', label: 'Current Balance', type: 'number' },
    { name: 'createdAt', label: 'Created At', type: 'date', readOnly: true },
    { name: 'updatedAt', label: 'Updated At', type: 'date', readOnly: true }
  ];

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: WalletHistoryData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: WalletHistoryData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'walletId',
      header: 'Wallet ID',
      cell: (row: WalletHistoryData) => row.walletId.substring(0, 8) + '...',
    },
    {
      key: 'transactionReference',
      header: 'Transaction Reference',
      cell: (row: WalletHistoryData) => row.transactionReference.substring(0, 8) + '...',
    },
    {
      key: 'balanceChange',
      header: 'Balance Change',
      sortable: true,
      cell: (row: WalletHistoryData) => {
        const change = convertToDisplayAmount(row.currentBalance - row.previousBalance);
        const isPositive = change >= 0;
        return (
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {isPositive ? '+' : ''}{change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        );
      },
    },
    {
      key: 'previousBalance',
      header: 'Previous Balance',
      sortable: true,
      cell: (row: WalletHistoryData) => convertToDisplayAmount(row.previousBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    {
      key: 'currentBalance',
      header: 'Current Balance',
      sortable: true,
      cell: (row: WalletHistoryData) => convertToDisplayAmount(row.currentBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: WalletHistoryData) => format(new Date(row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <History className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Wallet History</h1>
        </div>
      </div>

      {historyLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable 
          data={walletHistory || []} 
          columns={columns} 
          onView={(history) => {
            console.log("View history", history);
          }}
          onEdit={handleEditHistory}
        />
      )}

      {selectedHistory && (
        <EditDialog
          title="Edit Wallet History"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveHistory}
          fields={walletHistoryFields}
          initialData={selectedHistory}
          isLoading={updateWalletHistoryMutation.isPending}
        />
      )}
    </div>
  );
};

export default WalletHistory;
