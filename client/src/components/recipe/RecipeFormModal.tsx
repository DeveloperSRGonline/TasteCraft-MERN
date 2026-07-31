import React, { useState, useEffect } from 'react';
import type { Recipe, Ingredient, Step } from '../../types/recipe';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus, Trash2, Utensils, ListChecks, ChefHat, Tag } from 'lucide-react';

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  editingRecipe?: Recipe | null;
}

const CATEGORIES = ['Main Dish', 'Street Food', 'Vegan', 'Desserts', 'Breakfast', 'Snacks'];

export const RecipeFormModal: React.FC<RecipeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingRecipe,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Main Dish');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: 0, unit: 'g', isOptional: false }]);
  const [steps, setSteps] = useState<Step[]>([{ stepNumber: 1, instruction: '' }]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title || '');
      setCategory(editingRecipe.category || 'Main Dish');
      setDescription(editingRecipe.description || '');
      setIngredients(editingRecipe.ingredients?.length ? editingRecipe.ingredients : [{ name: '', quantity: 0, unit: 'g', isOptional: false }]);
      setSteps(editingRecipe.steps?.length ? editingRecipe.steps : [{ stepNumber: 1, instruction: '' }]);
    } else {
      resetForm();
    }
  }, [editingRecipe, isOpen]);

  const resetForm = () => {
    setTitle('');
    setCategory('Main Dish');
    setDescription('');
    setIngredients([{ name: '', quantity: 0, unit: 'g', isOptional: false }]);
    setSteps([{ stepNumber: 1, instruction: '' }]);
    setError('');
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 0, unit: 'g', isOptional: false }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number | boolean) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const addStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, instruction: '' }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const updated = steps.filter((_, i) => i !== index).map((step, i) => ({ ...step, stepNumber: i + 1 }));
      setSteps(updated);
    }
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], instruction: value };
    setSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!ingredients.filter(i => i.name.trim()).length) {
      setError('At least one ingredient is required');
      return;
    }
    if (!steps.filter(s => s.instruction.trim()).length) {
      setError('At least one step is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        ingredients: ingredients.filter(i => i.name.trim()),
        steps: steps.filter(s => s.instruction.trim()),
        userId: 'user_1', // This will be handled by the API
      });
      resetForm();
      onClose();
    } catch (err) {
      setError('Failed to save recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-text-heading mb-2 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-accent-secondary" />
            Recipe Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Spaghetti Carbonara"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-text-heading mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent-secondary" />
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-accent-primary text-white'
                    : 'bg-bg-primary text-text-body hover:text-text-heading hover:bg-bg-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-heading mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your recipe..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-muted/60 text-text-heading placeholder:text-text-body/50 focus:outline-none focus:border-accent-primary/50 transition-colors resize-none"
            required
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="text-sm font-medium text-text-heading mb-2 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-accent-secondary" />
            Ingredients
          </label>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={ingredient.quantity || ''}
                  onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                  placeholder="Qty"
                  className="w-20"
                />
                <Input
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  placeholder="Unit"
                  className="w-20"
                />
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Ingredient
            </Button>
          </div>
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium text-text-heading mb-2 flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-accent-secondary" />
            Steps
          </label>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <div className="shrink-0 w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-bold flex items-center justify-center mt-3">
                  {step.stepNumber}
                </div>
                <textarea
                  value={step.instruction}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`Step ${step.stepNumber}`}
                  rows={2}
                  className="flex-1 px-4 py-3 rounded-xl bg-bg-primary border border-border-muted/60 text-text-heading placeholder:text-text-body/50 focus:outline-none focus:border-accent-primary/50 transition-colors resize-none"
                />
                {steps.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStep}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Step
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : editingRecipe ? 'Update Recipe' : 'Create Recipe'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};