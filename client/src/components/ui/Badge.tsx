import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'amber' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-accent-primary-2/20 text-accent-primary-2 border-accent-primary-2/30',
    secondary: 'bg-bg-surface text-text-body border-border-muted',
    amber: 'bg-accent-secondary/20 text-accent-secondary border-accent-secondary/30',
    outline: 'border border-border-muted text-text-body',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
