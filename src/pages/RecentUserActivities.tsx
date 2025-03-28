
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/ui-custom/DataTable';
import { useAuth } from '@/contexts/AuthContext';

// Define the RecentUserActivity interface
interface RecentUserActivity {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  description: string;
  transactionId: string;
  recentUserActivityType: string;
}

// Fields configuration for the data table
const fields = [
  { key: '_id', label: 'ID' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
  { key: 'userId', label: 'User ID' },
  { key: 'description', label: 'Description' },
  { key: 'transactionId', label: 'Transaction ID' },
  { key: 'recentUserActivityType', label: 'Activity Type' },
];

// API functions for CRUD operations
const fetchRecentUserActivities = async (): Promise<RecentUserActivity[]> => {
  const response = await fetch('/api/recentuseractivities');
  if (!response.ok) {
    throw new Error('Failed to fetch recent user activities');
  }
  return response.json();
};

const createRecentUserActivity = async (data: Partial<RecentUserActivity>): Promise<RecentUserActivity> => {
  const response = await fetch('/api/recentuseractivities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create recent user activity');
  }
  
  return response.json();
};

const updateRecentUserActivity = async ({ id, data }: { id: string; data: Partial<RecentUserActivity> }): Promise<RecentUserActivity> => {
  const response = await fetch(`/api/recentuseractivities/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update recent user activity');
  }
  
  return response.json();
};

const deleteRecentUserActivity = async (id: string): Promise<void> => {
  const response = await fetch(`/api/recentuseractivities/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete recent user activity');
  }
};

// Main component for managing recent user activities
const RecentUserActivities: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for dialog visibility and form data
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<RecentUserActivity | null>(null);
  const [formData, setFormData] = useState<Partial<RecentUserActivity>>({
    userId: '',
    description: '',
    transactionId: '',
    recentUserActivityType: '',
  });

  // Query for fetching recent user activities
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['recentUserActivities'],
    queryFn: fetchRecentUserActivities,
    enabled: isAuthenticated,
  });

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: createRecentUserActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentUserActivities'] });
      setIsCreateDialogOpen(false);
      resetFormData();
      toast({
        title: 'Success',
        description: 'Recent user activity created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create recent user activity: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateRecentUserActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentUserActivities'] });
      setIsEditDialogOpen(false);
      resetFormData();
      toast({
        title: 'Success',
        description: 'Recent user activity updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update recent user activity: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecentUserActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentUserActivities'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Recent user activity deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete recent user activity: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedActivity?._id) {
      updateMutation.mutate({ id: selectedActivity._id, data: formData });
    }
  };

  const handleEditClick = (activity: RecentUserActivity) => {
    setSelectedActivity(activity);
    setFormData({
      userId: activity.userId,
      description: activity.description,
      transactionId: activity.transactionId,
      recentUserActivityType: activity.recentUserActivityType,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (activity: RecentUserActivity) => {
    setSelectedActivity(activity);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedActivity?._id) {
      deleteMutation.mutate(selectedActivity._id);
    }
  };

  const resetFormData = () => {
    setFormData({
      userId: '',
      description: '',
      transactionId: '',
      recentUserActivityType: '',
    });
    setSelectedActivity(null);
  };

  // Actions for the DataTable component
  const actions = [
    {
      label: 'Edit',
      onClick: handleEditClick,
    },
    {
      label: 'Delete',
      onClick: handleDeleteClick,
    },
  ];

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load recent user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Define form fields for create and edit dialogs
  const formFields = [
    { 
      id: 'userId', 
      label: 'User ID', 
      type: 'text',
      placeholder: 'Enter user ID'
    },
    { 
      id: 'description', 
      label: 'Description', 
      type: 'text',
      placeholder: 'Enter activity description' 
    },
    { 
      id: 'transactionId', 
      label: 'Transaction ID', 
      type: 'text',
      placeholder: 'Enter transaction ID' 
    },
    { 
      id: 'recentUserActivityType', 
      label: 'Activity Type', 
      type: 'text',
      placeholder: 'Enter activity type (e.g., TRANSACTION)' 
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent User Activities</CardTitle>
            <CardDescription>View and manage user activity logs</CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>Add New Activity</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={activities || []}
            fields={fields}
            isLoading={isLoading}
            actions={actions}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>
              Create a new user activity record.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              {formFields.map((field) => (
                <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field.id} className="text-right">
                    {field.label}
                  </Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    value={formData[field.id as keyof typeof formData] || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Update the user activity record.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              {formFields.map((field) => (
                <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`edit-${field.id}`} className="text-right">
                    {field.label}
                  </Label>
                  <Input
                    id={`edit-${field.id}`}
                    name={field.id}
                    value={formData[field.id as keyof typeof formData] || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecentUserActivities;
