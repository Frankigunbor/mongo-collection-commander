import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { KycData, fetchKycData, updateKyc } from '@/lib/api';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Kyc = () => {
  const [kycData, setKycData] = useState<KycData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKyc, setSelectedKyc] = useState<KycData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedKyc, setEditedKyc] = useState<Partial<KycData>>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchKycData();
        setKycData(data);
      } catch (error) {
        console.error("Failed to load KYC data:", error);
        toast({
          title: "Error",
          description: "Failed to load KYC data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (kyc: KycData) => {
        if (!kyc || !kyc._id) return <span className="text-muted-foreground">N/A</span>;
        return <span className="font-mono text-xs">{kyc._id.substring(0, 10)}...</span>;
      },
    },
    {
      key: 'creatorId',
      header: 'Creator ID',
      cell: (kyc: KycData) => {
        if (!kyc || !kyc.creatorId) return <span className="text-muted-foreground">N/A</span>;
        return <span className="font-mono text-xs">{kyc.creatorId.substring(0, 10)}...</span>;
      },
    },
    {
      key: 'currency',
      header: 'Currency',
      cell: (kyc: KycData) => {
        if (!kyc || !kyc.currency) return <span className="text-muted-foreground">N/A</span>;
        return <span className="font-semibold">{kyc.currency}</span>;
      },
      sortable: true,
    },
    {
      key: 'kycLevel',
      header: 'KYC Level',
      cell: (kyc: KycData) => {
        if (!kyc || !kyc.kycLevel) return <span className="text-muted-foreground">N/A</span>;
        return (
          <StatusBadge 
            status={
              kyc.kycLevel === 'LEVEL_ONE' ? 'active' : 
              kyc.kycLevel === 'LEVEL_TWO' ? 'pending' : 'success'
            } 
          />
        );
      },
      sortable: true,
    },
    {
      key: 'singleTransactionLimit',
      header: 'Single Tx Limit',
      cell: (kyc: KycData) => {
        if (!kyc || typeof kyc.singleTransactionLimit !== 'number') return <span className="text-muted-foreground">N/A</span>;
        return formatCurrency(kyc.singleTransactionLimit, kyc.currency);
      },
      sortable: true,
    },
    {
      key: 'dailyTransactionLimit',
      header: 'Daily Limit',
      cell: (kyc: KycData) => {
        if (!kyc || typeof kyc.dailyTransactionLimit !== 'number') return <span className="text-muted-foreground">N/A</span>;
        return formatCurrency(kyc.dailyTransactionLimit, kyc.currency);
      },
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      cell: (kyc: KycData) => {
        if (!kyc || !kyc.createdAt) return <span className="text-muted-foreground">N/A</span>;
        return formatDate(kyc.createdAt);
      },
      sortable: true,
    },
  ];

  const formatCurrency = (amount: number, currency = 'CAD') => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return 'N/A';
    }
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error, "for date string:", dateString);
      return 'Invalid Date';
    }
  };

  const handleView = (kyc: KycData) => {
    setSelectedKyc(kyc);
    setIsEditMode(false);
  };

  const handleEdit = (kyc: KycData) => {
    setSelectedKyc(kyc);
    setEditedKyc({...kyc});
    setIsEditMode(true);
  };

  const handleCloseDialog = () => {
    setSelectedKyc(null);
    setIsEditMode(false);
    setEditedKyc({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedKyc({
      ...editedKyc,
      [name]: name.includes('Limit') || name === 'accountMaximumBalance' 
        ? parseInt(value, 10) 
        : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedKyc({
      ...editedKyc,
      [name]: value
    });
  };

  const handleSave = async () => {
    if (!selectedKyc || !editedKyc) return;
    
    try {
      // In a real app, this would save to MongoDB
      const updatedKyc = await updateKyc({
        ...selectedKyc,
        ...editedKyc
      } as KycData);
      
      // Update local state with the updated KYC
      setKycData(kycData.map(kyc => 
        kyc._id === updatedKyc._id ? updatedKyc : kyc
      ));
      
      toast({
        title: "Success",
        description: "KYC data updated successfully",
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to update KYC:", error);
      toast({
        title: "Error",
        description: "Failed to update KYC data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">KYC Management</h2>
      </div>
      
      <DataTable 
        data={kycData} 
        columns={columns} 
        onView={handleView}
        onEdit={handleEdit}
      />
      
      {/* View/Edit Dialog */}
      <Dialog open={!!selectedKyc} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit KYC Settings' : 'KYC Details'}
              {selectedKyc && selectedKyc._id && (
                <span className="font-mono text-xs ml-2">
                  #{selectedKyc._id.substring(0, 8)}
                </span>
              )}
            </DialogTitle>
            {isEditMode && <DialogDescription>Update the KYC limits and settings.</DialogDescription>}
          </DialogHeader>
          
          {selectedKyc && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Currency</h4>
                    {isEditMode ? (
                      <Select 
                        value={editedKyc.currency || selectedKyc.currency}
                        onValueChange={(value) => handleSelectChange('currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1 font-semibold">{selectedKyc.currency}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">KYC Level</h4>
                    {isEditMode ? (
                      <Select 
                        value={editedKyc.kycLevel || selectedKyc.kycLevel}
                        onValueChange={(value) => handleSelectChange('kycLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LEVEL_ONE">Level One</SelectItem>
                          <SelectItem value="LEVEL_TWO">Level Two</SelectItem>
                          <SelectItem value="LEVEL_THREE">Level Three</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1">
                        <StatusBadge 
                          status={
                            selectedKyc.kycLevel === 'LEVEL_ONE' ? 'active' :
                            selectedKyc.kycLevel === 'LEVEL_TWO' ? 'pending' : 'success'
                          } 
                        />
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="singleTransactionLimit">Single Transaction Limit</Label>
                  {isEditMode ? (
                    <Input
                      id="singleTransactionLimit"
                      name="singleTransactionLimit"
                      type="number"
                      value={editedKyc.singleTransactionLimit !== undefined ? editedKyc.singleTransactionLimit : selectedKyc.singleTransactionLimit}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-semibold">
                      {formatCurrency(selectedKyc.singleTransactionLimit, selectedKyc.currency)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyTransactionLimit">Daily Transaction Limit</Label>
                  {isEditMode ? (
                    <Input
                      id="dailyTransactionLimit"
                      name="dailyTransactionLimit"
                      type="number"
                      value={editedKyc.dailyTransactionLimit !== undefined ? editedKyc.dailyTransactionLimit : selectedKyc.dailyTransactionLimit}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-semibold">
                      {formatCurrency(selectedKyc.dailyTransactionLimit, selectedKyc.currency)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyTransactionLimit">Weekly Transaction Limit</Label>
                  {isEditMode ? (
                    <Input
                      id="weeklyTransactionLimit"
                      name="weeklyTransactionLimit"
                      type="number"
                      value={editedKyc.weeklyTransactionLimit !== undefined ? editedKyc.weeklyTransactionLimit : selectedKyc.weeklyTransactionLimit}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-semibold">
                      {formatCurrency(selectedKyc.weeklyTransactionLimit, selectedKyc.currency)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyTransactionLimit">Monthly Transaction Limit</Label>
                  {isEditMode ? (
                    <Input
                      id="monthlyTransactionLimit"
                      name="monthlyTransactionLimit"
                      type="number"
                      value={editedKyc.monthlyTransactionLimit !== undefined ? editedKyc.monthlyTransactionLimit : selectedKyc.monthlyTransactionLimit}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-semibold">
                      {formatCurrency(selectedKyc.monthlyTransactionLimit, selectedKyc.currency)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountMaximumBalance">Account Maximum Balance</Label>
                  {isEditMode ? (
                    <Input
                      id="accountMaximumBalance"
                      name="accountMaximumBalance"
                      type="number"
                      value={editedKyc.accountMaximumBalance !== undefined ? editedKyc.accountMaximumBalance : selectedKyc.accountMaximumBalance}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-semibold">
                      {formatCurrency(selectedKyc.accountMaximumBalance, selectedKyc.currency)}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">KYC Requirements</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedKyc.kycRequirements && selectedKyc.kycRequirements.length > 0 ? (
                    selectedKyc.kycRequirements.map((req, index) => (
                      <div key={index} className="px-3 py-1 bg-muted rounded-full text-xs">
                        {req}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No requirements specified</span>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                {isEditMode ? (
                  <>
                    <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={handleCloseDialog}>Close</Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Kyc;
