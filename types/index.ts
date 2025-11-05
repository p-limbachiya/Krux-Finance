export type UserRole = 'customer' | 'agent';

export interface User {
  id: string;
  name: string;
  phone?: string;
  username?: string;
  role: UserRole;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  isBot?: boolean;
  isSystem?: boolean;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: 'open' | 'in-progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'loan-application' | 'document-requirements' | 'application-status' | 'general';
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  assignedAgentId?: string;
  agentNotes?: string;
  responseTime?: number;
}

export interface BotResponse {
  text: string;
  suggestions?: string[];
  requiresAgent?: boolean;
}

