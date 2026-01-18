import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  GetCaloriesRequest,
  CaloriesResponse,
  APIError,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://flybackend-misty-feather-6458.fly.dev";

/**
 * Register a new user
 */
export async function registerUser(
  data: RegisterRequest
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw {
        message: error.message || "Registration failed",
        status: response.status,
      } as APIError;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message,
      } as APIError;
    }
    throw error;
  }
}

/**
 * Login user
 */
export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw {
        message: error.message || "Login failed",
        status: response.status,
      } as APIError;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message,
      } as APIError;
    }
    throw error;
  }
}

/**
 * Get calorie information for a dish
 */
export async function getCalories(
  data: GetCaloriesRequest,
  token: string
): Promise<CaloriesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/get-calories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw {
        message: error.message || "Failed to fetch calories",
        status: response.status,
      } as APIError;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message,
      } as APIError;
    }
    throw error;
  }
}
