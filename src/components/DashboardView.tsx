import React, { useState, useEffect } from 'react';
import { LucideIcon, Users, CalendarCheck, Clock, BedDouble, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard } from './StatCard';
import { InflowChart } from './InflowChart';
import { RevenueChart } from './RevenueChart';
import { AdmissionsTable } from './AdmissionsTable';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface KPIMetric {
  label: string;
  value: string;
  unit?: string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  colorClass: string;
}

// Mock Data
const kpiData: KPIMetric[] = [
  { label: 'Total Patients', value: '2,540', trend: '+12% vs last month', trendType: 'up', icon: Users, colorClass: 'border-l-blue-600' },
  { label: 'Appointments', value: '1,210', trend: '8% completion rate', trendType: 'up', icon: CalendarCheck, colorClass: 'border-l-emerald-500' },
  { label: 'Avg Waiting Time', value: '18', unit: 'mins', trend: '+2 mins from avg', trendType: 'down', icon: Clock, colorClass: 'border-l-orange-400' },
  { label: 'Bed Occupancy', value: '78', unit: '%', trend: 'Stable across wings', trendType: 'neutral', icon: BedDouble, colorClass: 'border-l-primary' },
];

const weeklyInflow = [
  { name: 'MON', value: 45 },
  { name: 'TUE', value: 52 },
  { name: 'WED', value: 48 },
  { name: 'THU', value: 61 },
  { name: 'FRI', value: 55 },
  { name: 'SAT', value: 67 },
  { name: 'SUN', value: 72 },
];

const monthlyInflow = [
  { name: 'Week 1', value: 320 },
  { name: 'Week 2', value: 450 },
  { name: 'Week 3', value: 380 },
  { name: 'Week 4', value: 510 },
];

const departmentRevenue = [
  { label: 'OPD', value: 1245200 },
  { label: 'IPD', value: 3280800 },
  { label: 'Laboratory', value: 818400 },
  { label: 'Pharmacy', value: 2129100 },
];

const recentAdmissions = [
  { id: 'PX-9921', name: 'Rajesh Kumar', dept: 'Cardiology', status: 'STABLE' as const, time: '08:45 AM' },
  { id: 'PX-9922', name: 'Anita Sharma', dept: 'Emergency', status: 'CRITICAL' as const, time: '09:12 AM' },
  { id: 'PX-9923', name: 'Priya Das', dept: 'Pediatrics', status: 'STABLE' as const, time: '10:30 AM' },
  { id: 'PX-9924', name: 'Suresh Raina', dept: 'Orthopedics', status: 'STABLE' as const, time: '11:15 AM' },
  { id: 'PX-9925', name: 'Meera Bai', dept: 'Neurology', status: 'CRITICAL' as const, time: '12:05 PM' },
  { id: 'PX-9926', name: 'Vikram Singh', dept: 'General Medicine', status: 'STABLE' as const, time: '01:20 PM' },
];

export function DashboardView() {
  const [chartView, setChartView] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [admissionsSearch, setAdmissionsSearch] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'patients'), orderBy('registrationDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientData = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Format the time from ISO string
        let formattedTime = 'N/A';
        if (data.registrationDate) {
          try {
            const date = new Date(data.registrationDate);
            formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          } catch (e) {
            console.error('Error parsing date:', e);
          }
        }

        return {
          id: doc.id.slice(0, 7).toUpperCase(),
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown Patient',
          dept: data.chiefComplaint ? 'General' : 'General', // Defaulting to General as requested
          status: data.status === 'CRITICAL' ? 'CRITICAL' : 'STABLE',
          time: formattedTime
        };
      });
      
      setPatients(patientData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching patients:", error);
      setIsLoading(false);
      // Only throw if it's a permission error
      if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.LIST, 'patients');
      }
    });

    return () => unsubscribe();
  }, []);

  // Update KPI data dynamically
  const dynamicKpiData = [...kpiData];
  dynamicKpiData[0] = { 
    ...dynamicKpiData[0], 
    value: isLoading ? '...' : patients.length.toString() 
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Operational Analytics</h2>
          <p className="text-on-surface-variant mt-1">Real-time clinical performance and patient inflow overview.</p>
        </div>
        <button 
          onClick={() => alert('Generating full operational report...')}
          className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Generate Report
        </button>
      </motion.div>

      {/* KPI Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {dynamicKpiData.map((stat) => (
          <StatCard 
            key={stat.label} 
            label={stat.label}
            value={stat.value}
            unit={stat.unit}
            trend={stat.trend}
            trendType={stat.trendType}
            icon={stat.icon}
            colorClass={stat.colorClass}
          />
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <InflowChart 
          data={chartView === 'Weekly' ? weeklyInflow : monthlyInflow} 
          activeView={chartView}
          onViewChange={setChartView}
        />
        <RevenueChart data={departmentRevenue} />
      </motion.div>

      {/* Admissions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <AdmissionsTable 
          data={patients}
          searchQuery={admissionsSearch}
          onSearchChange={setAdmissionsSearch}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
}
