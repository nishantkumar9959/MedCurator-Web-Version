import React from 'react';
import { Search, Bell, History } from 'lucide-react';

export function TopBar() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 flex justify-between items-center px-8 bg-surface-container-lowest/80 backdrop-blur-lg shadow-[0px_12px_32px_rgba(25,28,29,0.06)]">
      <div className="flex items-center flex-1">
        <div className="relative w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-on-surface placeholder:text-on-surface-variant/50" 
            placeholder="Search operational analytics..." 
            type="text" 
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
            <History className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-6 w-px bg-outline-variant"></div>
        
        <div className="text-right">
          <p className="font-body text-xs font-medium text-on-surface-variant">{currentDate}</p>
          <p className="font-headline text-sm font-black text-on-surface">Dr. Nishant Kumar</p>
        </div>
        
        <img 
          alt="Dr. Nishant Kumar" 
          className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-container-lowest shadow-sm" 
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100"
          referrerPolicy="no-referrer"
        />
      </div>
    </header>
  );
}
