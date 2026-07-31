import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  recipeTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  recipeTitle,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Recipe">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-4 bg-accent-primary/10 border border-accent-primary/30 rounded-xl text-accent-primary">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <p className="text-xs leading-relaxed font-medium">
            Are you sure you want to delete <span className="font-bold">"{recipeTitle}"</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            className="bg-accent-primary-2 hover:bg-accent-primary-2/90"
          >
            Delete Recipe
          </Button>
        </div>
      </div>
    </Modal>
  );
};
