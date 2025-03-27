
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActivityData, fetchActivityData, fetchUserData, updateActivity, createActivity } from '@/lib/api';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Activity, X } from 'lucide-react';
import { EditDialog, FieldConfig } from '@/components/ui-custom/EditDialog';
import { format } from 'date-fns';

const Activities = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivityData
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

  const updateActivityMutation = useMutation({
    mutationFn: updateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
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

  const createActivityMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: 'Success',
        description: 'Activity created successfully',
      });
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create activity: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const handleViewActivity = (activity: ActivityData) => {
    setSelectedActivity(activity);
    setIsViewDialogOpen(true);
  };

  const handleEditActivity = (activity: ActivityData) => {
    setSelectedActivity(activity);
    setIsEditDialogOpen(true);
  };

  const handleCreateActivity = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveActivity = (updatedData: Record<string, any>) => {
    if (!selectedActivity) return;
    
    updateActivityMutation.mutate({
      ...selectedActivity,
      ...updatedData,
    } as ActivityData);
  };

  const handleCreateNewActivity = (data: Record<string, any>) => {
    createActivityMutation.mutate(data as Partial<ActivityData>);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
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
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    { 
      name: 'recentUserActivityType', 
      label: 'Activity Type', 
      type: 'select',
      options: [
        { value: 'BENEFICIARY', label: 'Beneficiary' },
        { value: 'AUTH', label: 'Authentication' },
        { value: 'TRANSACTION', label: 'Transaction' },
        { value: 'KYC', label: 'KYC' }
      ] 
    },
    { name: 'accountId', label: 'Account ID', type: 'text' },
    { name: 'createdAt', label: 'Created At', type: 'date', readOnly: true },
    { name: 'updatedAt', label: 'Updated At', type: 'date', readOnly: true }
  ];

  const createActivityFields: FieldConfig[] = [
    { 
      name: 'userId', 
      label: 'User', 
      type: 'select',
      options: users?.map(user => ({
        value: user._id,
        label: `${user.firstName} ${user.lastName}`
      })) || [],
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    { 
      name: 'recentUserActivityType', 
      label: 'Activity Type', 
      type: 'select',
      options: [
        { value: 'BENEFICIARY', label: 'Beneficiary' },
        { value: 'AUTH', label: 'Authentication' },
        { value: 'TRANSACTION', label: 'Transaction' },
        { value: 'KYC', label: 'KYC' }
      ] 
    },
    { name: 'accountId', label: 'Account ID', type: 'text' }
  ];

  const columns = [
    {
      key: '_id',
      header: 'ID',
      cell: (activity: ActivityData) => <span className="font-mono text-xs">{activity._id.substring(0, 10)}...</span>,
    },
    {
      key: 'userId',
      header: 'User',
      cell: (activity: ActivityData) => <span>{userMap[activity.userId] || activity.userId.substring(0, 10)}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      cell: (activity: ActivityData) => (
        <div className="max-w-xs truncate">{activity.description}</div>
      ),
      sortable: true,
    },
    {
      key: 'recentUserActivityType',
      header: 'Activity Type',
      cell: (activity: ActivityData) => (
        <StatusBadge 
          status={
            activity.recentUserActivityType === 'BENEFICIARY' ? 'active' : 
            activity.recentUserActivityType === 'AUTH' ? 'pending' : 'success'
          } 
          className="font-semibold"
        />
      ),
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      cell: (activity: ActivityData) => formatDate(activity.createdAt),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">User Activities</h2>
        </div>
        <Button 
          onClick={handleCreateActivity}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Activity
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable 
          data={activities || []} 
          columns={columns} 
          onView={handleViewActivity}
          onEdit={handleEditActivity}
        />
      )}
      
      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>
                Activity Details
                <span className="font-mono text-xs ml-2">
                  #{selectedActivity?._id.substring(0, 8)}
                </span>
              </span>
              <Button variant="ghost" size="icon" onClick={() => setIsViewDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Activity Type</h4>
                    <p className="mt-1">
                      <StatusBadge 
                        status={
                          selectedActivity.recentUserActivityType === 'BENEFICIARY' ? 'active' : 
                          selectedActivity.recentUserActivityType === 'AUTH' ? 'pending' : 'success'
                        } 
                        className="font-semibold"
                      />
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
                    <p className="mt-1">{formatDate(selectedActivity.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p className="p-3 bg-muted/20 rounded-lg">{selectedActivity.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">User ID</h4>
                  <p className="font-mono text-sm mt-1">{selectedActivity.userId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Account ID</h4>
                  <p className="font-mono text-sm mt-1">{selectedActivity.accountId}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                <p className="mt-1">{formatDate(selectedActivity.updatedAt)}</p>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  type="button"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
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

      {/* Create Dialog */}
      <EditDialog
        title="Add New Activity"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleCreateNewActivity}
        fields={createActivityFields}
        initialData={{}}
        isLoading={createActivityMutation.isPending}
      />
    </div>
  );
};

export default Activities;
