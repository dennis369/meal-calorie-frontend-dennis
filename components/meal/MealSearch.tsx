"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { mealSchema, type MealFormData } from "@/types/validation";
import { getSuggestedDishes } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";

interface MealSearchProps {
  onSearch: (data: MealFormData) => Promise<void>;
  isLoading?: boolean;
}

export function MealSearch({ onSearch, isLoading = false }: MealSearchProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      dish_name: "",
      servings: 1,
    },
  });

  const dishName = watch("dish_name");
  const { ref: dishRef, ...dishRegisterProps } = register("dish_name");
  const { ref: servingsRef, ...servingsRegisterProps } = register("servings", {
    valueAsNumber: true,
  });

  // Handle autocomplete suggestions
  useEffect(() => {
    if (dishName && dishName.length > 0) {
      const newSuggestions = getSuggestedDishes(dishName, 8);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions(getSuggestedDishes("", 8));
      setShowSuggestions(false);
    }
  }, [dishName]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectSuggestion(dish: string) {
    setValue("dish_name", dish);
    setShowSuggestions(false);
  }

  async function onSubmit(data: MealFormData) {
    await onSearch(data);
    setShowSuggestions(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Meal Calories</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Dish Name with Autocomplete */}
          <motion.div
            className="relative"
            ref={containerRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Input
              ref={dishRef}
              label="Dish Name"
              placeholder="e.g., Chicken Salad, Pasta, Burger..."
              autoComplete="off"
              {...dishRegisterProps}
              error={errors.dish_name?.message}
              onFocus={() => (dishName && dishName.length > 0) && setShowSuggestions(true)}
              required
            />

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {suggestions.map((dish, index) => (
                    <motion.button
                      key={dish}
                      type="button"
                      onClick={() => handleSelectSuggestion(dish)}
                      className="w-full text-left px-4 py-2.5 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 text-gray-800"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4, backgroundColor: "rgba(249, 240, 255, 1)" }}
                    >
                      <span className="font-medium text-gray-900">{dish}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Empty State */}
              {showSuggestions && suggestions.length === 0 && dishName.length > 0 && (
                <motion.div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-sm text-gray-500 text-center">
                    No suggestions found. Try searching for a different dish.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Servings Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
          >
            <Input
              ref={servingsRef}
              label="Servings"
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              placeholder="1"
              {...servingsRegisterProps}
              error={errors.servings?.message}
              helperText="Decimal values supported (e.g., 1.5)"
              required
            />
          </motion.div>
        </CardContent>

        <motion.div
          className="px-6 pb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.15 }}
        >
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting || isLoading}
            className="w-full"
          >
            Get Calorie Info
          </Button>
        </motion.div>
      </form>
    </Card>
  );
}
