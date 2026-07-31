import axios from 'axios';
import type { Recipe } from '../types/recipe';

// Use relative path for Vercel deployment (works both in production and with vercel dev)
const API_BASE_URL = '/api/recipes';

// Helper to get or set user ID in localStorage
export const getStoredUserId = (): string => {
  let userId = localStorage.getItem('tastecraft_user_id');
  if (!userId) {
    userId = 'user_1';
    localStorage.setItem('tastecraft_user_id', userId);
  }
  return userId;
};

export const setStoredUserId = (userId: string): void => {
  localStorage.setItem('tastecraft_user_id', userId.trim());
};

const getAxiosConfig = () => {
  return {
    headers: {
      'x-user-id': getStoredUserId(),
    },
  };
};

export const fetchRecipes = async (search?: string, category?: string): Promise<Recipe[]> => {
  const params: Record<string, string> = {
    userId: getStoredUserId(),
  };
  if (search) params.search = search;
  if (category && category !== 'All') params.category = category;

  const response = await axios.get(API_BASE_URL, {
    params,
    ...getAxiosConfig(),
  });
  return response.data;
};

export const fetchRecipeById = async (id: string): Promise<Recipe> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`, getAxiosConfig());
  return response.data;
};

export const createRecipe = async (data: Omit<Recipe, '_id' | 'likesCount' | 'likedBy' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
  const response = await axios.post(
    API_BASE_URL,
    {
      ...data,
      userId: getStoredUserId(),
    },
    getAxiosConfig()
  );
  return response.data;
};

export const updateRecipe = async (id: string, data: Partial<Recipe>): Promise<Recipe> => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, getAxiosConfig());
  return response.data;
};

export const deleteRecipe = async (id: string): Promise<{ message: string; id: string }> => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`, getAxiosConfig());
  return response.data;
};

export const toggleLikeRecipe = async (id: string): Promise<Recipe> => {
  const response = await axios.post(
    `${API_BASE_URL}/${id}/like`,
    { userId: getStoredUserId() },
    getAxiosConfig()
  );
  return response.data;
};
