import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit, trend, trendType, icon: Icon, colorClass }) => {
  return (
    <div className={cn("bg-surface-container-lowest p-7 rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.02)] border-l-4", colorClass)}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-on-surface-variant font-body text-xs uppercase tracking-wider font-semibold">{label}</span>
        <Icon className={cn("w-5 h-5", colorClass.replace('border-l-', 'text-'))} />
      </div>
      <h3 className="font-headline text-4xl font-extrabold text-on-surface mb-1">
        {value} {unit && <span className="text-lg font-medium text-on-surface-variant">{unit}</span>}
      </h3>
      <div className={cn(
        "flex items-center text-xs font-semibold",
        trendType === 'up' ? "text-emerald-600" : trendType === 'down' ? "text-error" : "text-secondary"
      )}>
        {trendType === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : trendType === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
        {trend}
      </div>
    </div>
  );
};
