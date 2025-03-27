import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TransactionData, fetchTransactionData } from '@/lib/api';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpFromLine, ArrowDownToLine, ArrowRightLeft, DollarSign } from 'lucide-react';
import { createTransaction, updateTransaction } from '@/lib/mongodb/services';

const Transactions = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTransactionData();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transaction data:", error);
        toast({
          title: "Error",
          description: "Failed to load transaction data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const convertDisplayAmount = (amount: number): number => {
    return amount / 100;
  };

  const convertDatabaseAmount = (amount: number): number => {
    return amount * 100;
  };

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (transaction: TransactionData) => {
        if (!transaction || !transaction._id) return <span>-</span>;
        return <span className="font-mono text-xs">{transaction._id.substring(0, 10)}...</span>;
      },
    },
    {
      key: 'reference',
      header: 'Reference',
      cell: (transaction: TransactionData) => {
        if (!transaction || !transaction.reference) return <span>-</span>;
        return <span className="font-mono text-xs">{transaction.reference.substring(0, 15)}...</span>;
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (transaction: TransactionData) => {
        if (!transaction) return <span>-</span>;
        
        const displayAmount = convertDisplayAmount(transaction.amount);
        
        return (
          <span className="font-semibold">
            {formatCurrency(displayAmount, transaction.currency)}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: 'transactionType',
      header: 'Type',
      cell: (transaction: TransactionData) => {
        if (!transaction) return <span>-</span>;
        
        return (
          <div className="flex items-center">
            {transaction.transactionType === 'DEPOSIT' ? (
              <ArrowDownToLine className="h-4 w-4 text-green-500 mr-2" />
            ) : transaction.transactionType === 'WITHDRAW' ? (
              <ArrowUpFromLine className="h-4 w-4 text-yellow-500 mr-2" />
            ) : (
              <ArrowRightLeft className="h-4 w-4 text-blue-500 mr-2" />
            )}
            {transaction.transactionType}
          </div>
        );
      },
      sortable: true,
    },
    {
      key: 'transactionStatus',
      header: 'Status',
      cell: (transaction: TransactionData) => {
        if (!transaction) return <span>-</span>;
        
        return (
          <StatusBadge 
            status={
              transaction.transactionStatus === 'SUCCESS' ? 'success' : 
              transaction.transactionStatus === 'PENDING' ? 'pending' : 'failed'
            } 
          />
        );
      },
      sortable: true,
    },
    {
      key: 'transactionSource',
      header: 'Source',
      cell: (transaction: TransactionData) => transaction?.transactionSource || '-',
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Date',
      cell: (transaction: TransactionData) => 
        transaction?.createdAt ? formatDate(transaction.createdAt) : '-',
      sortable: true,
    },
  ];

  const formatCurrency = (amount: number, currency = 'CAD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleView = (transaction: TransactionData) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDialog = () => {
    setSelectedTransaction(null);
  };

  const stats = {
    total: transactions.length,
    deposits: transactions.filter(t => t.transactionType === 'DEPOSIT').length,
    withdrawals: transactions.filter(t => t.transactionType === 'WITHDRAW').length,
    transfers: transactions.filter(t => t.transactionType === 'TRANSFER').length,
    successful: transactions.filter(t => t.transactionStatus === 'SUCCESS').length,
    pending: transactions.filter(t => t.transactionStatus === 'PENDING').length,
    failed: transactions.filter(t => t.transactionStatus === 'FAILED').length,
    totalAmount: transactions.reduce((sum, t) => sum + convertDisplayAmount(t.amount), 0),
  };

  const filteredTransactions = filter === 'ALL' 
    ? transactions 
    : transactions.filter(t => t.transactionType === filter);

  const handleCreateTransaction = async (transactionData: Partial<TransactionData>) => {
    if (transactionData.amount) {
      transactionData.amount = convertDatabaseAmount(transactionData.amount);
    }
    
    try {
      const result = await createTransaction(transactionData);
      
      setTransactions(prev => [result, ...prev]);
      
      toast({
        title: "Success",
        description: "Transaction created successfully",
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTransaction = async (transactionData: TransactionData) => {
    const updatedTransaction = { ...transactionData };
    
    updatedTransaction.amount = convertDatabaseAmount(updatedTransaction.amount);
    
    try {
      await updateTransaction(updatedTransaction);
      
      setTransactions(prev => 
        prev.map(t => t._id === updatedTransaction._id ? updatedTransaction : t)
      );
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CardDescription>All types</CardDescription>
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.totalAmount)} total volume
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Deposits</CardTitle>
              <CardDescription>Incoming funds</CardDescription>
            </div>
            <ArrowDownToLine className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deposits}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Withdrawals</CardTitle>
              <CardDescription>Outgoing funds</CardDescription>
            </div>
            <ArrowUpFromLine className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withdrawals}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Transfers</CardTitle>
              <CardDescription>Between accounts</CardDescription>
            </div>
            <ArrowRightLeft className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.transfers}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="ALL" onValueChange={setFilter}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="DEPOSIT">Deposits</TabsTrigger>
            <TabsTrigger value="WITHDRAW">Withdrawals</TabsTrigger>
            <TabsTrigger value="TRANSFER">Transfers</TabsTrigger>
          </TabsList>
          
          <div>
            <span className="text-sm mr-2">
              <StatusBadge status="success" /> {stats.successful}
            </span>
            <span className="text-sm mr-2">
              <StatusBadge status="pending" /> {stats.pending}
            </span>
            <span className="text-sm">
              <StatusBadge status="failed" /> {stats.failed}
            </span>
          </div>
        </div>
      
        <TabsContent value="ALL" className="mt-4">
          <DataTable 
            data={transactions} 
            columns={columns} 
            onView={handleView}
          />
        </TabsContent>
        
        <TabsContent value="DEPOSIT" className="mt-4">
          <DataTable 
            data={transactions.filter(t => t.transactionType === 'DEPOSIT')} 
            columns={columns} 
            onView={handleView}
          />
        </TabsContent>
        
        <TabsContent value="WITHDRAW" className="mt-4">
          <DataTable 
            data={transactions.filter(t => t.transactionType === 'WITHDRAW')} 
            columns={columns} 
            onView={handleView}
          />
        </TabsContent>
        
        <TabsContent value="TRANSFER" className="mt-4">
          <DataTable 
            data={transactions.filter(t => t.transactionType === 'TRANSFER')} 
            columns={columns} 
            onView={handleView}
          />
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Transaction Details
              <span className="font-mono text-xs ml-2">
                #{selectedTransaction?._id.substring(0, 8)}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Amount</h4>
                    <p className="text-2xl font-bold mt-1">
                      {formatCurrency(
                        convertDisplayAmount(selectedTransaction.amount), 
                        selectedTransaction.currency
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <p className="mt-1">
                      <StatusBadge 
                        status={
                          selectedTransaction.transactionStatus === 'SUCCESS' ? 'success' : 
                          selectedTransaction.transactionStatus === 'PENDING' ? 'pending' : 'failed'
                        } 
                      />
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Transaction Type</h4>
                  <div className="flex items-center mt-1">
                    {selectedTransaction.transactionType === 'DEPOSIT' ? (
                      <ArrowDownToLine className="h-4 w-4 text-green-500 mr-2" />
                    ) : selectedTransaction.transactionType === 'WITHDRAW' ? (
                      <ArrowUpFromLine className="h-4 w-4 text-yellow-500 mr-2" />
                    ) : (
                      <ArrowRightLeft className="h-4 w-4 text-blue-500 mr-2" />
                    )}
                    <span>{selectedTransaction.transactionType}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date & Time</h4>
                  <p className="mt-1">{formatDate(selectedTransaction.createdAt)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Reference</h4>
                  <p className="font-mono text-sm mt-1 break-all">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Action ID</h4>
                  <p className="font-mono text-sm mt-1">{selectedTransaction.actionId}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Narration</h4>
                <p className="p-2 bg-muted/20 rounded-lg mt-1 min-h-[40px]">
                  {selectedTransaction.narration || <span className="text-muted-foreground italic">No narration provided</span>}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Sender Account</h4>
                  <p className="font-mono text-sm mt-1">{selectedTransaction.senderAccountId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Recipient Account</h4>
                  <p className="font-mono text-sm mt-1">{selectedTransaction.recipientAccountId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">User ID</h4>
                  <p className="font-mono text-sm mt-1">{selectedTransaction.userId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Source</h4>
                  <p className="mt-1">{selectedTransaction.transactionSource}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Payment Vendor</h4>
                  <p className="mt-1">{selectedTransaction.vendor}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Vendor Reference</h4>
                  <p className="font-mono text-sm mt-1 truncate">{selectedTransaction.vendorReference}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Processing Message</h4>
                  <p className="mt-1">{selectedTransaction.processingMessage}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Conversion Rate</h4>
                  <p className="mt-1">{selectedTransaction.conversionRate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Completed At</h4>
                  <p className="mt-1">
                    {selectedTransaction.completedAt 
                      ? formatDate(selectedTransaction.completedAt) 
                      : <span className="text-muted-foreground italic">Not completed yet</span>}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Requery Count</h4>
                  <p className="mt-1">{selectedTransaction.requeryCount}</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
