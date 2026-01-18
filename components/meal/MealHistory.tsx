"use client";

import { MealEntry } from "@/types";
import { formatDate, formatCalories } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Trash2 } from "lucide-react";

interface MealHistoryProps {
  meals: MealEntry[];
  onDeleteMeal: (id: string) => void;
}

export function MealHistory({ meals, onDeleteMeal }: MealHistoryProps) {
  if (meals.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500 text-lg">No meals logged yet.</p>
        <p className="text-gray-400 text-sm mt-2">
          Search for meals above to start building your history.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal History</CardTitle>
        <p className="text-sm text-gray-500 mt-2">
          {meals.length} meal{meals.length !== 1 ? "s" : ""} logged
        </p>
      </CardHeader>

      <CardContent>
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">
                  Dish
                </th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700 text-sm">
                  Servings
                </th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700 text-sm">
                  Cal/Serving
                </th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700 text-sm">
                  Total Calories
                </th>
                <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">
                  Logged
                </th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700 text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr
                  key={meal.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-3 font-medium text-gray-900">
                    {meal.dish_name}
                  </td>
                  <td className="py-4 px-3 text-center text-gray-700">
                    {meal.servings}
                  </td>
                  <td className="py-4 px-3 text-right text-gray-700">
                    {formatCalories(meal.calories_per_serving)}
                  </td>
                  <td className="py-4 px-3 text-right font-semibold text-blue-600">
                    {formatCalories(meal.total_calories)}
                  </td>
                  <td className="py-4 px-3 text-sm text-gray-600">
                    {formatDate(meal.timestamp)}
                  </td>
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => onDeleteMeal(meal.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                      title="Delete meal"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {meal.dish_name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(meal.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteMeal(meal.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                  title="Delete meal"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-white rounded p-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Servings
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {meal.servings}
                  </p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Per Serving
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {formatCalories(meal.calories_per_serving)}
                  </p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Total
                  </p>
                  <p className="font-bold text-blue-600 mt-1">
                    {formatCalories(meal.total_calories)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
