
import React, { useState, useEffect } from 'react';
import { Menu, Bell, BellDot, Moon, Sun, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getTransactionData } from '@/lib/mongodb/services';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const location = useLocation();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date());
  const { toast } = useToast();
  
  // Check for new transactions every minute
  useEffect(() => {
    const checkForNewTransactions = async () => {
      try {
        const transactions = await getTransactionData();
        
        // Check if there are any transactions created after our last check
        const newTransactions = transactions.filter(tx => {
          const txDate = new Date(tx.createdAt);
          return txDate > lastCheckTime;
        });
        
        if (newTransactions.length > 0) {
          setHasNewNotifications(true);
          // Only show toast if we're not on first load
          if (lastCheckTime.getTime() > new Date().getTime() - 2000) {
            toast({
              title: "New Transactions",
              description: `${newTransactions.length} new transaction${newTransactions.length === 1 ? '' : 's'} received`,
            });
          }
        }
        
        setLastCheckTime(new Date());
      } catch (error) {
        console.error("Error checking for new transactions:", error);
      }
    };
    
    // Run immediately on mount
    checkForNewTransactions();
    
    // Set up interval to check every minute
    const intervalId = setInterval(checkForNewTransactions, 60000);
    
    return () => clearInterval(intervalId);
  }, [toast, lastCheckTime]);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  // Clear notifications when clicked
  const handleNotificationClick = () => {
    setHasNewNotifications(false);
  };
  
  // Get current page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
  };

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="h-full flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </Button>
          
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>
        
        <div className="hidden md:flex max-w-md w-full mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-full bg-background/50 focus:bg-background"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground relative"
            onClick={handleNotificationClick}
          >
            {hasNewNotifications ? (
              <BellDot size={18} className="text-primary" />
            ) : (
              <Bell size={18} />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 rounded-full overflow-hidden border"
              >
                <span className="sr-only">User menu</span>
                <div className="bg-primary text-primary-foreground flex items-center justify-center h-full w-full">
                  A
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
