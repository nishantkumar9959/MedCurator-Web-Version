import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TopBarProps {
  isSidebarCollapsed: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function TopBar({ isSidebarCollapsed, setIsMobileMenuOpen }: TopBarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`fixed top-0 right-0 h-16 z-30 flex justify-between items-center px-4 md:px-8 bg-surface-container-lowest/80 backdrop-blur-lg shadow-[0px_12px_32px_rgba(25,28,29,0.06)] transition-all duration-300 w-full ${isSidebarCollapsed ? 'md:w-[calc(100%-5rem)]' : 'md:w-[calc(100%-16rem)]'}`}>
      <div className="flex items-center flex-1 gap-3">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative w-full max-w-md hidden sm:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-on-surface placeholder:text-on-surface-variant/50" 
            placeholder="Search operational analytics..." 
            type="text" 
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="flex items-center space-x-1 md:space-x-2">
          <button className="sm:hidden p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-outline-variant/30 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-outline-variant/20 bg-surface-container-low">
                    <h3 className="font-headline font-bold text-sm text-on-surface">Notifications</h3>
                  </div>
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3 text-on-surface-variant/50">
                      <BellOff className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-on-surface">No notifications</p>
                    <p className="text-xs text-on-surface-variant mt-1">You're all caught up!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
              isActive
                ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
                : 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-500'}`} />
            <span className="text-xs font-medium">{isActive ? 'Active' : 'Inactive'}</span>
          </button>
        </div>
        
        <div className="hidden md:block h-6 w-px bg-outline-variant"></div>
        
        <div className="hidden md:block text-right">
          <p className="font-body text-xs font-medium text-on-surface-variant">{currentDate}</p>
          <p className="font-headline text-sm font-black text-on-surface">Dr. Nishant Kumar</p>
        </div>
        
        <img 
          alt="Dr. Nishant Kumar" 
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-surface-container-lowest shadow-sm" 
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100"
          referrerPolicy="no-referrer"
        />
      </div>
    </header>
  );
}
