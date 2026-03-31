import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Plus, Search, FileText, CheckCircle, Clock, X, Trash2, Save, IndianRupee, ChevronDown, Eye, Receipt } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LineItem {
  description: string;
  quantity: number;
  price: number;
}

interface Invoice {
  id: string;
  patientName: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Draft';
  paymentMethod: string;
  lineItems: LineItem[];
}

const initialInvoices: Invoice[] = [
  { 
    id: 'INV-2026-001', 
    patientName: 'Rajesh Kumar', 
    date: '2026-04-19', 
    status: 'Paid', 
    paymentMethod: 'Credit Card',
    lineItems: [
      { description: 'General Consultation', quantity: 1, price: 500 },
      { description: 'Blood Test (CBC)', quantity: 1, price: 1200 },
      { description: 'X-Ray Chest', quantity: 1, price: 10800 },
    ]
  },
  { 
    id: 'INV-2026-002', 
    patientName: 'Anita Sharma', 
    date: '2026-04-18', 
    status: 'Pending', 
    paymentMethod: '-',
    lineItems: [
      { description: 'Dental Cleaning', quantity: 1, price: 2500 },
      { description: 'Fillings', quantity: 2, price: 2950 },
    ]
  },
  { 
    id: 'INV-2026-003', 
    patientName: 'Priya Das', 
    date: '2026-04-17', 
    status: 'Paid', 
    paymentMethod: 'Cash',
    lineItems: [
      { description: 'Physiotherapy Session', quantity: 3, price: 1400 },
    ]
  },
  { 
    id: 'INV-2026-004', 
    patientName: 'Suresh Raina', 
    date: '2026-04-16', 
    status: 'Pending', 
    paymentMethod: '-',
    lineItems: [
      { description: 'Specialist Consultation', quantity: 1, price: 1500 },
      { description: 'MRI Scan', quantity: 1, price: 14100 },
    ]
  },
  { 
    id: 'INV-2026-005', 
    patientName: 'Meera Bai', 
    date: '2026-04-15', 
    status: 'Draft', 
    paymentMethod: '-',
    lineItems: [
      { description: 'Follow-up Visit', quantity: 1, price: 300 },
      { description: 'Medication - Course A', quantity: 1, price: 1800 },
    ]
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateTotal = (lineItems: LineItem[]) => {
  return lineItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
};

export function BillingView() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Draft'>('All');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Create Invoice Form State
  const [newInvoice, setNewInvoice] = useState({
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending' as 'Pending' | 'Draft',
    lineItems: [{ description: '', quantity: 1, price: 0 }]
  });

  // Stats Calculation
  const stats = useMemo(() => {
    const totalCollected = invoices
      .filter(inv => inv.status === 'Paid')
      .reduce((acc, inv) => acc + calculateTotal(inv.lineItems), 0);
    
    const pendingAmount = invoices
      .filter(inv => inv.status === 'Pending')
      .reduce((acc, inv) => acc + calculateTotal(inv.lineItems), 0);
    
    const draftCount = invoices.filter(inv => inv.status === 'Draft').length;

    return { totalCollected, pendingAmount, draftCount };
  }, [invoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           inv.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const handleAddLineItem = () => {
    setNewInvoice({
      ...newInvoice,
      lineItems: [...newInvoice.lineItems, { description: '', quantity: 1, price: 0 }]
    });
  };

  const handleRemoveLineItem = (index: number) => {
    const updatedItems = newInvoice.lineItems.filter((_, i) => i !== index);
    setNewInvoice({ ...newInvoice, lineItems: updatedItems });
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedItems = [...newInvoice.lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewInvoice({ ...newInvoice, lineItems: updatedItems });
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;
    const invoiceToAdd: Invoice = {
      id,
      patientName: newInvoice.patientName,
      date: newInvoice.date,
      status: newInvoice.status,
      paymentMethod: '-',
      lineItems: newInvoice.lineItems
    };
    setInvoices([invoiceToAdd, ...invoices]);
    setIsCreateModalOpen(false);
    setNewInvoice({
      patientName: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      lineItems: [{ description: '', quantity: 1, price: 0 }]
    });
  };

  const handleRecordPayment = (paymentMethod: string) => {
    if (!selectedInvoice) return;
    setInvoices(invoices.map(inv => 
      inv.id === selectedInvoice.id 
        ? { ...inv, status: 'Paid', paymentMethod } 
        : inv
    ));
    setIsRecordPaymentModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Billing & Invoices</h2>
          <p className="text-on-surface-variant mt-1">Manage patient billing, payments, and financial records.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </motion.div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-4 border border-outline-variant/30">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Collected</p>
            <h3 className="text-2xl font-headline font-extrabold text-on-surface">{formatCurrency(stats.totalCollected)}</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-4 border border-outline-variant/30">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pending Amount</p>
            <h3 className="text-2xl font-headline font-extrabold text-on-surface">{formatCurrency(stats.pendingAmount)}</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-4 border border-outline-variant/30">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Draft Invoices</p>
            <h3 className="text-2xl font-headline font-extrabold text-on-surface">{stats.draftCount}</h3>
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] overflow-hidden border border-outline-variant/30">
        <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h4 className="font-headline text-xl font-bold text-on-surface">Invoice History</h4>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-on-surface" 
                placeholder="Search invoices..." 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select 
                className="appearance-none w-full md:w-40 pl-4 pr-10 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-on-surface cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Draft">Draft</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-body text-xs uppercase tracking-widest">
                <th className="px-8 py-4 font-semibold">Invoice ID</th>
                <th className="px-8 py-4 font-semibold">Patient</th>
                <th className="px-8 py-4 font-semibold">Amount</th>
                <th className="px-8 py-4 font-semibold">Date</th>
                <th className="px-8 py-4 font-semibold">Status</th>
                <th className="px-8 py-4 font-semibold">Method</th>
                <th className="px-8 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <AnimatePresence mode="popLayout">
                {filteredInvoices.map((inv) => {
                  const total = calculateTotal(inv.lineItems);
                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={inv.id} 
                      className="hover:bg-surface-container-high transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="font-bold text-on-surface">{inv.id}</div>
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant">{inv.patientName}</td>
                      <td className="px-8 py-5 text-sm font-bold text-on-surface">{formatCurrency(total)}</td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant">{inv.date}</td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          inv.status === 'Paid' ? "bg-emerald-50 text-emerald-700" : 
                          inv.status === 'Pending' ? "bg-orange-50 text-orange-700" : "bg-slate-100 text-slate-600"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant">{inv.paymentMethod}</td>
                      <td className="px-8 py-5 text-right">
                        {inv.status === 'Pending' ? (
                          <button 
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsRecordPaymentModalOpen(true);
                            }}
                            className="bg-blue-600 text-white hover:bg-blue-700 font-bold text-[10px] uppercase tracking-widest transition-all px-4 py-2 rounded-lg shadow-sm"
                          >
                            Record Payment
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsViewModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider transition-colors px-4 py-2 hover:bg-blue-50 rounded-lg"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredInvoices.length === 0 && (
            <div className="p-12 text-center text-on-surface-variant">
              <Receipt className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No invoices found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30"
            >
              <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline font-bold text-on-surface">Create New Invoice</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              <form onSubmit={handleCreateInvoice} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Patient Name</label>
                    <input 
                      required
                      className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-on-surface" 
                      placeholder="e.g. Rajesh Kumar"
                      value={newInvoice.patientName}
                      onChange={(e) => setNewInvoice({...newInvoice, patientName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Invoice Date</label>
                    <input 
                      required
                      type="date"
                      className="w-full px-4 py-2.5 bg-surface-container-low border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-on-surface" 
                      value={newInvoice.date}
                      onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Line Items</label>
                    <button 
                      type="button"
                      onClick={handleAddLineItem}
                      className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {newInvoice.lineItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-end bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
                        <div className="col-span-6 space-y-1">
                          <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Description</label>
                          <input 
                            required
                            className="w-full px-3 py-2 bg-surface-container-lowest border-none rounded-lg outline-none text-sm text-on-surface"
                            placeholder="Service/Product"
                            value={item.description}
                            onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Qty</label>
                          <input 
                            required
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 bg-surface-container-lowest border-none rounded-lg outline-none text-sm text-on-surface"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-3 space-y-1">
                          <label className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Price (₹)</label>
                          <input 
                            required
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 bg-surface-container-lowest border-none rounded-lg outline-none text-sm text-on-surface"
                            value={item.price}
                            onChange={(e) => handleLineItemChange(index, 'price', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-1 flex justify-center pb-2">
                          <button 
                            type="button"
                            onClick={() => handleRemoveLineItem(index)}
                            disabled={newInvoice.lineItems.length === 1}
                            className="text-red-400 hover:text-red-600 disabled:opacity-30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Amount</p>
                    <h4 className="text-2xl font-headline font-black text-on-surface">{formatCurrency(calculateTotal(newInvoice.lineItems))}</h4>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => {
                        setNewInvoice({...newInvoice, status: 'Draft'});
                        // Trigger submit manually or just use a flag
                      }}
                      className="px-6 py-2.5 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all"
                    >
                      Save as Draft
                    </button>
                    <button 
                      type="submit"
                      onClick={() => setNewInvoice({...newInvoice, status: 'Pending'})}
                      className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Create Invoice
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Invoice Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30"
            >
              <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
                <div>
                  <h3 className="font-headline font-bold text-on-surface">Invoice Details</h3>
                  <p className="text-[10px] text-on-surface-variant font-mono uppercase tracking-widest">{selectedInvoice.id}</p>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Patient</p>
                    <p className="font-bold text-on-surface">{selectedInvoice.patientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date</p>
                    <p className="font-bold text-on-surface">{selectedInvoice.date}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Itemized Breakdown</p>
                  <div className="bg-surface-container-low rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface-container-high text-[10px] text-on-surface-variant uppercase tracking-widest">
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-center">Qty</th>
                          <th className="px-4 py-2 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {selectedInvoice.lineItems.map((item, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3 text-on-surface">{item.description}</td>
                            <td className="px-4 py-3 text-center text-on-surface-variant">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-on-surface font-medium">{formatCurrency(item.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</p>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      selectedInvoice.status === 'Paid' ? "bg-emerald-50 text-emerald-700" : 
                      selectedInvoice.status === 'Pending' ? "bg-orange-50 text-orange-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Grand Total</p>
                    <p className="text-2xl font-headline font-black text-on-surface">{formatCurrency(calculateTotal(selectedInvoice.lineItems))}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Record Payment Modal */}
      <AnimatePresence>
        {isRecordPaymentModalOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRecordPaymentModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30"
            >
              <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline font-bold text-on-surface">Record Payment</h3>
                <button onClick={() => setIsRecordPaymentModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount Due</p>
                  <h4 className="text-3xl font-headline font-black text-on-surface">{formatCurrency(calculateTotal(selectedInvoice.lineItems))}</h4>
                  <p className="text-sm text-on-surface-variant">Patient: {selectedInvoice.patientName}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Select Payment Method</p>
                  <div className="grid grid-cols-2 gap-3">
                    {['Cash', 'Credit Card', 'UPI', 'Net Banking'].map((method) => (
                      <button 
                        key={method}
                        onClick={() => handleRecordPayment(method)}
                        className="p-4 bg-surface-container-low hover:bg-blue-50 hover:text-blue-600 border border-outline-variant/10 rounded-xl transition-all flex flex-col items-center gap-2 group"
                      >
                        <CreditCard className="w-6 h-6 text-on-surface-variant group-hover:text-blue-600" />
                        <span className="text-xs font-bold">{method}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
