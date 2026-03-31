import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, Plus, Search, AlertCircle, Package, Layers, X, Trash2, Save, Minus } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  category: string;
}

const initialMedications: Medication[] = [
  { id: 'MED-001', name: 'Paracetamol', dosage: '500mg', stock: 120, category: 'Analgesic' },
  { id: 'MED-002', name: 'Amoxicillin', dosage: '250mg', stock: 15, category: 'Antibiotic' },
  { id: 'MED-003', name: 'Ibuprofen', dosage: '200mg', stock: 85, category: 'Analgesic' },
  { id: 'MED-004', name: 'Lisinopril', dosage: '10mg', stock: 0, category: 'Antihypertensive' },
  { id: 'MED-005', name: 'Metformin', dosage: '500mg', stock: 210, category: 'Antidiabetic' },
  { id: 'MED-006', name: 'Atorvastatin', dosage: '20mg', stock: 45, category: 'Statins' },
  { id: 'MED-007', name: 'Amlodipine', dosage: '5mg', stock: 12, category: 'Antihypertensive' },
];

export function PharmacyView() {
  const [inventory, setInventory] = useState<Medication[]>(initialMedications);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);

  // New Medication Form State
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    category: '',
    stock: 0
  });

  // Dynamic Stats
  const stats = useMemo(() => {
    const totalItems = inventory.length;
    const lowStock = inventory.filter(m => m.stock > 0 && m.stock <= 20).length;
    const categories = new Set(inventory.map(m => m.category)).size;
    return { totalItems, lowStock, categories };
  }, [inventory]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(med => 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const getStatusBadge = (stock: number) => {
    if (stock > 20) return { label: 'IN STOCK', class: 'bg-emerald-50 text-emerald-700' };
    if (stock > 0) return { label: 'LOW STOCK', class: 'bg-orange-50 text-orange-700' };
    return { label: 'OUT OF STOCK', class: 'bg-red-50 text-red-700' };
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `MED-${String(inventory.length + 1).padStart(3, '0')}`;
    setInventory([...inventory, { ...newMed, id }]);
    setIsAddModalOpen(false);
    setNewMed({ name: '', dosage: '', category: '', stock: 0 });
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setInventory(inventory.map(m => m.id === id ? { ...m, stock: Math.max(0, newStock) } : m));
    if (selectedMed?.id === id) {
      setSelectedMed({ ...selectedMed, stock: Math.max(0, newStock) });
    }
  };

  const handleDeleteMedication = (id: string) => {
    setInventory(inventory.filter(m => m.id !== id));
    setIsManageModalOpen(false);
    setSelectedMed(null);
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Pharmacy</h2>
          <p className="text-on-surface-variant mt-1">Manage medication inventory and prescriptions.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Medication
        </button>
      </motion.div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-4 border border-outline-variant/30">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Items</p>
            <h3 className="text-2xl font-headline font-extrabold text-on-surface">{stats.totalItems}</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-4 border border-outline-variant/30">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Low Stock</p>
            <h3 className="text-2xl font-headline font-extrabold text-on-surface">{stats.lowStock}</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-4 border border-outline-variant/30">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Categories</p>
            <h3 className="text-2xl font-headline font-extrabold text-on-surface">{stats.categories}</h3>
          </div>
        </div>
      </div>

      {/* Medication List */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] overflow-hidden border border-outline-variant/30">
        <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h4 className="font-headline text-xl font-bold text-on-surface">Inventory List</h4>
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-on-surface" 
              placeholder="Search medications..." 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-body text-xs uppercase tracking-widest">
                <th className="px-8 py-4 font-semibold">Medication Name</th>
                <th className="px-8 py-4 font-semibold">Dosage</th>
                <th className="px-8 py-4 font-semibold">Stock</th>
                <th className="px-8 py-4 font-semibold">Category</th>
                <th className="px-8 py-4 font-semibold">Status</th>
                <th className="px-8 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <AnimatePresence mode="popLayout">
                {filteredInventory.map((med) => {
                  const badge = getStatusBadge(med.stock);
                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={med.id} 
                      className="hover:bg-surface-container-high transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="font-bold text-on-surface">{med.name}</div>
                        <div className="text-[10px] font-mono text-on-surface-variant">ID: #{med.id}</div>
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant">{med.dosage}</td>
                      <td className="px-8 py-5 text-sm font-bold text-on-surface">{med.stock}</td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant">{med.category}</td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          badge.class
                        )}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => {
                            setSelectedMed(med);
                            setIsManageModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider transition-colors px-4 py-2 hover:bg-blue-50 rounded-lg"
                        >
                          Manage
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredInventory.length === 0 && (
            <div className="p-12 text-center text-on-surface-variant">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No medications found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Medication Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30"
            >
              <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline font-bold text-on-surface">Add New Medication</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              <form onSubmit={handleAddMedication} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Medication Name</label>
                  <input 
                    required
                    className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-on-surface" 
                    placeholder="e.g. Aspirin"
                    value={newMed.name}
                    onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Dosage</label>
                    <input 
                      required
                      className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-on-surface" 
                      placeholder="e.g. 100mg"
                      value={newMed.dosage}
                      onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Initial Stock</label>
                    <input 
                      required
                      type="number"
                      className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-on-surface" 
                      value={newMed.stock}
                      onChange={(e) => setNewMed({...newMed, stock: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-on-surface appearance-none"
                    value={newMed.category}
                    onChange={(e) => setNewMed({...newMed, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Antihypertensive">Antihypertensive</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Statins">Statins</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all mt-4"
                >
                  Save Medication
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Medication Modal */}
      <AnimatePresence>
        {isManageModalOpen && selectedMed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManageModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30"
            >
              <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
                <div>
                  <h3 className="font-headline font-bold text-on-surface">Manage {selectedMed.name}</h3>
                  <p className="text-[10px] text-on-surface-variant font-mono">ID: #{selectedMed.id}</p>
                </div>
                <button onClick={() => setIsManageModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              <div className="p-6 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Adjust Stock Levels</label>
                  <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl">
                    <button 
                      onClick={() => handleUpdateStock(selectedMed.id, selectedMed.stock - 1)}
                      className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-outline-variant/20 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                      <span className="text-3xl font-headline font-black text-on-surface">{selectedMed.stock}</span>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Units</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateStock(selectedMed.id, selectedMed.stock + 1)}
                      className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleUpdateStock(selectedMed.id, selectedMed.stock + 50)}
                      className="py-2.5 bg-surface-container-high text-on-surface font-bold text-xs rounded-xl hover:bg-surface-container-highest transition-all"
                    >
                      +50 Units
                    </button>
                    <button 
                      onClick={() => handleUpdateStock(selectedMed.id, selectedMed.stock - 50)}
                      className="py-2.5 bg-surface-container-high text-on-surface font-bold text-xs rounded-xl hover:bg-surface-container-highest transition-all"
                    >
                      -50 Units
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/20 flex flex-col gap-3">
                  <button 
                    onClick={() => setIsManageModalOpen(false)}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button 
                    onClick={() => handleDeleteMedication(selectedMed.id)}
                    className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove from Inventory
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
