// Auth types
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  token: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

// Meal types
export interface GetCaloriesRequest {
  dish_name: string;
  servings: number;
}

export interface CaloriesResponse {
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
}

export interface MealEntry {
  id: string;
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  timestamp: number;
  macros: MacroBreakdown;
}

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fat: number;
}

// API Error
export interface APIError {
  message: string;
  status?: number;
}
