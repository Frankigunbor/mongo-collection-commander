
import React, { useState, useEffect } from 'react';
import { connectToDatabase, closeDatabaseConnection } from '@/lib/mongodb/client';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const MongoDBStatus = () => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus('connecting');
        await connectToDatabase();
        setStatus('connected');
        setError(null);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error connecting to MongoDB');
      }
    };

    checkConnection();

    return () => {
      // Close connection when component unmounts
      closeDatabaseConnection().catch(console.error);
    };
  }, []);

  return (
    <div className="rounded-md border p-4 my-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">MongoDB Connection</h3>
        {status === 'connected' && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Connected
          </Badge>
        )}
        {status === 'connecting' && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Connecting...
          </Badge>
        )}
        {status === 'disconnected' && (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Disconnected
          </Badge>
        )}
        {status === 'error' && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Error
          </Badge>
        )}
      </div>
      
      {error && (
        <>
          <Separator className="my-2" />
          <div className="text-sm text-red-500 mt-2 break-words">
            {error}
          </div>
        </>
      )}

      <Separator className="my-2" />
      
      <div className="text-xs text-gray-500 mt-2">
        Database: broadsend-backend
      </div>
    </div>
  );
};
