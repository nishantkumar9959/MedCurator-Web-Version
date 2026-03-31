import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/src/lib/utils';

interface InflowChartProps {
  data: { name: string; value: number }[];
  activeView: 'Weekly' | 'Monthly';
  onViewChange: (view: 'Weekly' | 'Monthly') => void;
}

export function InflowChart({ data, activeView, onViewChange }: InflowChartProps) {
  return (
    <div className="lg:col-span-2 bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
        <div>
          <h4 className="font-headline text-xl font-bold text-on-surface">Daily Patient Inflow</h4>
          <p className="text-xs text-on-surface-variant mt-1">Patient volume trends</p>
        </div>
        <div className="flex bg-surface-container-high p-1 rounded-xl w-full sm:w-auto">
          <button 
            onClick={() => onViewChange('Weekly')}
            className={cn(
              "flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
              activeView === 'Weekly' 
                ? "bg-surface-container-lowest text-primary shadow-sm" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Weekly
          </button>
          <button 
            onClick={() => onViewChange('Monthly')}
            className={cn(
              "flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
              activeView === 'Monthly' 
                ? "bg-surface-container-lowest text-primary shadow-sm" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="h-64 sm:h-72 w-full min-h-[256px] sm:min-h-[288px] flex-grow">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#003f87" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#003f87" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#424752', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#424752', fontWeight: 600 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                backgroundColor: '#ffffff',
                fontSize: '12px',
                fontWeight: '600'
              }}
              cursor={{ stroke: '#003f87', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#003f87" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
