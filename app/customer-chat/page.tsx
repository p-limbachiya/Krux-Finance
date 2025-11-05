"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { getTicketsByCustomerId } from "@/lib/storage";
import { Send, LogOut, Bot, User, ArrowLeft, Paperclip } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";

export default function CustomerChatPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    messages,
    currentTicket,
    sendMessage,
    createTicket,
    loadCustomerTickets,
  } = useChat();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || user.role !== "customer") {
      router.push("/");
      return;
    }

    // Always scope chat to the current customer, even if a previous ticket exists in memory
    const existingTickets = getTicketsByCustomerId(user.id);
    if (existingTickets.length > 0) {
      loadCustomerTickets(user.id);
    } else {
      createTicket(user);
    }
  }, [user?.id, user?.role, router, createTicket, loadCustomerTickets]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    // Check last message for suggestions
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.isBot) {
      // Extract suggestions from bot response (simplified)
      const suggestions = extractSuggestions(lastMessage.text);
      setShowSuggestions(suggestions);
    }
  }, [messages]);

  const extractSuggestions = (text: string): string[] => {
    // Extract suggestions from bot response text
    const commonSuggestions = [
      "Loan Application",
      "Document Help",
      "Check Status",
      "Talk to Agent",
      "Start Application",
      "Upload Documents",
      "Business Loan",
      "Personal Loan",
      "MSME Loan",
      "Document Requirements",
      "Enter Application ID",
    ];

    // Check if any suggestions are mentioned in the text
    const found = commonSuggestions.filter((s) =>
      text.toLowerCase().includes(s.toLowerCase())
    );

    // If no suggestions found, return default ones
    return found.length > 0 ? found.slice(0, 4) : [];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(input);
    setInput("");
    setShowSuggestions([]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
    setShowSuggestions([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      sendMessage(`I have uploaded a document: ${file.name}`);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push("/")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-white">
                  KRUX Support
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We're here to help
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.phone}
              </p>
            </div>
            <ModeToggle />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages (Glassmorphism Card with floating balls behind) */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="relative max-w-4xl mx-auto">
          {/* Floating balls background */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ x: -80, y: -40, opacity: 0.5 }}
              animate={{
                x: [-80, 40, -60],
                y: [-40, -20, -40],
                opacity: [0.5, 0.6, 0.5],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="w-56 h-56 bg-linear-to-br from-indigo-500/40 to-purple-500/40 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ x: 120, y: 60, opacity: 0.4 }}
              animate={{
                x: [120, 10, 120],
                y: [60, 100, 60],
                opacity: [0.4, 0.55, 0.4],
              }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              className="w-64 h-64 bg-linear-to-br from-fuchsia-500/40 to-cyan-500/40 rounded-full blur-3xl"
            />
          </div>

          {/* Glass card */}
          <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl shadow-xl p-4 sm:p-6">
            <div className="space-y-6">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
                  >
                    <Bot className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Welcome to KRUX Finance Support!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    How can we help you today? Ask a question or choose one of
                    the options below.
                  </p>
                </motion.div>
              )}

              <AnimatePresence>
                {messages.map((message, index) => {
                  const isSelf = message.senderId === user.id;
                  const isSupport = !isSelf; // bot or agent messages
                  const showBot = message.isBot === true;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        x: isSelf ? 20 : -20,
                      }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex gap-3 w-full ${
                        isSelf ? "justify-end" : "justify-start"
                      }`}
                    >
                      {isSupport && (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 self-end mb-2 ${
                            showBot
                              ? "bg-linear-to-br from-indigo-500 to-purple-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          {showBot ? (
                            <Bot className="w-5 h-5 text-white" />
                          ) : (
                            <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          )}
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                          isSelf
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-white/70 dark:bg-gray-800/70 backdrop-blur text-gray-900 dark:text-white shadow-md rounded-bl-none"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          {!isSelf ? (
                            <span className="text-[11px] tracking-wide uppercase text-gray-500 dark:text-gray-400">
                              Customer Care
                            </span>
                          ) : (
                            <span className="text-[11px] tracking-wide uppercase text-indigo-200">
                              You
                            </span>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.text}
                        </p>
                        <p
                          className={`text-xs mt-2 text-right ${
                            isSelf
                              ? "text-indigo-200"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {isSelf && (
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 self-end mb-2">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center self-end mb-2">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md rounded-bl-none">
                    <div className="flex gap-1 items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                        KRUX is typing
                      </span>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-2"
        >
          <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center sm:justify-start">
            {showSuggestions.map((suggestion) => (
              <motion.button
                key={suggestion}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex gap-2 items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAttachmentClick}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
("");
