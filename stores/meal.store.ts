import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MealEntry, CaloriesResponse } from "@/types";
import { calculateMacros } from "@/lib/utils";

interface MealStore {
  mealHistory: MealEntry[];
  currentResult: CaloriesResponse | null;
  isLoading: boolean;
  error: string | null;
  setCurrentResult: (result: CaloriesResponse | null) => void;
  addMealToHistory: (result: CaloriesResponse) => void;
  removeMealFromHistory: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearMealHistory: () => void;
}

export const useMealStore = create<MealStore>()(
  persist(
    (set) => ({
      mealHistory: [],
      currentResult: null,
      isLoading: false,
      error: null,
      setCurrentResult: (result: CaloriesResponse | null) => {
        set({ currentResult: result });
      },
      addMealToHistory: (result: CaloriesResponse) => {
        set((state) => ({
          mealHistory: [
            {
              id: `${Date.now()}-${Math.random()}`,
              dish_name: result.dish_name,
              servings: result.servings,
              calories_per_serving: result.calories_per_serving,
              total_calories: result.total_calories,
              timestamp: Date.now(),
              macros: calculateMacros(
                result.calories_per_serving,
                result.servings
              ),
            },
            ...state.mealHistory,
          ],
        }));
      },
      removeMealFromHistory: (id: string) => {
        set((state) => ({
          mealHistory: state.mealHistory.filter((meal) => meal.id !== id),
        }));
      },
      setIsLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      setError: (error: string | null) => {
        set({ error });
      },
      clearMealHistory: () => {
        set({ mealHistory: [] });
      },
    }),
    {
      name: "meal-storage",
      partialize: (state) => ({
        mealHistory: state.mealHistory,
      }),
    }
  )
);
