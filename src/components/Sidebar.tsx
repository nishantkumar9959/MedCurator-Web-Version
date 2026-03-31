import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Calendar, 
  Pill, 
  CreditCard, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type TabType = 'Dashboard' | 'Registration' | 'Appointments' | 'Pharmacy' | 'Billing' | 'Settings';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' as TabType },
  { icon: UserPlus, label: 'Registration' as TabType },
  { icon: Calendar, label: 'Appointments' as TabType },
  { icon: Pill, label: 'Pharmacy' as TabType },
  { icon: CreditCard, label: 'Billing' as TabType },
];

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col bg-[#212529] shadow-2xl z-50 py-6 font-headline font-semibold tracking-tight">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold text-white tracking-widest">MedCurator</h1>
        <p className="text-xs text-slate-500 font-medium tracking-normal mt-1">Clinical Systems</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={cn(
              "w-[calc(100%-2rem)] flex items-center px-4 py-3 mx-4 mb-1 transition-all duration-200 rounded-xl text-left",
              activeTab === item.label 
                ? "bg-blue-600 text-white shadow-lg scale-95 active:scale-100" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-6">
        <button 
          onClick={() => setActiveTab('Settings')}
          className={cn(
            "w-[calc(100%-2rem)] flex items-center px-4 py-3 mx-4 mb-1 transition-all duration-200 rounded-xl text-left",
            activeTab === 'Settings'
              ? "bg-blue-600 text-white shadow-lg scale-95 active:scale-100" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <Settings className="w-5 h-5 mr-3" />
          <span>Settings</span>
        </button>
        <button className="w-[calc(100%-2rem)] flex items-center px-4 py-3 text-slate-400 hover:text-white mx-4 mb-1 hover:bg-slate-800 transition-colors duration-200 text-left">
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
