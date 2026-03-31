import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Camera,
  Save,
  Edit2,
  Moon,
  Check,
  Sun,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export function SettingsView() {
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    displayName: "Dr. Nishant Kumar",
    email: "nishant.k@medcurator.com",
    photoURL: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
    specialization: "Chief Medical Officer",
    phoneNumber: "+91 98765 43210",
    hospitalName: "City General Hospital",
    registrationId: "HOSP-2026-001",
    address: "123 Healthcare Avenue, Medical District, New Delhi, 110001"
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize dark mode from document class
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  // Fetch profile from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(prev => ({ ...prev, ...docSnap.data() }));
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${auth.currentUser?.uid}`);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    desktop: true
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, {
        ...profile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setIsEditing(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photoURL: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading && !isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
      >
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Settings</h2>
          <p className="text-on-surface-variant mt-1 text-sm sm:text-base">Manage your account and system preferences.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <AnimatePresence mode="wait">
            {showSaveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm"
              >
                <Check className="w-4 h-4" />
                Changes Saved
              </motion.div>
            )}
          </AnimatePresence>
          
          {isEditing ? (
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-surface-container-high text-on-surface font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="xl:col-span-2 space-y-8">
          <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-xl text-on-surface">Profile Information</h3>
              </div>
              {!isEditing && (
                <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full uppercase tracking-wider">Read Only</span>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-surface-container-high shadow-inner">
                  <img 
                    src={profile.photoURL} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {isEditing && (
                  <>
                    <button 
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </>
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    name="displayName"
                    disabled={!isEditing}
                    value={profile.displayName}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-on-surface font-medium",
                      isEditing ? "bg-surface-container-low" : "bg-transparent cursor-not-allowed opacity-80"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    disabled={!isEditing}
                    value={profile.email}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-on-surface font-medium",
                      isEditing ? "bg-surface-container-low" : "bg-transparent cursor-not-allowed opacity-80"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Specialization</label>
                  <input 
                    type="text" 
                    name="specialization"
                    disabled={!isEditing}
                    value={profile.specialization}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-on-surface font-medium",
                      isEditing ? "bg-surface-container-low" : "bg-transparent cursor-not-allowed opacity-80"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    disabled={!isEditing}
                    value={profile.phoneNumber}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-on-surface font-medium",
                      isEditing ? "bg-surface-container-low" : "bg-transparent cursor-not-allowed opacity-80"
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface">Hospital Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Hospital Name</label>
                <input 
                  type="text" 
                  name="hospitalName"
                  disabled={!isEditing}
                  value={profile.hospitalName}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-on-surface font-medium",
                    isEditing ? "bg-surface-container-low" : "bg-transparent cursor-not-allowed opacity-80"
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Registration ID</label>
                <input 
                  type="text" 
                  name="registrationId"
                  disabled={!isEditing}
                  value={profile.registrationId}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-on-surface font-medium",
                    isEditing ? "bg-surface-container-low" : "bg-transparent cursor-not-allowed opacity-80"
                  )}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Address</label>
                <textarea 
                  rows={3}
                  name="address"
                  disabled={!isEditing}
                  value={profile.address}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-on-surface font-medium resize-none",
                    isEditing ? "bg-surface-container-low" : "bg-transparent cursor-not-allowed opacity-80"
                  )}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface">Appearance</h3>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-bold text-on-surface">Dark Mode</p>
                <p className="text-xs text-on-surface-variant">Switch between light and dark themes</p>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={cn(
                  "relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center px-1",
                  isDarkMode ? "bg-blue-600" : "bg-slate-200"
                )}
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                  animate={{ x: isDarkMode ? 24 : 0 }}
                >
                  {isDarkMode ? (
                    <Moon className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-orange-500" />
                  )}
                </motion.div>
              </button>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface">Notifications</h3>
            </div>

            <div className="space-y-4">
              {[
                { id: 'email' as const, label: 'Email Alerts', desc: 'Receive daily summary reports' },
                { id: 'sms' as const, label: 'SMS Notifications', desc: 'Critical patient alerts' },
                { id: 'desktop' as const, label: 'Desktop Notifications', desc: 'Real-time appointment updates' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{item.label}</p>
                    <p className="text-xs text-on-surface-variant">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleNotification(item.id)}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors duration-300 flex items-center px-0.5",
                      notifications[item.id] ? "bg-blue-600" : "bg-surface-container-high"
                    )}
                  >
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{ x: notifications[item.id] ? 20 : 0 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface">Security</h3>
            </div>

            <div className="space-y-4">
              <button className="w-full px-4 py-3 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-xl text-left flex items-center justify-between group">
                <div>
                  <p className="text-sm font-bold text-on-surface">Change Password</p>
                  <p className="text-xs text-on-surface-variant">Last changed 3 months ago</p>
                </div>
                <Globe className="w-4 h-4 text-on-surface-variant group-hover:text-blue-600 transition-colors" />
              </button>
              <button className="w-full px-4 py-3 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-xl text-left flex items-center justify-between group">
                <div>
                  <p className="text-sm font-bold text-on-surface">Two-Factor Auth</p>
                  <p className="text-xs text-emerald-600 font-bold">Enabled</p>
                </div>
                <Shield className="w-4 h-4 text-on-surface-variant group-hover:text-blue-600 transition-colors" />
              </button>
            </div>
          </section>

          <div className="p-6 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-headline font-bold text-lg mb-2">Need Help?</h4>
              <p className="text-sm text-blue-100 mb-4 opacity-90">Contact our support team for any technical assistance.</p>
              <button className="w-full py-2.5 bg-white text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 transform scale-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
