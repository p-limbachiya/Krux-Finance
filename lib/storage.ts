import { User, SupportTicket, Message } from '@/types';

const STORAGE_KEYS = {
  USERS: 'krux_users',
  TICKETS: 'krux_tickets',
  MESSAGES: 'krux_messages',
  CURRENT_USER: 'krux_current_user',
} as const;

// Initialize mock users
export const initializeMockUsers = () => {
  const users: User[] = [
    {
      id: 'customer-1',
      name: 'Rahul Sharma',
      phone: '+919876543210',
      role: 'customer',
    },
    {
      id: 'customer-2',
      name: 'Priya Patel',
      phone: '+919876543211',
      role: 'customer',
    },
    {
      id: 'agent-1',
      name: 'Amit Kumar',
      username: 'amit.kumar',
      role: 'agent',
    },
    {
      id: 'agent-2',
      name: 'Sneha Singh',
      username: 'sneha.singh',
      role: 'agent',
    },
  ];

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  return users;
};

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!stored) return initializeMockUsers();
  return JSON.parse(stored);
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getTickets = (): SupportTicket[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.TICKETS);
  return stored ? JSON.parse(stored) : [];
};

export const saveTickets = (tickets: SupportTicket[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
};

export const addTicket = (ticket: SupportTicket) => {
  const tickets = getTickets();
  tickets.push(ticket);
  saveTickets(tickets);
  return ticket;
};

export const updateTicket = (ticketId: string, updates: Partial<SupportTicket>) => {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  if (index !== -1) {
    tickets[index] = { ...tickets[index], ...updates, updatedAt: Date.now() };
    saveTickets(tickets);
    return tickets[index];
  }
  return null;
};

export const getTicketById = (ticketId: string): SupportTicket | null => {
  const tickets = getTickets();
  return tickets.find(t => t.id === ticketId) || null;
};

export const getTicketsByCustomerId = (customerId: string): SupportTicket[] => {
  const tickets = getTickets();
  return tickets.filter(t => t.customerId === customerId);
};

