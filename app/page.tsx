"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/theme-toggle";
import { MessageCircle, Users, ArrowRight, Shield, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  identifier: z.string().min(1, "Phone or username is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Home() {
  const [isCustomer, setIsCustomer] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

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

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              KRUX Finance
            </h1>
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 pt-20 sm:pt-24">
        <div className="w-full max-w-4xl mx-4">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-foreground mb-3 sm:mb-4">
              Welcome to KRUX Finance
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-light">
              Secure customer support system
            </p>
          </motion.div>

          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            {/* Customer Card */}
            <div
              onClick={() => setIsCustomer(true)}
              className={`p-6 sm:p-8 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                isCustomer
                  ? "border-primary bg-card shadow-lg"
                  : "border-border bg-card/50 hover:bg-card"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                  isCustomer ? "bg-primary" : "bg-muted"
                }`}>
                  <MessageCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isCustomer ? "text-primary-foreground" : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">
                    Customer
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Get support for your loan applications
                  </p>
                </div>
              </div>
            </div>

            {/* Support Agent Card */}
            <div
              onClick={() => setIsCustomer(false)}
              className={`p-6 sm:p-8 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                !isCustomer
                  ? "border-accent bg-card shadow-lg"
                  : "border-border bg-card/50 hover:bg-card"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                  !isCustomer ? "bg-accent" : "bg-muted"
                }`}>
                  <Shield className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    !isCustomer ? "text-accent-foreground" : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">
                    Support Agent
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Manage customer support tickets
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card rounded-xl shadow-lg p-6 sm:p-8 border border-border"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {isCustomer ? "Phone Number" : "Username"}
                </label>
                <input
                  type="text"
                  {...register("identifier")}
                  placeholder={
                    isCustomer
                      ? "+919876543210"
                      : "amit.kumar"
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring focus:outline-none transition-all text-sm sm:text-base"
                />
                {errors.identifier && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.identifier.message}
                  </p>
                )}
                {error && (
                  <p className="mt-2 text-sm text-destructive">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-niagara to-royal-blue hover:from-niagara-dark hover:to-royal-blue-dark text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted rounded-lg">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                Demo Credentials:
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                {isCustomer ? (
                  <>
                    <p>• Customer: +919876543210</p>
                    <p>• Customer: +919876543211</p>
                  </>
                ) : (
                  <>
                    <p>• Agent: amit.kumar</p>
                    <p>• Agent: sneha.singh</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              By logging in, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}