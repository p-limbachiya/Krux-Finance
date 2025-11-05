'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Message, SupportTicket, User } from '@/types';
import { getBotResponse } from '@/lib/bot';
import { getTicketById, updateTicket, getTicketsByCustomerId, addTicket } from '@/lib/storage';

interface ChatContextType {
  messages: Message[];
  currentTicket: SupportTicket | null;
  sendMessage: (text: string) => void;
  createTicket: (customer: User) => SupportTicket;
  loadTicket: (ticketId: string) => void;
  loadCustomerTickets: (customerId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null);

  const createTicket = useCallback((customer: User): SupportTicket => {
    const ticket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone || '',
      status: 'open',
      priority: 'medium',
      category: 'general',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Add welcome message
    const welcomeMessage: Message = {
      id: `msg-welcome-${Date.now()}`,
      text: "Hello! 👋 Welcome to KRUX Finance support. I'm here to help you with:\n\n• Loan applications\n• Document requirements\n• Application status\n• General inquiries\n\nHow can I assist you today?",
      senderId: 'bot',
      senderName: 'KRUX Bot',
      timestamp: Date.now(),
      isBot: true,
    };

    ticket.messages = [welcomeMessage];
    addTicket(ticket);
    setCurrentTicket(ticket);
    setMessages([welcomeMessage]);
    return ticket;
  }, []);

  const loadTicket = useCallback((ticketId: string) => {
    const ticket = getTicketById(ticketId);
    if (ticket) {
      setCurrentTicket(ticket);
      setMessages(ticket.messages);
    }
  }, []);

  const loadCustomerTickets = useCallback((customerId: string) => {
    const tickets = getTicketsByCustomerId(customerId);
    if (tickets.length > 0) {
      const latestTicket = tickets.sort((a, b) => b.updatedAt - a.updatedAt)[0];
      setCurrentTicket(latestTicket);
      setMessages(latestTicket.messages);
    }
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!currentTicket) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      senderId: currentTicket.customerId,
      senderName: currentTicket.customerName,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Update ticket with new message
    const updatedTicket = {
      ...currentTicket,
      messages: newMessages,
    };
    updateTicket(currentTicket.id, updatedTicket);
    setCurrentTicket(updatedTicket);

    // Get bot response
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        text: botResponse.text,
        senderId: 'bot',
        senderName: 'KRUX Bot',
        timestamp: Date.now(),
        isBot: true,
      };

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);

      const finalTicket = {
        ...updatedTicket,
        messages: finalMessages,
        status: botResponse.requiresAgent ? 'open' : updatedTicket.status,
        priority: botResponse.requiresAgent ? 'high' : updatedTicket.priority,
      };

      updateTicket(currentTicket.id, finalTicket);
      setCurrentTicket(finalTicket);

      // If agent required, ensure ticket is open
      if (botResponse.requiresAgent) {
        updateTicket(currentTicket.id, { status: 'open', priority: 'high' });
      }
    }, 1000);
  }, [messages, currentTicket]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        currentTicket,
        sendMessage,
        createTicket,
        loadTicket,
        loadCustomerTickets,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

