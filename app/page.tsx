"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Utensils, TrendingUp, Clock, BarChart3 } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <motion.nav
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Utensils className="text-[#6935cf]" size={28} />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#6935cf] to-[#7e4ff7] bg-clip-text text-transparent">
              Meal Calorie Counter
            </span>
          </motion.div>
          <motion.div className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Link href="/login">
              <Button variant="outline" size="md">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <motion.div className="max-w-2xl mx-auto text-center" variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            Know Your Nutrition,
            <motion.span
              className="bg-gradient-to-r from-[#6935cf] to-[#7e4ff7] bg-clip-text text-transparent block"
              variants={itemVariants}
              initial={{ backgroundPosition: "200% center" }}
              animate={{ backgroundPosition: "-200% center" }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Track Your Health
            </motion.span>
          </motion.h1>
          <motion.p className="text-lg text-gray-600 mb-8 leading-relaxed" variants={itemVariants}>
            Get accurate calorie and macro information for any meal in seconds.
            Powered by USDA FoodData Central with an intuitive, mobile-friendly
            interface.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            <Link href="/register">
              <Button variant="primary" size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-gray-200 px-4 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Why Choose Us?
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 mt-1"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <TrendingUp className="text-blue-600" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Accurate Data
                    </h3>
                    <p className="text-gray-600">
                      All nutritional information is sourced from USDA FoodData
                      Central, ensuring accuracy and reliability.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 mt-1"
                    whileHover={{ scale: 1.2, rotate: -5 }}
                  >
                    <Clock className="text-green-600" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Instant Results
                    </h3>
                    <p className="text-gray-600">
                      Get calorie and macro information instantly with our smart
                      autocomplete search.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 mt-1"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <BarChart3 className="text-[#6935cf]" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Macro Breakdown
                    </h3>
                    <p className="text-gray-600">
                      View estimated protein, carbs, and fat breakdowns for every
                      meal you search.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 mt-1"
                    whileHover={{ scale: 1.2, rotate: -5 }}
                  >
                    <Utensils className="text-orange-600" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Meal History
                    </h3>
                    <p className="text-gray-600">
                      Keep track of all your meal searches with timestamps and
                      easy-to-manage history.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-[#6935cf] to-[#7e4ff7] px-4 py-12 sm:py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Ready to Take Control of Your Nutrition?
          </motion.h2>
          <motion.p className="text-purple-100 mb-8 text-lg" variants={itemVariants}>
            Start tracking calories and macros today. It only takes 30 seconds
            to get started.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/register">
              <Button variant="outline" size="lg" className="border-white text-white">
                Sign Up Free
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-gray-300 px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">© 2026 Dennis Dev House. All rights reserved.</p>

        </div>
      </motion.footer>
    </div>
  );
}
