import React from 'react';

export interface PortionOption {
  id: string;
  label: string; // e.g. "380g", "480g", "560g"
  priceOffset?: number; // e.g. 0, +50, +100
}

export interface PortionSelectorProps {
  options: PortionOption[];
  selectedId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const PortionSelector: React.FC<PortionSelectorProps> = ({
  options,
  selectedId,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 overflow-x-auto py-1 ${className}`}>
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer min-w-[90px] ${
              isSelected
                ? 'bg-bg-surface border-2 border-accent-primary text-text-heading shadow-lg shadow-accent-primary/20 scale-105'
                : 'bg-bg-surface/60 border-border-muted text-text-body hover:border-text-body/60'
            }`}
          >
            <span className="text-sm font-semibold">{option.label}</span>
            {option.priceOffset !== undefined && (
              <span className="text-xs text-text-body/70 mt-0.5">
                {option.priceOffset === 0
                  ? 'Base'
                  : option.priceOffset > 0
                  ? `+$${option.priceOffset}`
                  : `-$${Math.abs(option.priceOffset)}`}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
