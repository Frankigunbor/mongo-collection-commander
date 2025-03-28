
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Award, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  LogOut,
  Wallet,
  History,
  ShoppingBag,
  UserPlus,
  FileCheck,
  Shield,
  Lock,
  RefreshCcw,
  User,
  ActivitySquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar fixed z-30 border-r transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center justify-between h-16 px-4",
          open ? "px-6" : "px-2"
        )}>
          {open ? (
            <h1 className="text-primary font-bold text-xl tracking-tight">BroadAdmin</h1>
          ) : (
            <div className="w-full flex justify-center">
              <span className="text-primary font-bold text-xl">B</span>
            </div>
          )}
          
          <Button 
            onClick={() => setOpen(!open)}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent"
          >
            {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>
        
        <nav className="flex-1 pt-5 px-3 space-y-1 overflow-y-auto">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" open={open} />
          
          {/* KYC Management Section */}
          {open && <div className="sidebar-section">KYC Management</div>}
       
          <NavItem to="/user-kycs" icon={<Shield size={20} />} text="User KYC" open={open} />
          <NavItem to="/user-kyc-details" icon={<FileCheck size={20} />} text="KYC Details" open={open} />
          
          {/* User Management Section */}
          {open && <div className="sidebar-section">User Management</div>}
          <NavItem to="/users" icon={<Users size={20} />} text="Users" open={open} />
          <NavItem to="/user-referrals" icon={<UserPlus size={20} />} text="Referrals" open={open} />
          <NavItem to="/user-auth" icon={<Lock size={20} />} text="Authentication" open={open} />
          <NavItem to="/recent-user-activities" icon={<ActivitySquare size={20} />} text="Recent User Activities" open={open} />
          
          {/* Financial Section */}
          {open && <div className="sidebar-section">Financial</div>}
          <NavItem to="/rewards" icon={<Award size={20} />} text="Rewards" open={open} />
          <NavItem to="/transactions" icon={<CreditCard size={20} />} text="Transactions" open={open} />
          <NavItem to="/transaction-entries" icon={<RefreshCcw size={20} />} text="Transaction Entries" open={open} />
          <NavItem to="/wallets" icon={<Wallet size={20} />} text="Wallets" open={open} />
          <NavItem to="/wallet-history" icon={<History size={20} />} text="Wallet History" open={open} />
          <NavItem to="/vendor-responses" icon={<ShoppingBag size={20} />} text="Vendor Responses" open={open} />
        </nav>
        
        <div className="p-3 mt-auto space-y-1">
          <NavItem to="/settings" icon={<Settings size={20} />} text="Settings" open={open} />
          <NavItem to="/profile" icon={<User size={20} />} text="Profile" open={open} />
          <button
            className={cn(
              "w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              !open && "justify-center px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  open: boolean;
}

function NavItem({ to, icon, text, open }: NavItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" 
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
          !open && "justify-center px-2"
        )
      }
    >
      {icon}
      {open && <span>{text}</span>}
    </NavLink>
  );
}
