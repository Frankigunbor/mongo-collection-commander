
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';
import { DataTable } from '@/components/ui-custom/DataTable';
import { fetchRecentUserActivityData, RecentUserActivityData, fetchUserData } from '@/lib/api';

const RecentUserActivities = () => {
  const { data: recentUserActivities, isLoading } = useQuery({
    queryKey: ['recentUserActivities'],
    queryFn: fetchRecentUserActivityData
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
      cell: (row: RecentUserActivityData) => row.description,
    },
    {
      key: 'recentUserActivityType',
      header: 'Activity Type',
      cell: (row: RecentUserActivityData) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(row.recentUserActivityType)}`}>
          {row.recentUserActivityType}
        </span>
      ),
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
      cell: (row: RecentUserActivityData) => row.transactionId ? row.transactionId.substring(0, 8) + '...' : 'N/A',
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      cell: (row: RecentUserActivityData) => format(new Date(row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
  ];

  // Helper function to get color based on activity type
  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'TRANSACTION':
        return 'bg-blue-100 text-blue-800';
      case 'LOGIN':
        return 'bg-green-100 text-green-800';
      case 'LOGOUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'SIGNUP':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (activity: RecentUserActivityData) => {
    console.log("View activity details", activity);
    // Implement view details functionality here
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Recent User Activities</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable 
          data={recentUserActivities || []} 
          columns={columns} 
          onView={handleViewDetails}
        />
      )}
    </div>
  );
};

export default RecentUserActivities;
