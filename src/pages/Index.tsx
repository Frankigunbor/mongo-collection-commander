
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
   
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold mb-4">Welcome to Admin Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Manage your KYC verifications, activities, rewards, and transactions
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/dashboard')} 
            className="mt-4"
          >
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    
  );
};

export default Index;
