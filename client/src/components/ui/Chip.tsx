import React from 'react';

export interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onClick,
  className = '',
  icon,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer rounded-full border ${
        active
          ? 'bg-accent-primary-2 border-accent-primary-2 text-white shadow-md shadow-accent-primary-2/30'
          : 'bg-bg-surface/50 border-border-muted text-text-body hover:border-text-body hover:text-text-heading'
      } ${className}`}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
