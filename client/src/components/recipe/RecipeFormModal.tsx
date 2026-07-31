import React, { useState, useEffect } from 'react';
import type { Recipe } from '../../types/recipe';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus, Trash2, Utensils, ListChecks, ChefHat, Tag } from 'lucide-react';

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Recipe, '_id' | 'likesCount' | 'likedBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
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
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title || '');
      setCategory(editingRecipe.category || 'Main Dish');
      setDescription(editingRecipe.description || '');
      setIngredients(editingRecipe.ingredients?.length ? editingRecipe.ingredients : ['']);
      setSteps(editingRecipe.steps?.length ? editingRecipe.steps : ['']);
    } else {
      resetForm();
    }
  }, [editingRecipe, isOpen]);

  const resetForm = () => {
    setTitle('');
    setCategory('Main Dish');
    setDescription('');
    setIngredients(['']);
    setSteps(['']);
    setError('');
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Recipe title is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    const cleanIngredients = ingredients.map((i) => i.trim()).filter((i) => i !== '');
    if (cleanIngredients.length === 0) {
      setError('At least one ingredient is required');
      return;
    }

    const cleanSteps = steps.map((s) => s.trim()).filter((s) => s !== '');
    if (cleanSteps.length === 0) {
      setError('At least one preparation step is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        category,
        description: description.trim(),
        ingredients: cleanIngredients,
        steps: cleanSteps,
        userId: editingRecipe?.userId || '',
      });
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-2">
        {error && (
          <div className="p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-xl text-xs text-accent-primary font-medium">
            {error}
          </div>
        )}

        {/* Title */}
        <Input
          label="Recipe Title"
          placeholder="e.g. Creamy Truffle Pasta"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={<Utensils className="w-4 h-4" />}
          required
        />

        {/* Category */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-text-body flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-accent-secondary" />
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer text-center ${
                  category === cat
                    ? 'bg-accent-primary text-white border-accent-primary shadow-md shadow-accent-primary/20'
                    : 'bg-bg-primary border-border-muted text-text-body hover:text-text-heading hover:border-text-body/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-text-body">Description</label>
          <textarea
            rows={3}
            className="w-full bg-bg-primary border border-border-muted focus:border-accent-primary rounded-xl p-3 text-sm text-text-heading placeholder-text-body/50 outline-none transition-colors duration-200 resize-none"
            placeholder="Brief description of your culinary creation..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Ingredients */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-body flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-accent-secondary" />
              Ingredients
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddIngredient}
              className="text-xs gap-1 text-accent-secondary hover:text-accent-secondary/80"
            >
              <Plus className="w-3.5 h-3.5" /> Add Ingredient
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Ingredient #${index + 1} (e.g. 200g Fresh Pasta)`}
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="flex-1 bg-bg-primary border border-border-muted focus:border-accent-primary rounded-xl px-3 py-2 text-xs text-text-heading placeholder-text-body/40 outline-none transition-colors"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="p-2 text-text-body hover:text-accent-primary-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preparation Steps */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-body flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-accent-primary" />
              Preparation Steps
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddStep}
              className="text-xs gap-1 text-accent-primary hover:text-accent-primary/80"
            >
              <Plus className="w-3.5 h-3.5" /> Add Step
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs font-bold text-accent-primary w-5 text-center shrink-0">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  placeholder={`Step #${index + 1} instruction...`}
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="flex-1 bg-bg-primary border border-border-muted focus:border-accent-primary rounded-xl px-3 py-2 text-xs text-text-heading placeholder-text-body/40 outline-none transition-colors"
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="p-2 text-text-body hover:text-accent-primary-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-muted mt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : editingRecipe
              ? 'Update Recipe'
              : 'Create Recipe'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
