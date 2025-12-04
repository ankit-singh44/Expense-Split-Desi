export type Category = 'Food' | 'Travel' | 'Shopping' | 'Course' | 'Other';

export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  payerId: string;
  involvedIds: string[]; // List of participant IDs who share this expense
  date: string; // ISO string
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}

export interface SettlementSummary {
  totalSpent: number;
  settlements: Settlement[];
  balances: Record<string, number>; // Positive = receives money, Negative = owes money
}