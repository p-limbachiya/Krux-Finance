'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSupport } from '@/contexts/SupportContext';
import { Message, SupportTicket } from '@/types';
import {
  LogOut,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  FileText,
  User,
  Search,
  Filter,
} from 'lucide-react';

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
    addAgentNote,
  } = useSupport();
  const [input, setInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      router.push('/');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (tickets.length > 0 && !selectedTicket) {
      selectTicket(tickets[0].id);
    }
  }, [tickets, selectedTicket, selectTicket]);

  const handleSend = () => {
    if (!input.trim() || !selectedTicket) return;
    sendAgentMessage(input);
    setInput('');
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'escalated':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const quickReplies = [
    'Hello! How can I assist you today?',
    'Thank you for contacting KRUX Finance.',
    'I understand your concern. Let me help you with that.',
    'Please provide more details so I can assist you better.',
    'I have resolved your query. Is there anything else?',
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Panel - Ticket Queue */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Support Queue</h1>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Welcome, {user.name}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
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
                onClick={() => selectTicket(ticket.id)}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {ticket.customerName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{ticket.customerPhone}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)} text-white`}
                  >
                    {ticket.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {ticket.messages[ticket.messages.length - 1]?.text || 'No messages'}
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
      <div className="flex-1 flex flex-col">
        {selectedTicket ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedTicket.customerName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedTicket.customerPhone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) =>
                      updateTicketPriority(selectedTicket.id, e.target.value as SupportTicket['priority'])
                    }
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      updateTicketStatus(selectedTicket.id, e.target.value as SupportTicket['status'])
                    }
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {selectedTicket.messages.map((message: Message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.senderId === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.senderId !== 'agent' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.senderId === 'agent'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.senderId === 'agent' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {message.senderId === 'agent' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 overflow-x-auto">
                {quickReplies.map((reply) => (
                  <motion.button
                    key={reply}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setInput(reply);
                    }}
                    className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 whitespace-nowrap hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Agent Notes */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Internal Notes
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && noteInput.trim()) {
                        addAgentNote(selectedTicket.id, noteInput);
                        setNoteInput('');
                      }
                    }}
                    placeholder="Add private notes (not visible to customer)..."
                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  {selectedTicket.agentNotes && (
                    <div className="px-3 py-2 text-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-200">
                      {selectedTicket.agentNotes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a ticket to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

