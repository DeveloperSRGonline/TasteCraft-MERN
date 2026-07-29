import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-text-body">{label}</label>}
      <div className="relative flex items-center">
        {icon && <span className="absolute left-3.5 text-text-body pointer-events-none">{icon}</span>}
        <input
          className={`w-full bg-bg-primary border ${
            error ? 'border-accent-primary' : 'border-border-muted focus:border-accent-primary'
          } rounded-xl py-2.5 ${icon ? 'pl-10' : 'pl-4'} pr-4 text-sm text-text-heading placeholder-text-body/50 outline-none transition-colors duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-accent-primary">{error}</span>}
    </div>
  );
};
