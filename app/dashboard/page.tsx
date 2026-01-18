"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth.store";
import { useMealStore } from "@/stores/meal.store";
import { getCalories } from "@/lib/api";
import { MealFormData } from "@/types/validation";
import { Button } from "@/components/common/Button";
import { MealSearch } from "@/components/meal/MealSearch";
import { MealResult } from "@/components/meal/MealResult";
import { MealHistory } from "@/components/meal/MealHistory";
import { LogOut, Utensils } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { token } = useAuthStore();
  const {
    mealHistory,
    currentResult,
    isLoading: storeIsLoading,
    error: storeError,
    setCurrentResult,
    addMealToHistory,
    removeMealFromHistory,
    setIsLoading,
    setError,
  } = useMealStore();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !token) {
    return null;
  }

  async function handleMealSearch(data: MealFormData) {
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    setError(null);

    try {
      const result = await getCalories(data, token);
      setCurrentResult(result);
      addMealToHistory(result);
      setError(null);
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to fetch calorie information. Please try again.";
      setError(errorMessage);
      setCurrentResult(null);
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.header
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Utensils className="text-[#6935cf]" size={28} />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#6935cf] to-[#7e4ff7] bg-clip-text text-transparent">
                  Meal Calorie Counter
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome,{" "}
                  <span className="font-medium">
                    {user?.firstName || "User"}
                  </span>
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleLogout}
                variant="outline"
                size="md"
                className="flex items-center gap-2"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.div
        className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Search Form */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="sticky top-24">
              <MealSearch onSearch={handleMealSearch} isLoading={isSearching} />
            </div>
          </motion.div>

          {/* Right Column - Results and History */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Error Message */}
            {storeError && (
              <motion.div
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {storeError}
              </motion.div>
            )}

            {/* Current Result */}
            {currentResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6935cf] to-[#7e4ff7] bg-clip-text text-transparent mb-4">
                  Latest Result
                </h2>
                <MealResult result={currentResult} />
              </motion.div>
            )}

            {/* Empty State */}
            {!currentResult && !storeError && mealHistory.length === 0 && (
              <motion.div
                className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Utensils className="mx-auto text-gray-400 mb-4" size={48} />
                </motion.div>
                <p className="text-gray-600 text-lg">
                  Search for your first meal to get started!
                </p>
              </motion.div>
            )}

            {/* Meal History */}
            {mealHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6935cf] to-[#7e4ff7] bg-clip-text text-transparent mb-4">
                  History
                </h2>
                <MealHistory
                  meals={mealHistory}
                  onDeleteMeal={removeMealFromHistory}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
