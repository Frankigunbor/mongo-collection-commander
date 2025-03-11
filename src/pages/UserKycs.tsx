
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchUserKycData, UserKycData, fetchUserData, fetchKycData } from '@/lib/api';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UserKycs = () => {
  const { data: userKycs, isLoading } = useQuery({
    queryKey: ['userKycs'],
    queryFn: fetchUserKycData
  });
  
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  const { data: kycLevels } = useQuery({
    queryKey: ['kyc'],
    queryFn: fetchKycData
  });

  // Create maps for quick lookups
  const userMap = React.useMemo(() => {
    if (!users) return {};
    
    return users.reduce((acc, user) => {
      acc[user._id] = `${user.firstName} ${user.lastName}`;
      return acc;
    }, {} as Record<string, string>);
  }, [users]);

  const kycLevelMap = React.useMemo(() => {
    if (!kycLevels) return {};
    
    return kycLevels.reduce((acc, kyc) => {
      acc[kyc._id] = kyc.kycLevel;
      return acc;
    }, {} as Record<string, string>);
  }, [kycLevels]);

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: UserKycData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: UserKycData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'currency',
      header: 'Currency',
      sortable: true,
    },
    {
      key: 'kycId',
      header: 'KYC Level',
      sortable: true,
      cell: (row: UserKycData) => {
        const level = kycLevelMap[row.kycId] || 'Unknown';
        return (
          <Badge variant="outline" className="font-semibold">
            {level}
          </Badge>
        );
      }
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: UserKycData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      sortable: true,
      cell: (row: UserKycData) => format(new Date(row.updatedAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">User KYC Levels</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable 
            data={userKycs || []} 
            columns={columns} 
            onView={(userKyc) => {
              console.log("View user KYC", userKyc);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default UserKycs;
