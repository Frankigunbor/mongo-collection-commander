
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchUserReferralData, UserReferralData, fetchUserData } from '@/lib/api';
import { UserPlus, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const UserReferrals = () => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  
  const { data: referrals, isLoading } = useQuery({
    queryKey: ['userReferrals'],
    queryFn: fetchUserReferralData
  });
  
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  // Create a map of user IDs to user names for quick lookup
  const userMap = React.useMemo(() => {
    if (!users) return {};
    
    return users.reduce((acc, user) => {
      acc[user._id] = `${user.firstName} ${user.lastName}`;
      return acc;
    }, {} as Record<string, string>);
  }, [users]);

  const handleCopyReferralCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedId(id);
        toast({
          title: "Copied to clipboard",
          description: `Referral code ${code} has been copied to clipboard.`,
        });
        
        setTimeout(() => {
          setCopiedId(null);
        }, 2000);
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy referral code to clipboard.",
          variant: "destructive",
        });
      });
  };

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: UserReferralData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: UserReferralData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'referralCode',
      header: 'Referral Code',
      sortable: true,
      cell: (row: UserReferralData) => (
        <div className="flex items-center gap-2">
          <code className="bg-gray-100 px-2 py-1 rounded">{row.referralCode}</code>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopyReferralCode(row.referralCode, row._id)}
          >
            {copiedId === row._id ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: UserReferralData) => format(new Date(row.createdAt), 'MMM dd, yyyy'),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <UserPlus className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">User Referrals</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable 
            data={referrals || []} 
            columns={columns} 
            onView={(referral) => {
              console.log("View referral", referral);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default UserReferrals;
