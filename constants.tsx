
import { Transaction } from './types';

export const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Subscriptions',
  'Misc'
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-05-01T23:45:00', amount: 85.20, category: 'Shopping', description: 'Amazon Late Night Order' },
  { id: '2', date: '2024-05-02T12:30:00', amount: 15.50, category: 'Food & Dining', description: 'Lunch' },
  { id: '3', date: '2024-05-05T01:15:00', amount: 45.00, category: 'Entertainment', description: 'Bar/Club' },
  { id: '4', date: '2024-05-15T09:00:00', amount: 1200.00, category: 'Bills & Utilities', description: 'Rent' },
  { id: '5', date: '2024-05-25T18:00:00', amount: 150.00, category: 'Shopping', description: 'Weekend Splurge' },
  { id: '6', date: '2024-05-26T22:30:00', amount: 12.99, category: 'Subscriptions', description: 'Netflix' },
  { id: '7', date: '2024-05-30T10:00:00', amount: 300.00, category: 'Shopping', description: 'Payday Reward' },
];
