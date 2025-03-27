
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui-custom/DataTable';
import { 
  fetchRecentUserActivityData, 
  RecentUserActivityData, 
  fetchUserData,
  UserData,
  updateRecentUserActivity
} from '@/lib/api';
import { ClipboardList, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditDialog, FieldConfig } from '@/components/ui-custom/EditDialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';

const RecentUserActivities = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedActivity, setSelectedActivity] = useState<RecentUserActivityData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['recentUserActivities'],
    queryFn: fetchRecentUserActivityData
  });
  
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  const updateActivityMutation = useMutation({
    mutationFn: updateRecentUserActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentUserActivities'] });
      toast({
        title: 'Success',
        description: 'Activity updated successfully',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update activity: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

  const handleEditActivity = (activity: RecentUserActivityData) => {
    setSelectedActivity(activity);
    setIsEditDialogOpen(true);
  };

  const handleSaveActivity = (updatedData: Record<string, any>) => {
    if (!selectedActivity) return;
    
    updateActivityMutation.mutate({
      ...selectedActivity,
      ...updatedData,
    } as RecentUserActivityData);
  };

  const activityFields: FieldConfig[] = [
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
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'transactionId', label: 'Transaction ID', type: 'text', readOnly: true },
    { 
      name: 'recentUserActivityType', 
      label: 'Activity Type', 
      type: 'select',
      options: [
        { value: 'TRANSACTION', label: 'Transaction' },
        { value: 'LOGIN', label: 'Login' },
        { value: 'KYC', label: 'KYC' },
        { value: 'PROFILE_UPDATE', label: 'Profile Update' },
        { value: 'WALLET', label: 'Wallet' }
      ]
    },
    { name: 'createdAt', label: 'Created At', type: 'date', readOnly: true },
    { name: 'updatedAt', label: 'Updated At', type: 'date', readOnly: true }
  ];

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (row: RecentUserActivityData) => row._id.substring(0, 8) + '...',
    },
    {
      key: 'userId',
      header: 'User',
      cell: (row: RecentUserActivityData) => userMap[row.userId] || row.userId.substring(0, 8) + '...',
    },
    {
      key: 'description',
      header: 'Description',
      cell: (row: RecentUserActivityData) => (
        <span className="line-clamp-1">{row.description}</span>
      ),
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
      cell: (row: RecentUserActivityData) => 
        row.transactionId ? row.transactionId.substring(0, 8) + '...' : 'N/A',
    },
    {
      key: 'recentUserActivityType',
      header: 'Activity Type',
      sortable: true,
      cell: (row: RecentUserActivityData) => (
        <StatusBadge status={row.recentUserActivityType} />
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      cell: (row: RecentUserActivityData) => format(new Date(row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Recent User Activities</h1>
        </div>
      </div>

      {activitiesLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable 
          data={activities || []} 
          columns={columns} 
          onView={(activity) => {
            console.log("View activity", activity);
          }}
          onEdit={handleEditActivity}
        />
      )}

      {selectedActivity && (
        <EditDialog
          title="Edit Activity"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveActivity}
          fields={activityFields}
          initialData={selectedActivity}
          isLoading={updateActivityMutation.isPending}
        />
      )}
    </div>
  );
};

export default RecentUserActivities;
