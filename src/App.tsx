import React, { useState } from 'react';
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
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'APT-101', patient: 'Rajesh Kumar', doctor: 'Dr. Nishant Kumar', time: '10:00 AM', date: new Date().toISOString().split('T')[0], type: 'In-Person', status: 'Confirmed' },
    { id: 'APT-102', patient: 'Anita Sharma', doctor: 'Dr. Sarah Khan', time: '11:30 AM', date: new Date().toISOString().split('T')[0], type: 'Tele-health', status: 'Pending' },
    { id: 'APT-103', patient: 'Priya Das', doctor: 'Dr. Nishant Kumar', time: '02:00 PM', date: new Date().toISOString().split('T')[0], type: 'In-Person', status: 'Confirmed' },
    { id: 'APT-104', patient: 'Suresh Raina', doctor: 'Dr. Amit Shah', time: '09:00 AM', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], type: 'In-Person', status: 'Confirmed' },
  ]);
  const [triggerNewAppointment, setTriggerNewAppointment] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <TopBar />
      
      <main className="ml-64 pt-16 min-h-screen bg-surface-container-low p-8">
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
