
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { KycData, fetchKycData, updateKyc } from '@/lib/api';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form schema for KYC
const formSchema = z.object({
  kycLevel: z.string(),
  currency: z.string(),
  singleTransactionLimit: z.coerce.number().min(0),
  dailyTransactionLimit: z.coerce.number().min(0),
  weeklyTransactionLimit: z.coerce.number().min(0),
  monthlyTransactionLimit: z.coerce.number().min(0),
  accountMaximumBalance: z.coerce.number().min(0),
});

const Kyc = () => {
  const [kycData, setKycData] = useState<KycData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState<KycData | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kycLevel: '',
      currency: '',
      singleTransactionLimit: 0,
      dailyTransactionLimit: 0,
      weeklyTransactionLimit: 0,
      monthlyTransactionLimit: 0,
      accountMaximumBalance: 0,
    },
  });

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

  // Set form values when selected KYC changes
  useEffect(() => {
    if (selectedKyc) {
      form.reset({
        kycLevel: selectedKyc.kycLevel,
        currency: selectedKyc.currency,
        singleTransactionLimit: selectedKyc.singleTransactionLimit,
        dailyTransactionLimit: selectedKyc.dailyTransactionLimit,
        weeklyTransactionLimit: selectedKyc.weeklyTransactionLimit,
        monthlyTransactionLimit: selectedKyc.monthlyTransactionLimit,
        accountMaximumBalance: selectedKyc.accountMaximumBalance,
      });
    }
  }, [selectedKyc, form]);

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (kyc: KycData) => <span className="font-mono text-xs">{kyc._id.substring(0, 10)}...</span>,
    },
    {
      key: 'kycLevel',
      header: 'KYC Level',
      cell: (kyc: KycData) => (
        <div className="flex items-center gap-2">
          <StatusBadge 
            status={
              kyc.kycLevel === 'LEVEL_ONE' ? 'active' : 
              kyc.kycLevel === 'LEVEL_TWO' ? 'processing' : 'success'
            } 
          />
          <span>
            {kyc.kycLevel.replace('_', ' ').toLowerCase()
              .replace(/\b\w/g, c => c.toUpperCase())}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'currency',
      header: 'Currency',
      sortable: true,
    },
    {
      key: 'singleTransactionLimit',
      header: 'Single Tx Limit',
      cell: (kyc: KycData) => formatCurrency(kyc.singleTransactionLimit, kyc.currency),
      sortable: true,
    },
    {
      key: 'dailyTransactionLimit',
      header: 'Daily Limit',
      cell: (kyc: KycData) => formatCurrency(kyc.dailyTransactionLimit, kyc.currency),
    },
    {
      key: 'weeklyTransactionLimit',
      header: 'Weekly Limit',
      cell: (kyc: KycData) => formatCurrency(kyc.weeklyTransactionLimit, kyc.currency),
    },
    {
      key: 'monthlyTransactionLimit',
      header: 'Monthly Limit',
      cell: (kyc: KycData) => formatCurrency(kyc.monthlyTransactionLimit, kyc.currency),
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      cell: (kyc: KycData) => new Date(kyc.updatedAt).toLocaleDateString(),
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

  const handleView = (kyc: KycData) => {
    setSelectedKyc(kyc);
    setIsEditing(false);
  };

  const handleEdit = (kyc: KycData) => {
    setSelectedKyc(kyc);
    setIsEditing(true);
  };

  const handleCloseDialog = () => {
    setSelectedKyc(null);
    setIsEditing(false);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!selectedKyc) return;

    try {
      const updatedKyc: KycData = {
        ...selectedKyc,
        ...data,
      };

      const result = await updateKyc(updatedKyc);
      
      // Update the KYC data array with the updated KYC
      setKycData(prevData => 
        prevData.map(kyc => kyc._id === result._id ? result : kyc)
      );

      handleCloseDialog();
      
      toast({
        title: "KYC Updated",
        description: `KYC #${result._id.substring(0, 8)} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Failed to update KYC:", error);
      toast({
        title: "Error",
        description: "Failed to update KYC",
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
      
      <Dialog open={!!selectedKyc} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit KYC' : 'View KYC'} 
              <span className="font-mono text-xs ml-2">
                #{selectedKyc?._id.substring(0, 8)}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedKyc && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="kycLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KYC Level</FormLabel>
                        <Select
                          disabled={!isEditing}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select KYC Level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LEVEL_ONE">Level One</SelectItem>
                            <SelectItem value="LEVEL_TWO">Level Two</SelectItem>
                            <SelectItem value="LEVEL_THREE">Level Three</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currency"
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="singleTransactionLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Single Transaction Limit</FormLabel>
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
                    name="dailyTransactionLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Transaction Limit</FormLabel>
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
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="weeklyTransactionLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Limit</FormLabel>
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
                    name="monthlyTransactionLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Limit</FormLabel>
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
                    name="accountMaximumBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Account Balance</FormLabel>
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
                </div>
                
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-medium">KYC Requirements</h4>
                  <div className="text-sm">
                    {selectedKyc.kycRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 py-1">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>{req}</span>
                      </div>
                    ))}
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

export default Kyc;
