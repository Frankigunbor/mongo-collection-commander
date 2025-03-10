
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ActivityData, fetchActivityData } from '@/lib/api';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Activities = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchActivityData();
        setActivities(data);
      } catch (error) {
        console.error("Failed to load activity data:", error);
        toast({
          title: "Error",
          description: "Failed to load user activity data",
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
      cell: (activity: ActivityData) => <span className="font-mono text-xs">{activity._id.substring(0, 10)}...</span>,
    },
    {
      key: 'userId',
      header: 'User ID',
      cell: (activity: ActivityData) => <span className="font-mono text-xs">{activity.userId.substring(0, 10)}...</span>,
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
        >
          {activity.recentUserActivityType}
        </StatusBadge>
      ),
      sortable: true,
    },
    {
      key: 'accountId',
      header: 'Account ID',
      cell: (activity: ActivityData) => <span className="font-mono text-xs">{activity.accountId.substring(0, 10)}...</span>,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      cell: (activity: ActivityData) => formatDate(activity.createdAt),
      sortable: true,
    },
  ];

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

  const handleView = (activity: ActivityData) => {
    setSelectedActivity(activity);
  };

  const handleCloseDialog = () => {
    setSelectedActivity(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">User Activities</h2>
      </div>
      
      <DataTable 
        data={activities} 
        columns={columns} 
        onView={handleView}
      />
      
      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Activity Details
              <span className="font-mono text-xs ml-2">
                #{selectedActivity?._id.substring(0, 8)}
              </span>
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
                      >
                        {selectedActivity.recentUserActivityType}
                      </StatusBadge>
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
                  onClick={handleCloseDialog}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activities;
