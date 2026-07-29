import React from 'react';
import type { PortionSize } from '../../types/recipe';
import { PortionSelector as BasePortionSelector } from '../ui/PortionSelector';

interface RecipePortionSelectorProps {
  portions: PortionSize[];
  selectedPortion: PortionSize;
  onSelectPortion: (portion: PortionSize) => void;
  className?: string;
}

export const PortionSelector: React.FC<RecipePortionSelectorProps> = ({
  portions,
  selectedPortion,
  onSelectPortion,
  className = '',
}) => {
  const options = portions.map((p) => ({
    id: p.label,
    label: p.label,
    priceOffset: p.priceOffset,
  }));

  const handleChange = (id: string) => {
    const found = portions.find((p) => p.label === id);
    if (found) {
      onSelectPortion(found);
    }
  };

  return (
    <BasePortionSelector
      options={options}
      selectedId={selectedPortion.label}
      onChange={handleChange}
      className={className}
    />
  );
};
