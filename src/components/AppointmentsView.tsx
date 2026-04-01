import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Plus, Clock, User, UserCheck, Video, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth } from '../firebase';
import { Appointment } from '../App';

interface AppointmentsViewProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  triggerNewAppointment: string | null;
  setTriggerNewAppointment: (val: string | null) => void;
}

type FilterType = 'All Appointments' | 'Confirmed' | 'Pending' | 'Tele-health';

export function AppointmentsView({ 
  appointments, 
  setAppointments, 
  triggerNewAppointment, 
  setTriggerNewAppointment
}: AppointmentsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All Appointments');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const currentUser = auth.currentUser;
  const defaultDoctorName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Dr. Nishant Kumar";

  // Form state for new appointment
  const [newAppt, setNewAppt] = useState({
    patient: '',
    doctor: defaultDoctorName,
    time: '10:00 AM',
    date: new Date().toISOString().split('T')[0],
    type: 'In-Person' as 'In-Person' | 'Tele-health'
  });

  useEffect(() => {
    if (triggerNewAppointment) {
      setNewAppt(prev => ({ ...prev, patient: triggerNewAppointment }));
      setIsModalOpen(true);
      setTriggerNewAppointment(null);
    }
  }, [triggerNewAppointment, setTriggerNewAppointment]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesDate = apt.date === selectedDate;
      const matchesFilter = 
        activeFilter === 'All Appointments' ||
        (activeFilter === 'Confirmed' && apt.status === 'Confirmed') ||
        (activeFilter === 'Pending' && apt.status === 'Pending') ||
        (activeFilter === 'Tele-health' && apt.type === 'Tele-health');
      
      return matchesDate && matchesFilter;
    });
  }, [appointments, selectedDate, activeFilter]);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `APT-${Math.floor(Math.random() * 1000)}`;
    const appointment: Appointment = {
      ...newAppt,
      id,
      status: 'Confirmed'
    };
    setAppointments(prev => [...prev, appointment]);
    setIsModalOpen(false);
    // Reset form
    setNewAppt({
      patient: '',
      doctor: defaultDoctorName,
      time: '10:00 AM',
      date: new Date().toISOString().split('T')[0],
      type: 'In-Person'
    });
  };

  // Calendar logic
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));

  const calendarDays = useMemo(() => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const startDay = firstDayOfMonth(currentMonth);

    // Padding for start of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  }, [currentMonth]);

  const isSelected = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day + 1).toISOString().split('T')[0];
    return dateStr === selectedDate;
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Adjust for timezone to get correct YYYY-MM-DD
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    setSelectedDate(adjustedDate.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
      >
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Appointments</h2>
          <p className="text-on-surface-variant mt-1 text-sm sm:text-base">Manage and schedule patient appointments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <h3 className="font-headline font-bold text-on-surface">{monthName} {year}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-surface-container-high rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={handleNextMonth} className="p-1 hover:bg-surface-container-high rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-on-surface-variant mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarDays.map((day, i) => (
                <div 
                  key={i} 
                  onClick={() => day && handleDateClick(day)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-[11px]",
                    !day ? "invisible" : "cursor-pointer",
                    day && isSelected(day) ? "bg-blue-600 text-white font-bold" : "hover:bg-surface-container-high text-on-surface"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)]">
            <h3 className="font-headline font-bold text-on-surface mb-4">Quick Filters</h3>
            <div className="space-y-1">
              {(['All Appointments', 'Confirmed', 'Pending', 'Tele-health'] as FilterType[]).map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-lg font-bold text-xs transition-all",
                    activeFilter === filter 
                      ? "bg-blue-50 text-blue-700 shadow-sm" 
                      : "hover:bg-surface-container-high text-on-surface-variant"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-headline font-bold text-on-surface">
              Appointments for {new Date(selectedDate).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <span className="text-xs text-on-surface-variant font-medium">{filteredAppointments.length} Found</span>
          </div>
          
          <AnimatePresence mode="popLayout">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={apt.id} 
                  className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      {apt.type === 'Tele-health' ? <Video className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-headline font-bold text-on-surface">{apt.patient}</h4>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                          apt.status === 'Confirmed' ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"
                        )}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {apt.doctor}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Reschedule</button>
                    <button className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">Cancel</button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface-container-lowest/50 border-2 border-dashed border-surface-container-high p-12 rounded-xl text-center"
              >
                <CalendarIcon className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
                <p className="text-on-surface-variant font-medium">No appointments scheduled for this date.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                >
                  Schedule one now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-surface-container-high flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline text-xl font-bold text-on-surface">New Appointment</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              
              <form onSubmit={handleCreateAppointment} className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Select Patient</label>
                  <input 
                    required
                    className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                    placeholder="Search or enter patient name" 
                    value={newAppt.patient}
                    onChange={(e) => setNewAppt({ ...newAppt, patient: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Select Doctor</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                      value={newAppt.doctor}
                      onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}
                    >
                      <option>{defaultDoctorName}</option>
                      <option>Dr. Sarah Khan</option>
                      <option>Dr. Amit Shah</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Type</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                      value={newAppt.type}
                      onChange={(e) => setNewAppt({ ...newAppt, type: e.target.value as any })}
                    >
                      <option>In-Person</option>
                      <option>Tele-health</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</label>
                    <input 
                      type="date"
                      required
                      className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                      value={newAppt.date}
                      onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Time</label>
                    <input 
                      type="time"
                      required
                      className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                      onChange={(e) => {
                        // Convert 24h to 12h for display consistency
                        const [h, m] = e.target.value.split(':');
                        const hh = parseInt(h);
                        const suffix = hh >= 12 ? 'PM' : 'AM';
                        const h12 = hh % 12 || 12;
                        setNewAppt({ ...newAppt, time: `${h12}:${m} ${suffix}` });
                      }}
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:flex-1 px-6 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="w-full sm:flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Schedule Appointment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
