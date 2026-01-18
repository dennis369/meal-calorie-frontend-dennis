"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { loginSchema, type LoginFormData } from "@/types/validation";
import { loginUser } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/common/Card";

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export function LoginForm() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setApiError(null);
    try {
      const response = await loginUser(data);

      // Extract user info from email or use placeholder
      const emailParts = data.email.split("@");
      const firstName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);

      setToken(response.token);
      setUser({
        firstName: firstName,
        lastName: "",
        email: data.email,
      });

      router.push("/dashboard");
    } catch (error) {
      const err = error as any;
      setApiError(err?.message || "Login failed. Please check your credentials.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl bg-gradient-to-r from-[#6935cf] to-[#7e4ff7] bg-clip-text text-transparent">
            Sign In
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              {apiError && (
                <motion.div
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {apiError}
                </motion.div>
              )}

              <motion.div variants={fieldVariants}>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                  required
                />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  error={errors.password?.message}
                  required
                />
              </motion.div>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full"
              >
                Sign In
              </Button>
            </motion.div>
            <motion.p
              className="text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Don't have an account?{" "}
              <Link href="/register" className="bg-gradient-to-r from-[#6935cf] to-[#7e4ff7] bg-clip-text text-transparent font-medium hover:underline">
                Create one
              </Link>
            </motion.p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
