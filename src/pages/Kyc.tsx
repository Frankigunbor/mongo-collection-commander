
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchKycData, KycData, updateKyc } from '@/lib/api';
import { EditDialog } from '@/components/ui-custom/EditDialog';
import { Shield, DollarSign, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Kyc = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState<KycData | null>(null);
  
  const { data: kycs, isLoading, refetch } = useQuery({
    queryKey: ['kycs'],
    queryFn: fetchKycData
  });
  
  const handleEditComplete = async (updatedKyc: KycData) => {
    try {
      await updateKyc(updatedKyc);
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Error updating KYC:", error);
    }
  };
  
  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
    };
    
    return symbols[currency] || currency;
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return `${getCurrencySymbol(currency)}${amount.toLocaleString()}`;
  };
  
  const getKycLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'LEVEL_ONE': 'bg-blue-100 text-blue-800',
      'LEVEL_TWO': 'bg-indigo-100 text-indigo-800',
      'LEVEL_THREE': 'bg-purple-100 text-purple-800',
      'LEVEL_FOUR': 'bg-fuchsia-100 text-fuchsia-800',
    };
    
    return colors[level] || 'bg-gray-100 text-gray-800';
  };
  
  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: KycData) => row._id ? row._id.substring(0, 8) + '...' : 'N/A',
    },
    {
      key: 'currency',
      header: 'Currency',
      cell: (row: KycData) => (
        <Badge variant="outline" className="font-mono">
          {row.currency || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'kycLevel',
      header: 'KYC Level',
      cell: (row: KycData) => (
        <Badge className={getKycLevelColor(row.kycLevel)}>
          {row.kycLevel?.replace('_', ' ') || 'Unknown'}
        </Badge>
      ),
    },
    {
      key: 'kycRequirements',
      header: 'Requirements',
      cell: (row: KycData) => (
        <div className="flex flex-wrap gap-1">
          {row.kycRequirements && row.kycRequirements.length > 0 ? (
            row.kycRequirements.map((req, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {req.replace('_', ' ')}
              </Badge>
            ))
          ) : (
            <span className="text-gray-500">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'limits',
      header: 'Transaction Limits',
      cell: (row: KycData) => (
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span>Single:</span>
            <span className="font-semibold">{formatCurrency(row.singleTransactionLimit, row.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Daily:</span>
            <span className="font-semibold">{formatCurrency(row.dailyTransactionLimit, row.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Max Balance:</span>
            <span className="font-semibold">{formatCurrency(row.accountMaximumBalance, row.currency)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: KycData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
  ];
  
  const handleEdit = (kyc: KycData) => {
    setSelectedKyc(kyc);
    setIsEditing(true);
  };
  
  const handleView = (kyc: KycData) => {
    console.log("View KYC details:", kyc);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">KYC Levels & Requirements</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-amber-100 p-2 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-amber-800">
              KYC changes affect user limits
            </span>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable 
          data={kycs || []} 
          columns={columns} 
          onEdit={handleEdit}
          onView={handleView}
        />
      )}
      
      {isEditing && selectedKyc && (
        <EditDialog
          title="Edit KYC Level"
          data={selectedKyc}
          fields={[
            { name: '_id', label: 'ID', type: 'text', readOnly: true },
            { name: 'currency', label: 'Currency', type: 'text' },
            { name: 'kycLevel', label: 'KYC Level', type: 'select', options: [
              { label: 'Level One', value: 'LEVEL_ONE' },
              { label: 'Level Two', value: 'LEVEL_TWO' },
              { label: 'Level Three', value: 'LEVEL_THREE' },
              { label: 'Level Four', value: 'LEVEL_FOUR' },
            ]},
            { name: 'singleTransactionLimit', label: 'Single Transaction Limit', type: 'number' },
            { name: 'dailyTransactionLimit', label: 'Daily Transaction Limit', type: 'number' },
            { name: 'weeklyTransactionLimit', label: 'Weekly Transaction Limit', type: 'number' },
            { name: 'monthlyTransactionLimit', label: 'Monthly Transaction Limit', type: 'number' },
            { name: 'accountMaximumBalance', label: 'Account Maximum Balance', type: 'number' },
          ]}
          onSave={handleEditComplete}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default Kyc;
