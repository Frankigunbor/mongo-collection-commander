
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RewardData, fetchRewardData, updateReward } from '@/lib/api';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form schema for Rewards
const formSchema = z.object({
  rewardAmount: z.coerce.number().min(0),
  rewardAmountCurrency: z.string(),
  status: z.boolean(),
});

const Rewards = () => {
  const [rewardsData, setRewardsData] = useState<RewardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardData | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rewardAmount: 0,
      rewardAmountCurrency: '',
      status: false,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRewardData();
        setRewardsData(data);
      } catch (error) {
        console.error("Failed to load rewards data:", error);
        toast({
          title: "Error",
          description: "Failed to load rewards data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Set form values when selected reward changes
  useEffect(() => {
    if (selectedReward) {
      form.reset({
        rewardAmount: selectedReward.rewardAmount,
        rewardAmountCurrency: selectedReward.rewardAmountCurrency,
        status: selectedReward.status,
      });
    }
  }, [selectedReward, form]);

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
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (reward: RewardData) => (
        <StatusBadge status={reward.status ? 'active' : 'inactive'} />
      ),
      sortable: true,
    },
    {
      key: 'creatorId',
      header: 'Creator ID',
      cell: (reward: RewardData) => <span className="font-mono text-xs">{reward.creatorId.substring(0, 10)}...</span>,
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      cell: (reward: RewardData) => new Date(reward.updatedAt).toLocaleDateString(),
      sortable: true,
    },
  ];

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleView = (reward: RewardData) => {
    setSelectedReward(reward);
    setIsEditing(false);
  };

  const handleEdit = (reward: RewardData) => {
    setSelectedReward(reward);
    setIsEditing(true);
  };

  const handleCloseDialog = () => {
    setSelectedReward(null);
    setIsEditing(false);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!selectedReward) return;

    try {
      const updatedReward: RewardData = {
        ...selectedReward,
        ...data,
      };

      const result = await updateReward(updatedReward);
      
      // Update the rewards data array with the updated reward
      setRewardsData(prevData => 
        prevData.map(reward => reward._id === result._id ? result : reward)
      );

      handleCloseDialog();
      
      toast({
        title: "Reward Updated",
        description: `Reward #${result._id.substring(0, 8)} has been updated successfully.`,
      });
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
        <h2 className="text-3xl font-bold tracking-tight">Rewards Management</h2>
      </div>
      
      <DataTable 
        data={rewardsData} 
        columns={columns} 
        onView={handleView}
        onEdit={handleEdit}
      />
      
      <Dialog open={!!selectedReward} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Reward' : 'View Reward'} 
              <span className="font-mono text-xs ml-2">
                #{selectedReward?._id.substring(0, 8)}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedReward && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rewardAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reward Amount</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            disabled={!isEditing} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rewardAmountCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          disabled={!isEditing}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Reward Status</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          {field.value ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={!isEditing}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-medium">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Reward Criteria ID</div>
                      <div className="font-mono text-xs mt-1">{selectedReward.rewardCriteraId}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Creator ID</div>
                      <div className="font-mono text-xs mt-1">{selectedReward.creatorId}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Created At</div>
                      <div className="text-sm mt-1">{new Date(selectedReward.createdAt).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Updated At</div>
                      <div className="text-sm mt-1">{new Date(selectedReward.updatedAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  {isEditing && (
                    <Button type="submit">Save Changes</Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;
