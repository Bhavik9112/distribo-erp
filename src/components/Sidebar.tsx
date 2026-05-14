import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Package, 
  Briefcase, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Building2,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { logOut } from '@/lib/firebase';

interface SidebarProps {
  role: 'ADMIN' | 'MANAGER' | 'SALESPERSON' | 'CUSTOMER';
}

const navItems = {
  ADMIN: [
    { name: 'Dashboard', icon: BarChart3, path: '/admin' },
    { name: 'Managers', icon: Users, path: '/admin/managers' },
    { name: 'Sales Team', icon: Briefcase, path: '/admin/sales' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ],
  MANAGER: [
    { name: 'Dashboard', icon: BarChart3, path: '/manager' },
    { name: 'Sales Team', icon: Briefcase, path: '/manager/sales' },
    { name: 'Orders', icon: ShoppingCart, path: '/manager/orders' },
    { name: 'Visits', icon: MapPin, path: '/manager/visits' },
  ],
  SALESPERSON: [
    { name: 'Dashboard', icon: BarChart3, path: '/sales' },
    { name: 'Customers', icon: Users, path: '/sales/customers' },
    { name: 'Visits', icon: MapPin, path: '/sales/visits' },
    { name: 'Take Order', icon: ShoppingCart, path: '/sales/order' },
  ],
  CUSTOMER: [
    { name: 'Shop', icon: ShoppingCart, path: '/customer' },
    { name: 'My Orders', icon: ClipboardList, path: '/customer/orders' },
    { name: 'Profile', icon: Settings, path: '/customer/profile' },
  ],
};

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { profile } = useAuth();
  const items = navItems[role] || [];

  return (
    <aside className="w-60 bg-brand-sidebar flex flex-col h-full border-r border-slate-800 shrink-0">
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
          {profile?.companyId?.charAt(0).toUpperCase() || 'D'}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-white font-semibold text-sm leading-none truncate">
            {profile?.status === 'active' ? 'DistriSync' : 'Setup Required'}
          </span>
          <span className="text-slate-400 text-[10px] uppercase tracking-wider mt-1 truncate">
            {role} Portal
          </span>
        </div>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="text-slate-500 text-[10px] uppercase font-bold px-3 mb-2 tracking-widest">
          Main Console
        </div>
        
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split('/').length <= 2}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2 text-xs font-medium rounded-md transition-colors duration-150 cursor-pointer",
                isActive 
                  ? "bg-blue-600/15 text-blue-400 border border-blue-600/20 shadow-sm" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )
            }
          >
            <item.icon className={cn(
              "mr-3 h-4 w-4 transition-colors",
              "group-hover:text-slate-200"
            )} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 bg-slate-900 border-t border-slate-800 mt-auto">
        <div className="flex items-center mb-4 p-2 bg-slate-800/30 rounded-lg">
          <div className="w-7 h-7 rounded bg-emerald-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
            {profile?.name.charAt(0)}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-[11px] text-white font-medium truncate">{profile?.name || 'User'}</p>
            <p className="text-[9px] text-slate-500 truncate lowercase">{profile?.email}</p>
          </div>
        </div>
        <button 
          onClick={logOut}
          className="flex w-full items-center px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 rounded-md hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};
