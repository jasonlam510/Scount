// Legacy interface for backward compatibility (can be removed later)
export interface Expense {
  id: string;
  description: string;
  payer: string;
  amount: number;
  currency: string;
  type: 'expense' | 'income';
  icon: string;
  date: string;
  category?: string;
  tags?: string[];
}

// Legacy mock expenses derived from transactions for backward compatibility
export const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Coffee with girlfriend',
    payer: 'Shirley',
    amount: 45.00,
    currency: 'HK$',
    type: 'expense',
    icon: '☕',
    date: '2024-07-24',
    category: 'Coffee',
    tags: ['gf']
  },
  {
    id: '2',
    description: 'Lunch at office',
    payer: 'Shirley',
    amount: 68.50,
    currency: 'HK$',
    type: 'expense',
    icon: '🍽️',
    date: '2024-07-25',
    category: 'Lunch',
    tags: []
  },
  {
    id: '3',
    description: 'Dinner at 煮飯仔',
    payer: 'Shirley',
    amount: 156.80,
    currency: 'HK$',
    type: 'expense',
    icon: '🍴',
    date: '2024-07-26',
    category: 'Dinner',
    tags: []
  },
  {
    id: '4',
    description: 'Breakfast at 煮飯仔',
    payer: 'Shirley',
    amount: 32.00,
    currency: 'HK$',
    type: 'expense',
    icon: '🍳',
    date: '2024-07-26',
    category: 'Breakfast',
    tags: []
  },
  {
    id: '5',
    description: 'Iceland trip accommodation',
    payer: 'Shirley',
    amount: 1200.00,
    currency: 'HK$',
    type: 'expense',
    icon: '🏠',
    date: '2024-07-26',
    category: 'Airbnb',
    tags: []
  },
  {
    id: '6',
    description: 'Personal taxi ride',
    payer: 'Shirley',
    amount: 45.00,
    currency: 'HK$',
    type: 'expense',
    icon: '🚕',
    date: '2024-07-26',
    category: 'Taxi',
    tags: []
  },
  {
    id: '7',
    description: 'Personal lunch',
    payer: 'Shirley',
    amount: 55.00,
    currency: 'HK$',
    type: 'expense',
    icon: '🍽️',
    date: '2024-07-26',
    category: 'Lunch',
    tags: []
  },
  {
    id: '8',
    description: 'Personal dinner',
    payer: 'Shirley',
    amount: 88.00,
    currency: 'HK$',
    type: 'expense',
    icon: '🍴',
    date: '2024-07-26',
    category: 'Dinner',
    tags: []
  }
];

