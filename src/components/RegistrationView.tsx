import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, User, Phone, Mail, MapPin, Calendar, Activity, CheckCircle, Plus, Loader2 } from 'lucide-react';
import { TabType } from './Sidebar';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface RegistrationViewProps {
  setActiveTab: (tab: TabType) => void;
  setTriggerNewAppointment: (patientName: string | null) => void;
}

export function RegistrationView({ setActiveTab, setTriggerNewAppointment }: RegistrationViewProps) {
  const initialFormState = {
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    address: '',
    phone: '',
    email: '',
    bloodGroup: 'A+',
    weight: '',
    chiefComplaint: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePatient = async () => {
    if (!formData.firstName || !formData.lastName) {
      alert('Please enter at least first and last name');
      return;
    }

    setIsSaving(true);
    
    try {
      await addDoc(collection(db, 'patients'), {
        ...formData,
        registrationDate: new Date().toISOString(),
        status: 'Active'
      });
      
      setIsSaved(true);
      setFormData(initialFormState); // Clear form on success
      alert('Patient registered successfully!');
    } catch (error) {
      // If the error is a permission error, we use our unified handler
      if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
        alert('Permission Denied: You do not have access to save patients. Please update your Firestore Security Rules in the Firebase Console.');
        handleFirestoreError(error, OperationType.CREATE, 'patients');
      } else {
        console.error('Error saving patient:', error);
        alert('Failed to save patient. Please check the console for details.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAppointment = () => {
    // Note: Since we clear the form on success, we might want to store the last saved name
    // if we want to pre-fill the appointment modal. For now, we'll just open it.
    setTriggerNewAppointment("New Patient"); 
    setActiveTab('Appointments');
    setIsSaved(false); // Reset saved state when leaving
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
      >
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Patient Registration</h2>
          <p className="text-on-surface-variant mt-1 text-sm sm:text-base">Register new patients into the clinical system.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <AnimatePresence mode="wait">
            {isSaved ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm w-full sm:w-auto justify-center">
                  <CheckCircle className="w-4 h-4" />
                  Patient Registered
                </div>
                <button 
                  onClick={handleAddAppointment}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Appointment
                </button>
              </motion.div>
            ) : (
              <button 
                onClick={handleSavePatient}
                disabled={isSaving}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Saving...' : 'Save Patient'}
              </button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] space-y-6">
          <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">First Name</label>
              <input 
                className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                placeholder="e.g. Rajesh" 
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Last Name</label>
              <input 
                className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                placeholder="e.g. Kumar" 
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Gender</label>
              <select 
                className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                disabled={isSaving}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea 
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 h-24" 
                placeholder="Full residential address..." 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Chief Complaint / Reason for Visit</label>
            <div className="relative">
              <Activity className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea 
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 h-24" 
                placeholder="Describe the reason for visit..." 
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        {/* Contact & Medical */}
        <div className="space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Contact Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                    placeholder="+91 98765 43210" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                    placeholder="rajesh@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Vital Info
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Blood Group</label>
                <select 
                  className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  disabled={isSaving}
                >
                  <option>A+</option>
                  <option>B+</option>
                  <option>O+</option>
                  <option>AB+</option>
                  <option>A-</option>
                  <option>B-</option>
                  <option>O-</option>
                  <option>AB-</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Weight (kg)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                  placeholder="70" 
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
