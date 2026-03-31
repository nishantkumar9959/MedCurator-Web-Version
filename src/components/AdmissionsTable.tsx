import React, { useMemo } from 'react';
import { cn } from '@/src/lib/utils';
import { Search, ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';

interface Admission {
  id: string;
  name: string;
  dept: string;
  status: 'STABLE' | 'CRITICAL';
  time: string;
}

interface AdmissionsTableProps {
  data: Admission[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

export function AdmissionsTable({ data, searchQuery, onSearchChange, isLoading }: AdmissionsTableProps) {
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Admission; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof Admission) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedAdmissions = useMemo(() => {
    let result = [...data].filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortConfig]);

  const SortIndicator = ({ column }: { column: keyof Admission }) => {
    if (!sortConfig || sortConfig.key !== column) return <div className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-30"><ChevronUp className="w-3 h-3" /></div>;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-primary" /> : <ChevronDown className="w-3 h-3 ml-1 text-primary" />;
  };

  return (
    <div className="mt-8 bg-surface-container-lowest rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] overflow-hidden border border-outline-variant/30">
      <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-headline text-xl font-bold text-on-surface">Recent Patient Admissions</h4>
          <p className="text-xs text-on-surface-variant mt-1">Real-time monitoring of new arrivals</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant transition-colors group-focus-within:text-primary" />
          <input 
            className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none text-on-surface placeholder:text-on-surface-variant/50" 
            placeholder="Search by name, ID or department..." 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low/50 text-on-surface-variant font-body text-[10px] uppercase tracking-[0.15em] font-black">
              <th 
                className="px-8 py-5 cursor-pointer hover:text-primary transition-colors select-none group"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Patient Name <SortIndicator column="name" />
                </div>
              </th>
              <th 
                className="px-8 py-5 cursor-pointer hover:text-primary transition-colors select-none group"
                onClick={() => handleSort('dept')}
              >
                <div className="flex items-center">
                  Department <SortIndicator column="dept" />
                </div>
              </th>
              <th 
                className="px-8 py-5 cursor-pointer hover:text-primary transition-colors select-none group"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status <SortIndicator column="status" />
                </div>
              </th>
              <th 
                className="px-8 py-5 cursor-pointer hover:text-primary transition-colors select-none group"
                onClick={() => handleSort('time')}
              >
                <div className="flex items-center">
                  Time <SortIndicator column="time" />
                </div>
              </th>
              <th className="px-8 py-5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center animate-pulse">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-on-surface-variant font-medium text-sm italic">
                      Loading patients...
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredAndSortedAdmissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                      <Search className="w-6 h-6 text-on-surface-variant/30" />
                    </div>
                    <p className="text-on-surface-variant font-medium text-sm italic">
                      No admissions found matching "{searchQuery}"
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedAdmissions.map((patient) => (
                <tr key={patient.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-on-surface group-hover:text-primary transition-colors">{patient.name}</div>
                    <div className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase opacity-60">ID: #{patient.id}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-on-surface-variant">{patient.dept}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm",
                      patient.status === 'STABLE' 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-error-container/20 text-error border border-error/20"
                    )}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-on-surface-variant/80">{patient.time}</td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => alert(`Viewing details for ${patient.name} (${patient.id})`)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
