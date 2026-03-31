import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Calendar, 
  Pill, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

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
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 flex flex-col bg-[#212529] shadow-2xl z-50 py-6 font-headline font-semibold tracking-tight transition-all duration-300 overflow-y-auto overscroll-contain",
        isCollapsed ? "md:w-20 w-64" : "w-64",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className={cn("px-6 mb-10 flex items-center shrink-0", isCollapsed ? "md:justify-center px-6 md:px-0 justify-between" : "justify-between")}>
          {(!isCollapsed || isMobileMenuOpen) ? (
            <div>
              <h1 className="text-xl font-bold text-white tracking-widest">MedCurator</h1>
              <p className="text-xs text-slate-500 font-medium tracking-normal mt-1">Clinical Systems</p>
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center text-white shadow-lg hidden md:flex">
              <Activity className="w-6 h-6" />
            </div>
          )}
          <button 
            className="md:hidden text-slate-400 hover:text-white p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setActiveTab(item.label);
              setIsMobileMenuOpen(false);
            }}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              "flex items-center py-3 mb-1 transition-all duration-200 rounded-xl text-left",
              isCollapsed ? "md:justify-center w-full px-4 md:px-0" : "w-full px-4",
              activeTab === item.label 
                ? "bg-blue-600 text-white shadow-lg scale-95 active:scale-100" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className={cn("w-5 h-5", (!isCollapsed || isMobileMenuOpen) && "mr-3")} />
            {(!isCollapsed || isMobileMenuOpen) && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4 px-2 shrink-0">
        <button 
          onClick={() => {
            setActiveTab('Settings');
            setIsMobileMenuOpen(false);
          }}
          title={isCollapsed ? 'Settings' : undefined}
          className={cn(
            "flex items-center py-3 mb-1 transition-all duration-200 rounded-xl text-left",
            isCollapsed ? "md:justify-center w-full px-4 md:px-0" : "w-full px-4",
            activeTab === 'Settings'
              ? "bg-blue-600 text-white shadow-lg scale-95 active:scale-100" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <Settings className={cn("w-5 h-5", (!isCollapsed || isMobileMenuOpen) && "mr-3")} />
          {(!isCollapsed || isMobileMenuOpen) && <span>Settings</span>}
        </button>
        <button 
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : undefined}
          className={cn(
            "flex items-center py-3 mb-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-200 rounded-xl text-left",
            isCollapsed ? "md:justify-center w-full px-4 md:px-0" : "w-full px-4"
          )}
        >
          <LogOut className={cn("w-5 h-5", (!isCollapsed || isMobileMenuOpen) && "mr-3")} />
          {(!isCollapsed || isMobileMenuOpen) && <span>Logout</span>}
        </button>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "hidden md:flex items-center py-3 mt-2 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors duration-200 rounded-xl text-left border border-slate-700/50",
            isCollapsed ? "justify-center w-full px-0" : "w-full px-4"
          )}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5 mr-3" />}
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
