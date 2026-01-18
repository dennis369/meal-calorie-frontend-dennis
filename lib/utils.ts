import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MacroBreakdown } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format calories to a readable number without excessive decimals
 */
export function formatCalories(calories: number): number {
  return Math.round(calories * 10) / 10
}

/**
 * Calculate estimated macros based on total calories
 * Uses standard ratio: 40% carbs, 30% protein, 30% fat
 */
export function calculateMacros(
  caloriesPerServing: number,
  servings: number
): MacroBreakdown {
  const totalCalories = caloriesPerServing * servings
  
  // Macros per gram: carbs = 4cal, protein = 4cal, fat = 9cal
  const carbsCalories = totalCalories * 0.4
  const proteinCalories = totalCalories * 0.3
  const fatCalories = totalCalories * 0.3

  return {
    carbs: Math.round((carbsCalories / 4) * 10) / 10,
    protein: Math.round((proteinCalories / 4) * 10) / 10,
    fat: Math.round((fatCalories / 9) * 10) / 10,
  }
}

/**
 * Format date to readable string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    })
  }
}

/**
 * Generate popular dish suggestions for autocomplete
 */
export const POPULAR_DISHES = [
  "Chicken Breast",
  "Salmon",
  "Broccoli",
  "Brown Rice",
  "Sweet Potato",
  "Eggs",
  "Greek Yogurt",
  "Almonds",
  "Peanut Butter",
  "Oatmeal",
  "Banana",
  "Apple",
  "Chicken Salad",
  "Caesar Salad",
  "Grilled Cheese",
  "Pasta Carbonara",
  "Hamburger",
  "Hot Dog",
  "Pizza",
  "Sushi",
  "Tacos",
  "Burritos",
  "Curry",
  "Steak",
  "Turkey",
  "Tuna",
  "Shrimp",
  "Tofu",
  "Beans",
  "Lentils",
]

/**
 * Filter and sort dish suggestions
 */
export function getSuggestedDishes(query: string, limit: number = 8): string[] {
  if (!query.trim()) {
    return POPULAR_DISHES.slice(0, limit)
  }

  const lowerQuery = query.toLowerCase()
  return POPULAR_DISHES.filter((dish) => dish.toLowerCase().includes(lowerQuery))
    .sort((a, b) => {
      const aIndex = a.toLowerCase().indexOf(lowerQuery)
      const bIndex = b.toLowerCase().indexOf(lowerQuery)
      return aIndex - bIndex
    })
    .slice(0, limit)
}
