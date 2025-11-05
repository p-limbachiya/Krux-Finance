"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/theme-toggle";
import {
  MessageCircle,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react";

const loginSchema = z.object({
  identifier: z.string().min(1, "Phone or username is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Home() {
  const [isCustomer, setIsCustomer] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [particles, setParticles] = useState<Array<{ x: number; y: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Generate particles only on client side after mount
  useEffect(() => {
    setIsMounted(true);
    const generatedParticles = [...Array(20)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(generatedParticles);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    const user = await login(data.identifier);

    if (user) {
      if (user.role === "customer") {
        router.push("/customer-chat");
      } else {
        router.push("/support-dashboard");
      }
    } else {
      setError("Invalid phone number or username. Please try again.");
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const cardVariants: Variants = {
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background elements - only render after mount */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isMounted && particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
            }}
            animate={{
              y: [`${particle.y}vh`, `${particle.y + Math.random() * 20 - 10}vh`],
              x: [`${particle.x}vw`, `${particle.x + Math.random() * 20 - 10}vw`],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-6xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <TrendingUp className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  KRUX Finance
                </h1>
                <ModeToggle />
              </div>
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300"
            >
              Customer Support System
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Customer Login Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-8 border-2 transition-all ${
                isCustomer
                  ? "border-indigo-500 shadow-indigo-200 dark:shadow-indigo-900"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute top-4 right-4"
              >
                <Sparkles className="w-8 h-8 text-indigo-500" />
              </motion.div>

              <div className="mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-block mb-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Customer Login
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Get help with your loan applications
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCustomer(true)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  isCustomer
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Login as Customer
              </motion.button>
            </motion.div>

            {/* Agent Login Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-8 border-2 transition-all ${
                !isCustomer
                  ? "border-purple-500 shadow-purple-200 dark:shadow-purple-900"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute top-4 right-4"
              >
                <Shield className="w-8 h-8 text-purple-500" />
              </motion.div>

              <div className="mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="inline-block mb-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Support Agent
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage customer support tickets
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCustomer(false)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  !isCustomer
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Login as Agent
              </motion.button>
            </motion.div>
          </div>

          {/* Login Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isCustomer ? "customer" : "agent"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border-2 border-gray-200 dark:border-gray-700"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isCustomer ? "Phone Number" : "Username"}
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    {...register("identifier")}
                    placeholder={
                      isCustomer
                        ? "+919876543210 or +919876543211"
                        : "amit.kumar or sneha.singh"
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                  {errors.identifier && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.identifier.message}
                    </motion.p>
                  )}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-500"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Demo Credentials */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Demo Credentials:
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {isCustomer ? (
                    <>
                      <p>• Customer: +919876543210 (Rahul Sharma)</p>
                      <p>• Customer: +919876543211 (Priya Patel)</p>
                    </>
                  ) : (
                    <>
                      <p>• Agent: amit.kumar</p>
                      <p>• Agent: sneha.singh</p>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Features */}
          <motion.div
            variants={itemVariants}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: Zap, label: "Fast Response", color: "yellow" },
              { icon: Shield, label: "Secure", color: "green" },
              { icon: MessageCircle, label: "24/7 Support", color: "blue" },
              { icon: TrendingUp, label: "Easy Access", color: "purple" },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg"
              >
                <feature.icon
                  className={`w-6 h-6 mx-auto mb-2 text-${feature.color}-500`}
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {feature.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}