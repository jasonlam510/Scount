import { Category } from '../../types/categories';

// Mock categories based on seed data
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'F&B',
    type: 'expense',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '2',
    name: 'Transport',
    type: 'expense',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '3',
    name: 'Accommodation',
    type: 'expense',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  }
];

