import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { RevenueDataPoint } from '../../types/dashboard';

interface RevenueGraphProps {
  data: RevenueDataPoint[];
}

export const RevenueGraph: React.FC<RevenueGraphProps> = ({ data }) => {
  return (
    <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-muted)]/30 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-heading)]">Revenue Performance</h3>
          <p className="text-xs text-[var(--text-body)]">Earnings breakdown over time</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 font-medium">
          Live Analytics
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF385C" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF385C" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#A0AEC0"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#2D3748' }}
            />
            <YAxis
              stroke="#A0AEC0"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#2D3748' }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#16181C',
                borderColor: '#4A5568',
                borderRadius: '0.75rem',
                color: '#FFFFFF',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              formatter={(value: any) => [`$${value}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#FF385C"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
