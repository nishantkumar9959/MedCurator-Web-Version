import React, { useMemo } from 'react';

interface RevenueItem {
  label: string;
  value: number;
}

interface RevenueChartProps {
  data: RevenueItem[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = useMemo(() => Math.max(...data.map(item => item.value)), [data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col">
      <div className="mb-8">
        <h4 className="font-headline text-xl font-bold text-on-surface">Department Revenue</h4>
        <p className="text-xs text-on-surface-variant mt-1">Current Quarter Performance</p>
      </div>
      
      <div className="space-y-7 flex-grow">
        {data.map((item) => {
          const percentage = (item.value / maxRevenue) * 100;
          return (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-2.5">
                <span className="font-bold text-on-surface tracking-tight">{item.label}</span>
                <span className="font-black text-primary">{formatCurrency(item.value)}</span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,63,135,0.2)]" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-10 pt-6 border-t border-outline-variant/20 text-center">
        <button className="text-primary font-bold text-sm hover:underline transition-all">
          View Detailed Financials
        </button>
      </div>
    </div>
  );
}
