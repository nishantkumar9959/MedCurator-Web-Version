import React, { useState, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { RegistrationView } from './components/RegistrationView';
import { AppointmentsView } from './components/AppointmentsView';
import { PharmacyView } from './components/PharmacyView';
import { BillingView } from './components/BillingView';
import { SettingsView } from './components/SettingsView';
import { AnimatePresence, motion } from 'motion/react';
import { AIAssistant } from './components/AIAssistant';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginView } from './components/auth/LoginView';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  time: string;
  date: string; // ISO format or 'Today'/'Tomorrow'
  type: 'In-Person' | 'Tele-health';
  status: 'Confirmed' | 'Pending';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [triggerNewAppointment, setTriggerNewAppointment] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser && appointments.length === 0) {
        const defaultName = currentUser.displayName || currentUser.email?.split('@')[0] || "Dr. Nishant Kumar";
        setAppointments([
          { id: 'APT-101', patient: 'Rajesh Kumar', doctor: defaultName, time: '10:00 AM', date: new Date().toISOString().split('T')[0], type: 'In-Person', status: 'Confirmed' },
          { id: 'APT-102', patient: 'Anita Sharma', doctor: 'Dr. Sarah Khan', time: '11:30 AM', date: new Date().toISOString().split('T')[0], type: 'Tele-health', status: 'Pending' },
          { id: 'APT-103', patient: 'Priya Das', doctor: defaultName, time: '02:00 PM', date: new Date().toISOString().split('T')[0], type: 'In-Person', status: 'Confirmed' },
          { id: 'APT-104', patient: 'Suresh Raina', doctor: 'Dr. Amit Shah', time: '09:00 AM', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], type: 'In-Person', status: 'Confirmed' },
        ]);
      }
    });
    return () => unsubscribe();
  }, [appointments.length]);

  const renderView = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Registration':
        return <RegistrationView 
          setActiveTab={setActiveTab} 
          setTriggerNewAppointment={setTriggerNewAppointment} 
        />;
      case 'Appointments':
        return <AppointmentsView 
          appointments={appointments} 
          setAppointments={setAppointments}
          triggerNewAppointment={triggerNewAppointment}
          setTriggerNewAppointment={setTriggerNewAppointment}
        />;
      case 'Pharmacy':
        return <PharmacyView />;
      case 'Billing':
        return <BillingView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <TopBar 
        isSidebarCollapsed={isSidebarCollapsed} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      <main className={`pt-20 md:pt-16 min-h-screen bg-surface-container-low p-4 sm:p-6 md:p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      <AIAssistant />
    </div>
  );
}
