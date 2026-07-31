import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Sparkles, Plus, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Recipe } from '../../types/recipe';

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeCreated?: (recipe: Partial<Recipe>) => void;
}

export const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({ isOpen, onClose, onRecipeCreated }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Main Dish');
  const [price, setPrice] = useState('18.99');
  const [isOrderable, setIsOrderable] = useState(true);

  const [ingredients, setIngredients] = useState<{ name: string; quantity: string; unit: string }[]>([
    { name: 'Fresh Tagliatelle', quantity: '250', unit: 'g' },
    { name: 'Black Truffle Butter', quantity: '30', unit: 'g' },
  ]);

  const [instructions, setInstructions] = useState<string[]>([
    'Boil salted water and cook pasta until al dente.',
    'Melt truffle butter over low heat and gently toss with pasta.',
  ]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/recipes/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        const recipe = data.data;
        setTitle(recipe.title || '');
        setDescription(recipe.description || '');
        setCategory(recipe.category || 'Main Dish');
        if (recipe.pricing?.price) setPrice(recipe.pricing.price.toString());
        if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
          setIngredients(
            recipe.ingredients.map((ing: any) => ({
              name: ing.name,
              quantity: String(ing.quantity),
              unit: ing.unit,
            }))
          );
        }
        if (Array.isArray(recipe.steps) && recipe.steps.length > 0) {
          setInstructions(recipe.steps.map((st: any) => st.instruction));
        }
      }
    } catch (err) {
      console.error('Failed to auto-generate AI recipe:', err);
    } finally {
      setIsAiLoading(false);
    }
  };


  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: 'g' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRecipeCreated) {
      onRecipeCreated({
        title,
        description,
        category,
        pricing: {
          isOrderable,
          price: parseFloat(price) || 0,
          portionSizes: [{ label: 'Standard', priceOffset: 0 }],
        },
        ingredients: ingredients.map(ing => ({
          name: ing.name,
          quantity: parseFloat(ing.quantity) || 0,
          unit: ing.unit,
          isOptional: false
        })),
        steps: instructions.map((inst, i) => ({
          stepNumber: i + 1,
          instruction: inst
        })),
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish New Recipe">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-[--border-muted]/40 pb-4">
          <div className="flex space-x-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === num
                    ? 'bg-[--accent-primary] text-white shadow-md shadow-[--accent-primary]/30'
                    : step > num
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {step > num ? <CheckCircle2 className="w-4 h-4" /> : num}
              </div>
            ))}
          </div>
          <span className="text-xs font-semibold text-zinc-400">
            Step {step} of 3: {step === 1 ? 'AI & Basic Info' : step === 2 ? 'Ingredients & Steps' : 'Pricing & Monetization'}
          </span>
        </div>

        {/* Step 1: AI Prompt & Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            {/* AI Generator Banner */}
            <div className="p-4 rounded-xl bg-linear-to-r from-purple-900/30 to-rose-900/30 border border-purple-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-purple-300 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>AI Recipe Co-Pilot</span>
              </div>
              <p className="text-xs text-zinc-300">
                Describe a recipe concept or ingredient mix, and our LLM engine will auto-generate structured recipe details!
              </p>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="e.g. Creamy Truffle Fettuccine with Smoked Garlic..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none"
                />
                <Button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isAiLoading}
                  variant="secondary"
                  className="text-xs py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'Generating...' : 'Auto-Fill'}</span>
                </Button>
              </div>
            </div>

            <Input
              label="Recipe Title"
              placeholder="e.g., Artisanal Truffle Pasta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Briefly describe taste profile, aroma, and backstory..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none"
              >
                <option value="Main Dish">Main Dish</option>
                <option value="Vegan">Vegan</option>
                <option value="Street Food">Street Food</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Ingredients & Instructions */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Ingredients</label>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="text-xs text-[--accent-primary] font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Ingredient
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {ingredients.map((ing, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ing.name}
                      onChange={(e) => {
                        const updated = [...ingredients];
                        updated[index].name = e.target.value;
                        setIngredients(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Qty"
                      value={ing.quantity}
                      onChange={(e) => {
                        const updated = [...ingredients];
                        updated[index].quantity = e.target.value;
                        setIngredients(updated);
                      }}
                      className="w-20 px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Unit (g, ml)"
                      value={ing.unit}
                      onChange={(e) => {
                        const updated = [...ingredients];
                        updated[index].unit = e.target.value;
                        setIngredients(updated);
                      }}
                      className="w-20 px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Cooking Instructions</label>
                <button
                  type="button"
                  onClick={handleAddInstruction}
                  className="text-xs text-[--accent-primary] font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Step
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {instructions.map((inst, index) => (
                  <div key={index} className="flex space-x-2 items-start">
                    <span className="text-xs font-bold text-zinc-500 pt-2">{index + 1}.</span>
                    <textarea
                      rows={2}
                      value={inst}
                      onChange={(e) => {
                        const updated = [...instructions];
                        updated[index] = e.target.value;
                        setInstructions(updated);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Monetization */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <input
                type="checkbox"
                id="isOrderable"
                checked={isOrderable}
                onChange={(e) => setIsOrderable(e.target.checked)}
                className="w-4 h-4 rounded accent-[--accent-primary]"
              />
              <label htmlFor="isOrderable" className="text-xs font-bold text-white cursor-pointer">
                Enable Orderable Dish (Turn recipe into a sellable meal product)
              </label>
            </div>

            {isOrderable && (
              <Input
                label="Base Dish Price ($ USD)"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            )}
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-[--border-muted]/40">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => setStep((step - 1) as 1 | 2)}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep((step + 1) as 2 | 3)}
              className="flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" variant="primary" className="px-6 shadow-lg shadow-[--accent-primary]/30 font-bold">
              Publish Recipe
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};
