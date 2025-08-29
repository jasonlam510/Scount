import { Transaction } from '../../types/transactions';

// Mock transactions based on seed data
export const mockTransactions: Transaction[] = [
  // July 24 - 1 personal expense with tag 'gf'
  {
    id: '1',
    group_id: undefined,
    is_personal: true,
    title: 'Coffee with girlfriend',
    amount: 45.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-24T12:00:00Z').getTime(),
    subcategory_id: '4', // Coffee
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },

  // July 25 - 1 personal expense without tag
  {
    id: '2',
    group_id: undefined,
    is_personal: true,
    title: 'Lunch at office',
    amount: 68.50,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-25T13:00:00Z').getTime(),
    subcategory_id: '2', // Lunch
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },

  // July 26 - 6 expenses (2 group 煮飯仔, 1 group Iceland, 3 personal)
  {
    id: '3',
    group_id: '1', // 煮飯仔
    is_personal: false,
    title: 'Dinner at 煮飯仔',
    amount: 156.80,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T19:00:00Z').getTime(),
    subcategory_id: '3', // Dinner
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },

  {
    id: '4',
    group_id: '1', // 煮飯仔
    is_personal: false,
    title: 'Breakfast at 煮飯仔',
    amount: 32.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T08:00:00Z').getTime(),
    subcategory_id: '1', // Breakfast
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },

  {
    id: '5',
    group_id: '2', // Iceland
    is_personal: false,
    title: 'Iceland trip accommodation',
    amount: 1200.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T15:00:00Z').getTime(),
    subcategory_id: '7', // Airbnb
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },

  {
    id: '6',
    group_id: undefined,
    is_personal: true,
    title: 'Personal taxi ride',
    amount: 45.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T10:00:00Z').getTime(),
    subcategory_id: '5', // Taxi
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },

  {
    id: '7',
    group_id: undefined,
    is_personal: true,
    title: 'Personal lunch',
    amount: 55.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T12:30:00Z').getTime(),
    subcategory_id: '2', // Lunch
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },

  {
    id: '8',
    group_id: undefined,
    is_personal: true,
    title: 'Personal dinner',
    amount: 88.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T20:00:00Z').getTime(),
    subcategory_id: '3', // Dinner
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  }
];

