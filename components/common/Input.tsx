"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const { onDrag, onDragStart, onDragEnd, ...safeProps } = props as any;
    
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {safeProps.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <motion.input
          ref={ref}
          className={cn(
            "px-4 py-2.5 rounded-lg border border-gray-300",
            "focus:outline-none focus:ring-2 focus:ring-[#6935cf] focus:border-transparent focus:shadow-md",
            "placeholder-gray-400",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileFocus={{ scale: 1.01 }}
          {...safeProps}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);
