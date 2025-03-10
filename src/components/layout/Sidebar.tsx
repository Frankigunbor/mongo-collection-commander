
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Award, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  Settings
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar fixed lg:relative z-30 border-r transition-all duration-300 ease-in-out",
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
          
          <button 
            onClick={() => setOpen(!open)}
            className="rounded-full p-1 hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
        
        <nav className="flex-1 pt-5 px-3 space-y-1">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} text="Dashboard" open={open} />
          <NavItem to="/kyc" icon={<Users size={20} />} text="KYC" open={open} />
          <NavItem to="/activities" icon={<Activity size={20} />} text="User Activities" open={open} />
          <NavItem to="/rewards" icon={<Award size={20} />} text="Rewards" open={open} />
          <NavItem to="/transactions" icon={<CreditCard size={20} />} text="Transactions" open={open} />
        </nav>
        
        <div className="p-3 mt-auto">
          <NavItem to="/settings" icon={<Settings size={20} />} text="Settings" open={open} />
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
        cn("sidebar-item", 
           isActive ? "active" : "",
           !open && "justify-center px-2"
        )
      }
    >
      {icon}
      {open && <span>{text}</span>}
    </NavLink>
  );
}
