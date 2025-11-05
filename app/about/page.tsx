'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Users, MessageCircle, Shield, Zap, Heart, CheckCircle, Settings, Sparkles, Gift, Construction, Telescope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const router = useRouter();

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      title: "Smart Chatbot",
      description: "AI-powered assistant that handles loan queries, document requirements, and application status checks with intelligent conversation flows."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Support Dashboard",
      description: "Comprehensive dashboard for support agents to manage customer tickets, prioritize issues, and provide real-time assistance."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Secure & Reliable",
      description: "Built with modern security practices and reliable data persistence to ensure customer information is always protected."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Lightning Fast",
      description: "Optimized for speed with Next.js server-side rendering and efficient state management for seamless user experience."
    }
  ];

  const coreFeatures = [
    "Customer Chat Interface",
    "Support Executive Dashboard",
    "Loan Application Bot Flow",
    "Application Status Queries",
    "Escalation to Human Agent",
    "Mock Authentication",
    "Ticket Management System"
  ];

  const extraFeatures = [
    "Real-time Chat with Message Timestamps"
  ];

  const bonusFeatures = [
    "Quick Reply Templates (Pre-defined agent responses)",
    "File Upload Simulation (Mock document uploads)",
    "Chat History Persistence (Auto-save conversations)",
    "Real-time Simulation (Polling-based updates)",
    "Dark/Light Mode (Theme switching)",
    "Customer Satisfaction (Post-chat rating)",
    "LocalStorage Data Persistence"
  ];

  const inProgressFeatures = [
    "Voice Input (Speech-to-text integration)"
  ];

  const plannedFeatures = [
    "Notification System for Agents (Live alerts for new messages)"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-4xl pl-5 font-bold text-gray-900 dark:text-white mb-4">
            About KRUX Finance Support System
          </h1>
          <p className="text-xl  pl-5 text-gray-600 dark:text-gray-300 max-w-3xl">
            This project was more than an assignment — it’s my take on how customer support can feel human and efficient. See what powers it, and what I plan to add next!
          </p>
        </motion.div>


        {/* Feature Lists Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 mb-12"
        >
          {/* Core Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                 Core Features
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {coreFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extra Feature */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                 Extra Feature
              </h2>
            </div>
            <div className="space-y-3">
              {extraFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bonus Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Gift className="w-6 h-6 text-pink-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                 Bonus Features
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {bonusFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress & Planned */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* In Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Construction className="w-6 h-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                   In Progress
                </h2>
              </div>
              <div className="space-y-3">
                {inProgressFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Construction className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Planned Next */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Telescope className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                   Planned Next
                </h2>
              </div>
              <div className="space-y-3">
                {plannedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Telescope className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>


        {/* Features Grid */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div> */}


        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <p className="text-gray-700 dark:text-gray-300">Customers can chat with our intelligent bot 24/7 for instant loan information</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <p className="text-gray-700 dark:text-gray-300">Complex queries are automatically escalated to human support agents</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <p className="text-gray-700 dark:text-gray-300">Support agents manage tickets efficiently with priority-based queues</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
              <p className="text-gray-700 dark:text-gray-300">All conversations are tracked and resolved with full transparency</p>
            </div>
          </div>
        </motion.div>

        {/* Demo Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center"
        >
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Ready to Experience It?</h2>
          <p className="text-blue-100 mb-6">
            Try our demo with pre-configured customer and agent accounts to see the system in action.
          </p>
          <Button
            onClick={() => router.push('/')}
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Go to Homepage
          </Button>
        </motion.div>
      </div>
    </div>
  );
}