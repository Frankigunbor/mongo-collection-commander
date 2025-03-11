
import { cn } from '@/lib/utils';
import React from 'react';

export interface StatusBadgeProps {
  status: 'success' | 'pending' | 'failed' | 'active' | 'inactive' | string;
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  const lowerStatus = status.toLowerCase();
  
  const getColorClasses = () => {
    switch (lowerStatus) {
      case 'success':
      case 'active':
      case 'true':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'error':
      case 'inactive':
      case 'false':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getDisplayText = () => {
    if (lowerStatus === 'true') return 'Active';
    if (lowerStatus === 'false') return 'Inactive';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
        getColorClasses(),
        className
      )}
    >
      <span className={cn(
        'mr-1 h-1.5 w-1.5 rounded-full',
        {
          'bg-green-500': lowerStatus === 'success' || lowerStatus === 'active' || lowerStatus === 'true',
          'bg-yellow-500': lowerStatus === 'pending' || lowerStatus === 'processing',
          'bg-red-500': lowerStatus === 'failed' || lowerStatus === 'error' || lowerStatus === 'inactive' || lowerStatus === 'false',
          'bg-blue-500': !['success', 'active', 'pending', 'processing', 'failed', 'error', 'inactive', 'true', 'false'].includes(lowerStatus),
        }
      )} />
      {children || getDisplayText()}
    </span>
  );
}
