import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PortionSize, MealAddon } from '../types/recipe';

export interface CartItem {
  id: string; // unique item instance id (recipeId + portion + sorted addons)
  recipeId: string;
  title: string;
  image: string;
  portionSize: PortionSize;
  selectedAddons: MealAddon[];
  unitPrice: number;
  quantity: number;
}

interface CartStoreState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

const generateCartItemId = (recipeId: string, portionLabel: string, addons: MealAddon[]): string => {
  const addonNames = addons.map((a) => a.name).sort().join(',');
  return `${recipeId}_${portionLabel}_${addonNames}`;
};

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItemData) => {
        const id = generateCartItemId(
          newItemData.recipeId,
          newItemData.portionSize.label,
          newItemData.selectedAddons
        );

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === id);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += newItemData.quantity;
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              {
                ...newItemData,
                id,
              },
            ],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 0 ? 3.99 : 0;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee();
      },
    }),
    {
      name: 'tastecraft-cart-storage',
    }
  )
);
