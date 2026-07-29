import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  accentColor = 'var(--accent-primary)',
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-muted)]/30 shadow-xl flex flex-col justify-between relative overflow-hidden group"
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-10 pointer-events-none group-hover:opacity-25 transition-opacity"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[var(--text-body)]">{title}</span>
        <div
          className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-white"
          style={{ color: accentColor }}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <div className="text-3xl font-extrabold text-[var(--text-heading)] tracking-tight mb-1">
          {value}
        </div>
        
        <div className="flex items-center space-x-2 text-xs font-medium">
          {trend && (
            <span
              className={`px-2 py-0.5 rounded-full ${
                trendPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-[var(--text-body)]/70">{subtitle}</span>}
        </div>
      </div>
    </motion.div>
  );
};
