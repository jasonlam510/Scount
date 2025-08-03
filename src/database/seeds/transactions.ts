/**
 * Seed data for sample transactions
 * Note: IDs will be set dynamically based on created entities
 */
export const seedTransactions = [
  // July 24 - 1 personal expense with tag 'gf'
  {
    title: 'Coffee with girlfriend',
    amount: 45.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-24T12:00:00Z').getTime(),
    isPersonal: true,
    subcategoryName: 'Coffee',
    tags: ['gf'],
    payers: [
      { userName: 'Shirley', amount: 45.00 }
    ]
  },

  // July 25 - 1 personal expense without tag
  {
    title: 'Lunch at office',
    amount: 68.50,  
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-25T13:00:00Z').getTime(),
    isPersonal: true,
    subcategoryName: 'Lunch',
    tags: [],
    payers: [
      { userName: 'Shirley', amount: 68.50 }
    ]
  },

  // July 26 - 6 expenses (2 group 煮飯仔, 1 group Iceland, 3 personal)
  {
    title: 'Dinner at 煮飯仔',
    amount: 156.80,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T19:00:00Z').getTime(),
    isPersonal: false,
    groupTitle: '煮飯仔',
    subcategoryName: 'Dinner',
    tags: [],
    payers: [
      { userName: 'Shirley', amount: 156.80 }
    ]
  },

  {
    title: 'Breakfast at 煮飯仔',
    amount: 32.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T08:00:00Z').getTime(),
    isPersonal: false,
    groupTitle: '煮飯仔',
    subcategoryName: 'Breakfast',
    tags: [],
    payers: [
      { userName: 'Shirley', amount: 32.00 }
    ]
  },

  {
    title: 'Iceland trip accommodation',
    amount: 1200.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T15:00:00Z').getTime(),
    isPersonal: false,
    groupTitle: 'Iceland',
    subcategoryName: 'Airbnb',
    tags: [],
    payers: [
      { userName: 'Shirley', amount: 1200.00 }
    ]
  },

  {
    title: 'Personal taxi ride',
    amount: 45.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T10:00:00Z').getTime(),
    isPersonal: true,
    subcategoryName: 'Taxi',
    tags: [],
    payers: [
      { userName: 'Shirley', amount: 45.00 }
    ]
  },

  {
    title: 'Personal lunch',
    amount: 55.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T12:30:00Z').getTime(),
    isPersonal: true,
    subcategoryName: 'Lunch',
    tags: [],
    payers: [
      { userName: 'Shirley', amount: 55.00 }
    ]
  },

  {
    title: 'Personal dinner',
    amount: 88.00,
    currency: 'HK$',
    type: 'expense',
    date: new Date('2024-07-26T20:00:00Z').getTime(),
    isPersonal: true,
    subcategoryName: 'Dinner',
    tags: [],
    payers: [
      { userName: 'Shirley', amount: 88.00 }
    ]
  }
] 