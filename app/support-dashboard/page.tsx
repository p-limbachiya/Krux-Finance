"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSupport } from "@/contexts/SupportContext";
import { Message, SupportTicket } from "@/types";
import {
  LogOut,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  User,
  Search,
  Filter,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";

export default function SupportDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    tickets,
    selectedTicket,
    selectTicket,
    sendAgentMessage,
    updateTicketStatus,
    updateTicketPriority,
  } = useSupport();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || user.role !== "agent") {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (tickets.length > 0 && !selectedTicket) {
      selectTicket(tickets[0].id);
    }
  }, [tickets, selectedTicket, selectTicket]);

  useEffect(() => {
    if (selectedTicket) {
      // Use setTimeout to ensure DOM is updated before scrolling
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [selectedTicket, selectedTicket?.messages?.length]);

  const handleSend = () => {
    if (!input.trim() || !selectedTicket) return;
    sendAgentMessage(input);
    setInput("");
  };

  const getPriorityColor = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "in-progress":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      case "escalated":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerPhone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const quickReplies = [
    "Hello! How can I assist you today?",
    "Thank you for contacting KRUX Finance.",
    "I understand your concern. Let me help you with that.",
    "Please provide more details so I can assist you better.",
    "I have resolved your query. Is there anything else?",
  ];

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Access Denied
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans antialiased w-full overflow-x-hidden">
      <div className="flex h-screen overflow-hidden max-w-full">
        <div className="flex h-full w-full relative">
          {/* Mobile Overlay */}
          {isLeftPanelOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsLeftPanelOpen(false)}
            />
          )}

          {/* Left Panel - Ticket Queue */}
          <div
            className={`fixed top-0 left-0 h-full w-[280px] sm:w-[320px] md:w-[350px] lg:w-[380px] xl:w-[400px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 flex flex-col z-40 lg:relative lg:z-auto transition-transform duration-300 ease-in-out ${
              isLeftPanelOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Support
                </h1>
                <div className="flex items-center gap-2">
                  <ModeToggle />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <LogOut className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                  <button
                    className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setIsLeftPanelOpen(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                Welcome, {user.name}
              </div>

              {/* Search */}
              <div className="relative mb-2 sm:mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..."
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>

            {/* Ticket List */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      selectTicket(ticket.id);
                      if (window.innerWidth < 1024) {
                        setIsLeftPanelOpen(false);
                      }
                    }}
                    className={`p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id
                        ? "bg-indigo-100 dark:bg-indigo-900/30 border-l-4 border-l-indigo-500"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1 sm:mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                          {ticket.customerName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {ticket.customerPhone}
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 ${getPriorityColor(
                          ticket.priority
                        )}`}
                      />
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                      <span
                        className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded-full ${getStatusColor(
                          ticket.status
                        )} text-white`}
                      >
                        {ticket.status}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 break-words">
                      {ticket.messages[ticket.messages.length - 1]?.text ||
                        "No messages"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(ticket.updatedAt).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredTickets.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No tickets found
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Chat */}
          <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-gray-900/50 min-w-0">
            {selectedTicket ? (
              <>
                {/* Chat Header */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <button
                        className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                        onClick={() => setIsLeftPanelOpen(true)}
                      >
                        <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                          {selectedTicket.customerName}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 truncate">
                          {selectedTicket.customerPhone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
                      {/* Priority Dropdown */}
                      <div className="relative">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setIsPriorityDropdownOpen(!isPriorityDropdownOpen)
                          }
                          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                        >
                          <span className="capitalize text-xs sm:text-sm md:text-base">
                            {selectedTicket.priority}
                          </span>
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        </motion.button>
                        <AnimatePresence>
                          {isPriorityDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10"
                            >
                              {["low", "medium", "high", "urgent"].map((p) => (
                                <button
                                  key={p}
                                  onClick={() => {
                                    updateTicketPriority(
                                      selectedTicket.id,
                                      p as SupportTicket["priority"]
                                    );
                                    setIsPriorityDropdownOpen(false);
                                  }}
                                  className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 capitalize"
                                >
                                  {p}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Status Dropdown */}
                      <div className="relative">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setIsStatusDropdownOpen(!isStatusDropdownOpen)
                          }
                          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                        >
                          <span className="capitalize text-xs sm:text-sm md:text-base">
                            {selectedTicket.status}
                          </span>
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        </motion.button>
                        <AnimatePresence>
                          {isStatusDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10"
                            >
                              {[
                                "open",
                                "in-progress",
                                "resolved",
                                "escalated",
                              ].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => {
                                    updateTicketStatus(
                                      selectedTicket.id,
                                      s as SupportTicket["status"]
                                    );
                                    setIsStatusDropdownOpen(false);
                                  }}
                                  className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 capitalize"
                                >
                                  {s}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                  <AnimatePresence>
                    {selectedTicket.messages.map((message: Message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        layout
                        className={`flex gap-2 sm:gap-3 md:gap-4 ${
                          message.senderId === "agent"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.senderId !== "agent" &&
                          (message.senderId === "bot" ? (
                            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" />
                            </div>
                          ))}
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 ${
                            message.senderId === "agent"
                              ? "bg-indigo-600 text-white rounded-br-none"
                              : message.senderId === "bot"
                              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md rounded-bl-none"
                              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md rounded-bl-none"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-xs sm:text-sm md:text-base leading-relaxed">
                            {message.text}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === "agent"
                                ? "text-indigo-200"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </motion.div>
                        {message.senderId === "agent" && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </AnimatePresence>
                </div>

                {/* Quick Replies */}
                <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {quickReplies.map((reply) => (
                      <motion.button
                        key={reply}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          sendAgentMessage(reply);
                        }}
                        className="px-2 py-1 sm:px-3 sm:py-2 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                      >
                        {reply}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
                  <div className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all text-sm md:text-base"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="p-2 sm:p-3 md:p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Send className="w-5 h-5 md:w-6 md:h-6" />
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">Select a Ticket</h2>
                  <p className="mt-1 text-sm">
                    Choose a ticket from the left panel to view the
                    conversation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
