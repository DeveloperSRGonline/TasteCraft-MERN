import React from 'react';

export interface CategoryTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface PillTabProps {
  tabs: CategoryTab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const PillTab: React.FC<PillTabProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer rounded-full whitespace-nowrap ${
              isActive
                ? 'bg-accent-primary-2 text-white shadow-md shadow-accent-primary-2/30 scale-105'
                : 'bg-bg-surface text-text-body border border-border-muted hover:border-text-body hover:text-text-heading'
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
