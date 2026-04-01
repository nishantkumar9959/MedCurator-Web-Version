import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  User, 
  Activity, 
  Heart, 
  Thermometer, 
  ClipboardList, 
  AlertCircle, 
  Syringe,
  FileText,
  Clock,
  ChevronRight,
  Download
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock Data
const mockPatients = [
  {
    id: 'PT-1001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    height: '175 cm',
    weight: '78 kg',
    lastVisit: '2026-03-15',
    allergies: ['Penicillin', 'Peanuts'],
    immunizations: ['COVID-19 (2 Doses)', 'Hepatitis B', 'Tetanus'],
    history: [
      { id: 1, date: '2023-05-12', condition: 'Hypertension', status: 'Ongoing', doctor: 'Dr. Sarah Khan' },
      { id: 2, date: '2021-11-08', condition: 'Appendectomy', status: 'Resolved', doctor: 'Dr. Amit Shah' },
      { id: 3, date: '2019-02-14', condition: 'Type 2 Diabetes', status: 'Ongoing', doctor: 'Dr. Sarah Khan' }
    ],
    vitals: [
      { date: 'Oct', systolic: 135, diastolic: 88, heartRate: 76 },
      { date: 'Nov', systolic: 130, diastolic: 85, heartRate: 75 },
      { date: 'Dec', systolic: 128, diastolic: 82, heartRate: 72 },
      { date: 'Jan', systolic: 125, diastolic: 80, heartRate: 70 },
      { date: 'Feb', systolic: 122, diastolic: 79, heartRate: 71 },
      { date: 'Mar', systolic: 120, diastolic: 80, heartRate: 72 },
    ]
  },
  {
    id: 'PT-1002',
    name: 'Anita Sharma',
    age: 32,
    gender: 'Female',
    bloodGroup: 'A-',
    height: '162 cm',
    weight: '64 kg',
    lastVisit: '2026-03-28',
    allergies: ['Sulfa Drugs'],
    immunizations: ['COVID-19 (Booster)', 'Influenza'],
    history: [
      { id: 1, date: '2025-08-20', condition: 'Migraine', status: 'Ongoing', doctor: 'Dr. Nishant Kumar' },
      { id: 2, date: '2024-01-15', condition: 'Asthma', status: 'Ongoing', doctor: 'Dr. Amit Shah' }
    ],
    vitals: [
      { date: 'Oct', systolic: 115, diastolic: 75, heartRate: 68 },
      { date: 'Nov', systolic: 118, diastolic: 76, heartRate: 70 },
      { date: 'Dec', systolic: 112, diastolic: 72, heartRate: 65 },
      { date: 'Jan', systolic: 110, diastolic: 70, heartRate: 64 },
      { date: 'Feb', systolic: 115, diastolic: 74, heartRate: 66 },
      { date: 'Mar', systolic: 118, diastolic: 75, heartRate: 68 },
    ]
  },
  {
    id: 'PT-1003',
    name: 'Priya Das',
    age: 28,
    gender: 'Female',
    bloodGroup: 'B+',
    height: '165 cm',
    weight: '58 kg',
    lastVisit: '2026-04-01',
    allergies: ['None'],
    immunizations: ['COVID-19 (2 Doses)', 'HPV'],
    history: [
      { id: 1, date: '2026-01-10', condition: 'Anemia', status: 'Resolved', doctor: 'Dr. Sarah Khan' }
    ],
    vitals: [
      { date: 'Oct', systolic: 110, diastolic: 70, heartRate: 80 },
      { date: 'Nov', systolic: 112, diastolic: 72, heartRate: 78 },
      { date: 'Dec', systolic: 115, diastolic: 75, heartRate: 75 },
      { date: 'Jan', systolic: 118, diastolic: 76, heartRate: 72 },
      { date: 'Feb', systolic: 120, diastolic: 80, heartRate: 70 },
      { date: 'Mar', systolic: 118, diastolic: 78, heartRate: 72 },
    ]
  }
];

