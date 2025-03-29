
import React, { useState, useEffect } from 'react';
import { checkConnectionStatus } from '@/lib/mongodb/client';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

export const MongoDBStatus = () => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [databaseInfo, setDatabaseInfo] = useState<{name: string}>({ name: "" });
  const [isBrowser, setIsBrowser] = useState<boolean>(false);

  useEffect(() => {
    // Set browser environment flag
    setIsBrowser(typeof window !== 'undefined');
    
    const checkConnection = async () => {
      try {
        setStatus('connecting');
        const connectionStatus = await checkConnectionStatus();
        
        if (connectionStatus.status === 'connected') {
          setStatus('connected');
          setDatabaseInfo({ name: connectionStatus.database || 'broadsend-backend' });
          setError(null);
        } else {
          setStatus('error');
          setError(connectionStatus.message || 'Unknown error connecting to MongoDB');
          toast({
            title: "Database Connection Error",
            description: connectionStatus.message || 'Unknown error connecting to MongoDB',
            variant: "destructive"
          });
        }
      } catch (err: any) {
        setStatus('error');
        const errorMessage = err instanceof Error ? err.message : 'Unknown error connecting to MongoDB';
        setError(errorMessage);
        toast({
          title: "Database Connection Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="rounded-md border p-4 my-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">MongoDB Connection</h3>
        {status === 'connected' && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Connected via API
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
        Database: <span className="font-medium">{databaseInfo.name || 'broadsend-backend'} (via API)</span>
      </div>

      <div className="text-xs text-amber-500 mt-2">
        <p>API Server: http://localhost:5000</p>
        <p>Note: Make sure the backend server is running on your local machine.</p>
      </div>
    </div>
  );
};
