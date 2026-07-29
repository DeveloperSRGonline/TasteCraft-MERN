import { z } from 'zod';

export const RecipeAISchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()),
  ingredients: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number(),
      unit: z.string(),
      isOptional: z.boolean().default(false),
    })
  ),
  steps: z.array(
    z.object({
      stepNumber: z.number(),
      instruction: z.string().min(1),
    })
  ),
  pricing: z.object({
    isOrderable: z.boolean().default(true),
    price: z.number(),
    portionSizes: z.array(
      z.object({
        label: z.string(),
        priceOffset: z.number(),
      })
    ),
  }),
  mealAddons: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
      iconUrl: z.string().optional(),
    })
  ).optional().default([]),
});

export type GeneratedRecipe = z.infer<typeof RecipeAISchema>;

export const generateRecipeWithAI = async (prompt: string): Promise<GeneratedRecipe> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Fallback template when no API key is provided
    return {
      title: `AI Chef Special: ${prompt.slice(0, 30)}`,
      description: `A gourmet creation inspired by "${prompt}". Perfect blend of vibrant flavors, fresh herbs, and rich culinary textures.`,
      category: 'Main Dish',
      tags: ['AI-Generated', 'Gourmet', 'Chef Special'],
      ingredients: [
        { name: 'Primary Ingredient', quantity: 250, unit: 'g', isOptional: false },
        { name: 'Aromatic Spice Blend', quantity: 15, unit: 'g', isOptional: false },
        { name: 'Virgin Olive Oil', quantity: 20, unit: 'ml', isOptional: false },
        { name: 'Fresh Herbs (Garnish)', quantity: 10, unit: 'g', isOptional: true },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Prepare and wash all fresh ingredients thoroughly.' },
        { stepNumber: 2, instruction: 'Sauté main aromatics in olive oil over medium heat until fragrant.' },
        { stepNumber: 3, instruction: 'Combine primary ingredients with spice blend and simmer to perfection.' },
        { stepNumber: 4, instruction: 'Garnish with fresh herbs and serve piping hot.' },
      ],
      pricing: {
        isOrderable: true,
        price: 18.99,
        portionSizes: [
          { label: 'Standard (350g)', priceOffset: 0 },
          { label: 'Hungry (500g)', priceOffset: 4.5 },
        ],
      },
      mealAddons: [
        { name: 'Extra Truffle Butter Dip', price: 2.5 },
        { name: 'Artisanal Garlic Bread', price: 3.5 },
      ],
    };
  }

  // Dynamic ESM import for @google/genai in CommonJS environment
  const genAIModule: any = await (eval('import("@google/genai")'));
  const { GoogleGenAI, Type } = genAIModule;

  const ai = new GoogleGenAI({ apiKey });

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      category: { type: Type.STRING },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            quantity: { type: Type.NUMBER },
            unit: { type: Type.STRING },
            isOptional: { type: Type.BOOLEAN },
          },
          required: ['name', 'quantity', 'unit', 'isOptional'],
        },
      },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            stepNumber: { type: Type.NUMBER },
            instruction: { type: Type.STRING },
          },
          required: ['stepNumber', 'instruction'],
        },
      },
      pricing: {
        type: Type.OBJECT,
        properties: {
          isOrderable: { type: Type.BOOLEAN },
          price: { type: Type.NUMBER },
          portionSizes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                priceOffset: { type: Type.NUMBER },
              },
              required: ['label', 'priceOffset'],
            },
          },
        },
        required: ['isOrderable', 'price', 'portionSizes'],
      },
      mealAddons: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.NUMBER },
            iconUrl: { type: Type.STRING },
          },
          required: ['name', 'price'],
        },
      },
    },
    required: ['title', 'description', 'category', 'tags', 'ingredients', 'steps', 'pricing', 'mealAddons'],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are an expert executive culinary chef for TasteCraft, a gourmet recipe & meal delivery platform.
Generate a structured gourmet recipe based on the user's prompt: "${prompt}".
Ensure reasonable pricing (in USD) and portion sizes suitable for ordering. Categories must be one of: Main Dish, Starter, Vegan, Desserts, Italian, Asian, Street Food.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.7,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('AI service failed to generate a response');
  }

  const rawJson = JSON.parse(text);
  return RecipeAISchema.parse(rawJson);
};