export function EHRView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(mockPatients[0].id);

  const filteredPatients = mockPatients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPatient = mockPatients.find(p => p.id === selectedPatientId) || mockPatients[0];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -mx-4 sm:-mx-6 md:-mx-8 -mb-4 sm:-mb-6 md:-mb-8">
      <div className="px-4 sm:px-6 md:px-8 pt-4 md:pt-6 pb-4 shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-headline tracking-tight">Electronic Health Records</h2>
            <p className="text-on-surface-variant mt-1 font-medium text-sm sm:text-base">Comprehensive patient history and vitals tracking</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
        {/* Left Sidebar: Patient List */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 h-[250px] lg:h-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {filteredPatients.map(patient => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3",
                  selectedPatientId === patient.id 
                    ? "bg-blue-50 border-blue-200 shadow-sm" 
                    : "bg-surface-container-lowest border-outline-variant/50 hover:border-blue-300 hover:bg-blue-50/50"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-on-surface truncate">{patient.name}</h4>
                  <p className="text-xs text-on-surface-variant truncate">{patient.id} • {patient.gender}, {patient.age}</p>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-colors",
                  selectedPatientId === patient.id ? "text-blue-600" : "text-on-surface-variant/50"
                )} />
              </button>
            ))}
            {filteredPatients.length === 0 && (
              <div className="text-center p-8 text-on-surface-variant text-sm">
                No patients found.
              </div>
            )}
          </div>
        </div>

        {/* Right Main Content: Patient Details */}
        <div className="flex-1 bg-surface-container-lowest rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-y-auto custom-scrollbar flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPatient.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6 md:p-8 flex flex-col gap-8"
            >
              {/* Header Profile */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-outline-variant/30 pb-8">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-on-surface font-headline">{selectedPatient.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-on-surface-variant">
                      <span className="font-mono bg-surface-container-high px-2 py-0.5 rounded-md text-on-surface font-medium">{selectedPatient.id}</span>
                      <span>{selectedPatient.gender}, {selectedPatient.age} yrs</span>
                      <span className="flex items-center gap-1"><Activity className="w-4 h-4 text-rose-500" /> Blood: {selectedPatient.bloodGroup}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold rounded-xl transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Export EHR
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Height</span>
                  </div>
                  <p className="text-xl font-bold text-on-surface">{selectedPatient.height}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Weight</span>
                  </div>
                  <p className="text-xl font-bold text-on-surface">{selectedPatient.weight}</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Latest BP</span>
                  </div>
                  <p className="text-xl font-bold text-on-surface">
                    {selectedPatient.vitals[selectedPatient.vitals.length - 1].systolic}/
                    {selectedPatient.vitals[selectedPatient.vitals.length - 1].diastolic}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Last Visit</span>
                  </div>
                  <p className="text-xl font-bold text-on-surface">{new Date(selectedPatient.lastVisit).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Vitals Chart */}
              <div className="border border-outline-variant/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-lg text-on-surface flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-blue-600" />
                    Vitals Tracking (6 Months)
                  </h4>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedPatient.vitals} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#64748b' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        domain={['dataMin - 10', 'dataMax + 10']}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Line 
                        type="monotone" 
                        name="Systolic BP"
                        dataKey="systolic" 
                        stroke="#ef4444" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        name="Diastolic BP"
                        dataKey="diastolic" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                      />
                      <Line 
                        type="monotone" 
                        name="Heart Rate"
                        dataKey="heartRate" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Grid: History & Allergies */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Medical History */}
                <div className="border border-outline-variant/30 rounded-2xl p-6">
                  <h4 className="font-bold text-lg text-on-surface flex items-center gap-2 mb-6">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    Medical History
                  </h4>
                  <div className="space-y-4">
                    {selectedPatient.history.map((record) => (
                      <div key={record.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5" />
                          <div className="w-px h-full bg-outline-variant/50 my-1" />
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-bold text-on-surface">{record.condition}</h5>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                              record.status === 'Ongoing' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                            )}>
                              {record.status}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant font-medium mb-1">Diagnosed: {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1"><User className="w-3 h-3" /> {record.doctor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergies & Immunizations */}
                <div className="space-y-6">
                  <div className="border border-outline-variant/30 rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-on-surface flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                      Allergies
                    </h4>
                    {selectedPatient.allergies[0] === 'None' ? (
                      <p className="text-sm text-on-surface-variant italic">No known allergies.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, i) => (
                          <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-bold border border-rose-100">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border border-outline-variant/30 rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-on-surface flex items-center gap-2 mb-4">
                      <Syringe className="w-5 h-5 text-emerald-600" />
                      Immunizations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.immunizations.map((imm, i) => (
                        <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100">
                          {imm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
