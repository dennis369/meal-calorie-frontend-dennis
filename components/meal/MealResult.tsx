"use client";

import { motion, type Variants } from "framer-motion";
import { CaloriesResponse } from "@/types";
import { formatCalories, calculateMacros, formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";

interface MealResultProps {
  result: CaloriesResponse;
  timestamp?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

export function MealResult({ result, timestamp = Date.now() }: MealResultProps) {
  const macros = calculateMacros(result.calories_per_serving, result.servings);
  const formattedCaloriesPerServing = formatCalories(result.calories_per_serving);
  const formattedTotalCalories = formatCalories(result.total_calories);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
    >
      <Card className="w-full">
        <CardHeader>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <CardTitle className="text-2xl bg-gradient-to-r from-[#6935cf] to-[#7e4ff7] bg-clip-text text-transparent">
              {result.dish_name}
            </CardTitle>
          </motion.div>
          {timestamp && (
            <motion.p
              className="text-sm text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {formatDate(timestamp)}
            </motion.p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Calorie Info */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                Per Serving
              </p>
              <p className="text-2xl font-bold text-orange-700 mt-2">
                {formattedCaloriesPerServing}
              </p>
              <p className="text-xs text-orange-600 mt-1">calories</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <p className="text-xs font-semibold text-[#6935cf] uppercase tracking-wide">
                Servings
              </p>
              <p className="text-2xl font-bold text-[#6935cf] mt-2">
                {result.servings}
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                Total
              </p>
              <p className="text-2xl font-bold text-green-700 mt-2">
                {formattedTotalCalories}
              </p>
              <p className="text-xs text-green-600 mt-1">calories</p>
            </motion.div>
          </motion.div>

          {/* Macros Breakdown */}
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
          >
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-4">
              Estimated Macros per Serving
            </p>
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-purple-700">
                  {macros.protein}
                </div>
                <p className="text-xs text-purple-600 mt-1">g Protein</p>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-indigo-700">
                  {macros.carbs}
                </div>
                <p className="text-xs text-indigo-600 mt-1">g Carbs</p>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-pink-700">
                  {macros.fat}
                </div>
                <p className="text-xs text-pink-600 mt-1">g Fat</p>
              </motion.div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              * Estimated based on standard macronutrient ratios
            </p>
          </motion.div>

          {/* Data Source */}
          <motion.div
            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Data Source
            </p>
            <p className="text-sm text-gray-700 mt-2">{result.source}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
