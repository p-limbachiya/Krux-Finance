'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportTicket, Message, User } from '@/types';
import { getTickets, updateTicket, getTicketById } from '@/lib/storage';

interface SupportContextType {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  selectTicket: (ticketId: string) => void;
  sendAgentMessage: (text: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  updateTicketPriority: (ticketId: string, priority: SupportTicket['priority']) => void;
  addAgentNote: (ticketId: string, note: string) => void;
  refreshTickets: () => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export function SupportProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    refreshTickets();
    const interval = setInterval(refreshTickets, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const refreshTickets = useCallback(() => {
    const allTickets = getTickets();
    setTickets(allTickets.sort((a, b) => {
      // Sort by priority and then by updated time
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.updatedAt - a.updatedAt;
    }));

    // Update selected ticket if it exists
    if (selectedTicket) {
      const updated = getTicketById(selectedTicket.id);
      if (updated) {
        setSelectedTicket(updated);
      }
    }
  }, [selectedTicket]);

  const selectTicket = useCallback((ticketId: string) => {
    const ticket = getTicketById(ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      if (ticket.status === 'open') {
        updateTicket(ticketId, { status: 'in-progress', assignedAgentId: 'current-agent' });
      }
    }
  }, []);

  const sendAgentMessage = useCallback((text: string) => {
    if (!selectedTicket) return;

    const agentMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      senderId: 'agent',
      senderName: 'Support Agent',
      timestamp: Date.now(),
    };

    const updatedMessages = [...selectedTicket.messages, agentMessage];
    const updatedTicket = {
      ...selectedTicket,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    updateTicket(selectedTicket.id, updatedTicket);
    setSelectedTicket(updatedTicket);
    refreshTickets();
  }, [selectedTicket, refreshTickets]);

  const updateTicketStatus = useCallback((ticketId: string, status: SupportTicket['status']) => {
    updateTicket(ticketId, { status });
    refreshTickets();
    if (selectedTicket?.id === ticketId) {
      const updated = getTicketById(ticketId);
      if (updated) setSelectedTicket(updated);
    }
  }, [selectedTicket, refreshTickets]);

  const updateTicketPriority = useCallback((ticketId: string, priority: SupportTicket['priority']) => {
    updateTicket(ticketId, { priority });
    refreshTickets();
    if (selectedTicket?.id === ticketId) {
      const updated = getTicketById(ticketId);
      if (updated) setSelectedTicket(updated);
    }
  }, [selectedTicket, refreshTickets]);

  const addAgentNote = useCallback((ticketId: string, note: string) => {
    updateTicket(ticketId, { agentNotes: note });
    refreshTickets();
    if (selectedTicket?.id === ticketId) {
      const updated = getTicketById(ticketId);
      if (updated) setSelectedTicket(updated);
    }
  }, [selectedTicket, refreshTickets]);

  return (
    <SupportContext.Provider
      value={{
        tickets,
        selectedTicket,
        selectTicket,
        sendAgentMessage,
        updateTicketStatus,
        updateTicketPriority,
        addAgentNote,
        refreshTickets,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
}

