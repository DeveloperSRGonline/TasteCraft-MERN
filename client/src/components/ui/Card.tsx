import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-bg-surface border border-border-muted/50 rounded-2xl overflow-hidden ${
        hoverEffect ? 'transition-all duration-300 hover:border-accent-primary/50 hover:shadow-xl hover:shadow-accent-primary/5 hover:-translate-y-1' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
