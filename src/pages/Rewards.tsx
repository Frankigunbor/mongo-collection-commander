import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RewardData, fetchRewardData, updateReward } from '@/lib/api';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const Rewards = () => {
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<RewardData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedReward, setEditedReward] = useState<Partial<RewardData>>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRewardData();
        setRewards(data);
      } catch (error) {
        console.error("Failed to load reward data:", error);
        toast({
          title: "Error",
          description: "Failed to load reward data",
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
      cell: (reward: RewardData) => <span className="font-mono text-xs">{reward._id.substring(0, 10)}...</span>,
    },
    {
      key: 'rewardAmount',
      header: 'Amount',
      cell: (reward: RewardData) => formatCurrency(reward.rewardAmount, reward.rewardAmountCurrency),
      sortable: true,
    },
    {
      key: 'rewardAmountCurrency',
      header: 'Currency',
      cell: (reward: RewardData) => <span className="font-semibold">{reward.rewardAmountCurrency}</span>,
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (reward: RewardData) => <StatusBadge status={reward.status ? 'active' : 'inactive'} />,
      sortable: true,
    },
    {
      key: 'creatorId',
      header: 'Creator ID',
      cell: (reward: RewardData) => <span className="font-mono text-xs">{reward.creatorId.substring(0, 10)}...</span>,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      cell: (reward: RewardData) => formatDate(reward.createdAt),
      sortable: true,
    },
  ];

  const formatCurrency = (amount: number, currency = 'CAD') => {
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

  const handleView = (reward: RewardData) => {
    setSelectedReward(reward);
    setIsEditMode(false);
  };

  const handleEdit = (reward: RewardData) => {
    setSelectedReward(reward);
    setEditedReward({...reward});
    setIsEditMode(true);
  };

  const handleCloseDialog = () => {
    setSelectedReward(null);
    setIsEditMode(false);
    setEditedReward({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedReward({
      ...editedReward,
      [name]: name === 'rewardAmount' ? parseInt(value, 10) : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedReward({
      ...editedReward,
      [name]: value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setEditedReward({
      ...editedReward,
      status: checked
    });
  };

  const handleSave = async () => {
    if (!selectedReward || !editedReward) return;
    
    try {
      const updatedReward = await updateReward({
        ...selectedReward,
        ...editedReward
      } as RewardData);
      
      setRewards(rewards.map(reward => 
        reward._id === updatedReward._id ? updatedReward : reward
      ));
      
      toast({
        title: "Success",
        description: "Reward updated successfully",
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to update reward:", error);
      toast({
        title: "Error",
        description: "Failed to update reward",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reward Management</h2>
      </div>
      
      <DataTable 
        data={rewards} 
        columns={columns} 
        onView={handleView}
        onEdit={handleEdit}
      />
      
      <Dialog open={!!selectedReward} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Reward' : 'Reward Details'}
              {selectedReward && (
                <span className="font-mono text-xs ml-2">
                  #{selectedReward._id.substring(0, 8)}
                </span>
              )}
            </DialogTitle>
            {isEditMode && <DialogDescription>Update the reward details.</DialogDescription>}
          </DialogHeader>
          
          {selectedReward && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Reward Amount</h4>
                    {isEditMode ? (
                      <div className="mt-1">
                        <Input
                          id="rewardAmount"
                          name="rewardAmount"
                          type="number"
                          value={editedReward.rewardAmount || selectedReward.rewardAmount}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      <p className="mt-1 font-semibold">
                        {formatCurrency(selectedReward.rewardAmount, selectedReward.rewardAmountCurrency)}
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Currency</h4>
                    {isEditMode ? (
                      <Select 
                        value={editedReward.rewardAmountCurrency || selectedReward.rewardAmountCurrency}
                        onValueChange={(value) => handleSelectChange('rewardAmountCurrency', value)}
                      >
                        <SelectTrigger className="mt-1">
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
                      <p className="mt-1 font-semibold">{selectedReward.rewardAmountCurrency}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="status">Status</Label>
                  <div className="text-sm text-muted-foreground">
                    {editedReward.status !== undefined ? 
                      (editedReward.status ? 'Active' : 'Inactive') : 
                      (selectedReward.status ? 'Active' : 'Inactive')}
                  </div>
                </div>
                {isEditMode ? (
                  <Switch
                    id="status"
                    checked={editedReward.status !== undefined ? editedReward.status : selectedReward.status}
                    onCheckedChange={handleSwitchChange}
                  />
                ) : (
                  <StatusBadge status={selectedReward.status ? 'active' : 'inactive'} />
                )}
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium text-muted-foreground">Reward Criteria ID</h4>
                <p className="font-mono text-sm mt-1">{selectedReward.rewardCriteraId}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Creator ID</h4>
                  <p className="font-mono text-sm mt-1">{selectedReward.creatorId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
                  <p className="mt-1">{formatDate(selectedReward.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                <p className="mt-1">{formatDate(selectedReward.updatedAt)}</p>
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

export default Rewards;
