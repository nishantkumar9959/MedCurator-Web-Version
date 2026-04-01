import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, BellOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface TopBarProps {
  isSidebarCollapsed: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function TopBar({ isSidebarCollapsed, setIsMobileMenuOpen }: TopBarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const currentUser = auth.currentUser;
  const defaultName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "User";
  const defaultPhoto = currentUser?.photoURL || "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E0E0E0'/%3E%3Cpath d='M50 48C59.3888 48 67 40.3888 67 31C67 21.6112 59.3888 14 50 14C40.6112 14 33 21.6112 33 31C33 40.3888 40.6112 48 50 48ZM50 55C33.3333 55 0 63.3333 0 80V100H100V80C100 63.3333 66.6667 55 50 55Z' fill='%23FFFFFF'/%3E%3C/svg%3E";

  const [profile, setProfile] = useState({
    displayName: defaultName,
    photoURL: defaultPhoto
  });
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch profile from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const userDocRef = doc(db, 'users', currentUser.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          displayName: data.displayName || defaultName,
          photoURL: data.photoURL || defaultPhoto
        });
      } else {
        setProfile({
          displayName: defaultName,
          photoURL: defaultPhoto
        });
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching user profile:", error);
      setProfile({
        displayName: defaultName,
        photoURL: defaultPhoto
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, defaultName, defaultPhoto]);

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
        
        <div className="hidden md:block text-right min-w-[120px]">
          <p className="font-body text-xs font-medium text-on-surface-variant">{currentDate}</p>
          {isLoading ? (
            <div className="flex justify-end">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            </div>
          ) : (
            <p className="font-headline text-sm font-black text-on-surface truncate max-w-[150px]">{profile.displayName}</p>
          )}
        </div>
        
        <div className="relative w-8 h-8 md:w-10 md:h-10">
          {isLoading ? (
            <div className="w-full h-full rounded-full bg-surface-container-high animate-pulse" />
          ) : (
            <img 
              alt={profile.displayName} 
              className="w-full h-full rounded-full object-cover ring-2 ring-surface-container-lowest shadow-sm" 
              src={profile.photoURL}
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      </div>
    </header>
  );
}
