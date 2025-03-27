
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui-custom/DataTable';
import { 
  fetchWalletData, 
  WalletData, 
  fetchUserData, 
  UserData, 
  updateWallet 
} from '@/lib/api';
import { Wallet, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditDialog, FieldConfig } from '@/components/ui-custom/EditDialog';
import { Button } from '@/components/ui/button';

const Wallets = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: fetchWalletData
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

  const updateWalletMutation = useMutation({
    mutationFn: (wallet: WalletData) => {
      // Make a copy of the wallet to avoid modifying the original
      const walletToUpdate = { ...wallet };
      
      // Convert the balance back to storage format before saving
      if (typeof walletToUpdate.balance === 'number') {
        walletToUpdate.balance = convertToStorageAmount(walletToUpdate.balance);
      }
      
      return updateWallet(walletToUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast({
        title: 'Success',
        description: 'Wallet updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update wallet: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

  const handleEditWallet = (wallet: WalletData) => {
    // Convert the wallet balance to display format for editing
    const walletForEdit = { 
      ...wallet,
      balance: convertToDisplayAmount(wallet.balance)
    };
    setSelectedWallet(walletForEdit);
    setIsEditDialogOpen(true);
  };

  const handleSaveWallet = (updatedData: Record<string, any>) => {
    if (!selectedWallet) return;
    
    updateWalletMutation.mutate({
      ...selectedWallet,
      ...updatedData,
    } as WalletData);
  };

  const walletFields: FieldConfig[] = [
    { name: '_id', label: 'ID', type: 'text', readOnly: true },
    { name: 'accountId', label: 'Account ID', type: 'text', readOnly: true },
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
    { name: 'balance', label: 'Balance', type: 'number' },
    { name: 'createdAt', label: 'Created At', type: 'date', readOnly: true },
    { name: 'updatedAt', label: 'Updated At', type: 'date', readOnly: true }
  ];

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: WalletData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'accountId',
      header: 'Account ID',
      cell: (row: WalletData) => row.accountId.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: WalletData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'currency',
      header: 'Currency',
      sortable: true,
    },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      cell: (row: WalletData) => `${row.currency} ${convertToDisplayAmount(row.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: WalletData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      sortable: true,
      cell: (row: WalletData) => format(new Date(row.updatedAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Wallet className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Wallets</h1>
        </div>
      </div>

      {walletsLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable 
          data={wallets || []} 
          columns={columns} 
          onView={(wallet) => {
            console.log("View wallet", wallet);
          }}
          onEdit={handleEditWallet}
        />
      )}

      {selectedWallet && (
        <EditDialog
          title="Edit Wallet"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveWallet}
          fields={walletFields}
          initialData={selectedWallet}
          isLoading={updateWalletMutation.isPending}
        />
      )}
    </div>
  );
};

export default Wallets;
